import { task } from "hardhat/config";
// import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";
import "@nomiclabs/hardhat-web3";


task("stake", "Add tokens to be staked")
.addParam("amount", "Amount to be staked")
.setAction(async (taskArgs,hre) => {
  const [sender, secondaccount, thirdaccount, fourthaccount] = await hre.ethers.getSigners();
  const StakingIkhlasToken = await hre.ethers.getContractFactory("StakingIkhlasToken");
  const stakingIkhlasToken = await StakingIkhlasToken.deploy();
  await stakingIkhlasToken.deployed();

  let output = await stakingIkhlasToken.connect(sender).stake(taskArgs.amount);

console.log(await output);
});