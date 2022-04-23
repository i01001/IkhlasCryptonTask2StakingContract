import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';
import { ethers, network} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {IUniswapV2Router02, IUniswapV2Factory, StakingIkhlasToken, IkhlasToken, IUniswapV2Pair} from '../typechain'

const MIN_LIQUIDITY = 10**3;

async function getCurrentTime(){
    return (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
  }

async function evm_increaseTime(seconds : number){
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
  }

describe("Testing LP-staking with fork", () =>{
    let  router : IUniswapV2Router02;
    let token : IkhlasToken;
    let staking : StakingIkhlasToken;
    let factory : IUniswapV2Factory;
    let lptoken : IUniswapV2Pair;

    let clean : any;
    let owner : SignerWithAddress, staker_one : SignerWithAddress, staker_two: SignerWithAddress;
    
    before(async () => {

        [owner, staker_one, staker_two] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("IkhlasToken");
        token = <IkhlasToken>(await Token.deploy());
        await token.deployed();

        router = <IUniswapV2Router02>(await ethers.getContractAt("IUniswapV2Router02", process.env.ROUTER_ADDRESS as string));
        factory = <IUniswapV2Factory>(await ethers.getContractAt("IUniswapV2Factory", process.env.FACTORY_ADDRESS as string));

        await token.transfer(staker_one.address, ethers.utils.parseUnits("20000", await token.decimals()));
        await token.transfer(staker_two.address, ethers.utils.parseUnits("20000", await token.decimals()));
        await token.connect(staker_one).approve(router.address, ethers.utils.parseUnits("10000"));
        await token.connect(staker_two).approve(router.address, ethers.utils.parseUnits("10000"));

        let deadline = await getCurrentTime() + 100;
        
        await router.connect(staker_one).addLiquidityETH(
            token.address,
            ethers.utils.parseUnits("10000", await token.decimals()),
            0,
            ethers.utils.parseEther("1"),
            staker_one.address,
            deadline,
            { value: ethers.utils.parseEther("1") }
        );

        deadline = await getCurrentTime() + 100
        await router.connect(staker_two).addLiquidityETH(
            token.address,
            ethers.utils.parseUnits("10000", await token.decimals()),
            0,
            ethers.utils.parseEther("1"),
            staker_two.address,
            deadline,
            { value: ethers.utils.parseEther("1") }
        );

        lptoken = <IUniswapV2Pair>(await ethers.getContractAt(
            "IUniswapV2Pair", 
            await factory.getPair(token.address, process.env.WETH_ADDRESS as string))
        );

        const Staking = await ethers.getContractFactory("StakingIkhlasToken");
        staking = <StakingIkhlasToken>(await Staking.deploy());
        await staking.deployed();
        await token.transfer(staking.address,  ethers.utils.parseUnits("90000", await token.decimals()));
        await lptoken.connect(staker_one).approve(staking.address, ethers.utils.parseUnits("1000", await lptoken.decimals()));
        await lptoken.connect(staker_two).approve(staking.address, ethers.utils.parseUnits("1000", await lptoken.decimals()));
    });

    describe("Checking constructor correctly run", () => {
        it("Checks the contract owner is correctly set as owner", async () => {
            expect(await staking._owner()).to.be.equal(owner.address);
        })
    })

    describe("Checking SetERCContract Function correctly run", () => {
        it("Checks whether non-owner is prevented from accessing the function", async () => {
            await expect(staking.connect(staker_one).setERCContract(staker_two.address)).to.be.revertedWith("This message can be carried out by owner only!");
        })

        it("Allows the owner to set the function", async () => {
            await staking.connect(owner).setERCContract(token.address);
            expect(await staking.targetAddress()).to.be.equal(token.address);
        })
    })

    describe("Checking the stake function", () => {
        it("Checks whether the stake function does not accept a 0 input", async () => {
            await expect(staking.connect(staker_one).stake(0)).to.be.revertedWith("Need to enter a greater amount!");
        })
        it("Checks whether the 10 minute period has passed prior to staking", async () => {
            await expect(staking.connect(staker_one).stake(100)).to.be.revertedWith("Cannot stake within 10 minutes of contract being set up!");
        })
        it("Checks whether after the 10 minute period has passed staking is accepted", async () => {
            await evm_increaseTime(10*60);
            await token.connect(owner).setStakingContract(staking.address);
            expect(await staking.connect(staker_one).stake(ethers.utils.parseUnits("100"))).to.emit(staking, "staked").withArgs();
        })       
        it("Check whether a second stake by same user is accepted", async () => {
            await token.connect(owner).setStakingContract(staking.address);
            expect(await staking.connect(staker_one).stake(ethers.utils.parseUnits("100"))).to.emit(staking, "staked").withArgs();
        })       
        it("Checks whether the claim function does not return any rewards within first 10 minutes as no rewards exist", async () => {
            await expect(staking.connect(staker_one).claim()).to.be.revertedWith("No rewards exist!");
        })
        it("Checks whether the claim function works after the 10 minutes", async () => {
            await evm_increaseTime(10*60);
            await expect(staking.connect(staker_one).claim()).to.emit(staking, "_unstake").withArgs(staker_one.address, 1, ethers.utils.parseUnits("4"));
        })
        it("Checks whether the unstake function does not return any rewards within 20 minutes of unstake/claim", async () => {
            await expect(staking.connect(staker_one).unstake()).to.be.revertedWith("Cannot unstake within 20 minutes of staking/claiming!");
        })
        it("Checks whether the freeze function prevent unstaking", async () => {
            await evm_increaseTime(20*60);
            await staking.connect(owner).freeze();
            await expect(staking.connect(staker_one).unstake()).to.be.revertedWith("freeze in effect, cannot unstake!");
        })
        it("Checks whether the unstake function works as expected", async () => {
            await staking.connect(owner).freeze();
            await expect(staking.connect(staker_one).unstake()).to.emit(staking, "_unstake").withArgs(staker_one.address, 1, ethers.utils.parseUnits("200"));
        })
        it("Checks whether the percentage function can only be accessed by owner", async () => {
            await expect(staking.connect(staker_one).percentageChange(3)).to.be.revertedWith("This message can be carried out by owner only!");
        })
        it("Checks whether the percentage function changes as expected", async () => {
            await staking.connect(owner).percentageChange(3);
            expect(await staking.rewardrate()).to.be.equal(3);
        })


    })
    



});