import { task } from "hardhat/config";
// import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";
import "@nomiclabs/hardhat-web3";


task("unstake", "Withdraw the staked tokens")
.setAction(async (taskArgs,hre) => {
  const [sender, secondaccount, thirdaccount, fourthaccount] = await hre.ethers.getSigners();
  const StakingIkhlasToken = await hre.ethers.getContractFactory("StakingIkhlasToken");
  const stakingIkhlasToken = await StakingIkhlasToken.deploy();
  await stakingIkhlasToken.deployed();

  let output = await stakingIkhlasToken.connect(sender).unstake();

console.log(await output);
});