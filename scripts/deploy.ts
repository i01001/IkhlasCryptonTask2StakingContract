// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const StakingIkhlasToken = await ethers.getContractFactory("StakingIkhlasToken");
  const stakingIkhlasToken = await StakingIkhlasToken.deploy();
  await stakingIkhlasToken.deployed();

  console.log("StakingIkhlasToken deployed to:", stakingIkhlasToken.address);

  const IkhlasToken = await ethers.getContractFactory("IkhlasToken");
  const ikhlasToken = await IkhlasToken.deploy();
  await ikhlasToken.deployed();

  console.log("IkhlasToken deployed to:", ikhlasToken.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
