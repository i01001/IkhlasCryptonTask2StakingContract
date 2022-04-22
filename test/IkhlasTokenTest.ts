import { IkhlasToken__factory } from '../typechain/factories/IkhlasToken__factory';
// import { IkhlasToken } from '../typechain';
import { task } from "hardhat/config";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { expect } from "chai";
import { ethers } from "hardhat";
import { assert } from "chai";
import { BigNumber } from "ethers";

const { waffle } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;

// import { Contract } from 'ethers';
import chai from "chai";
// import { solidity } from "ethereum-waffle";
// import { IkhlasToken } from "../typechain/IkhlasToken";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
// import type { IkhlasToken, IkhlasTokenInterface } from "../typechain/IkhlasToken";


describe("Prior set up", function () {
let ikhlasToken: any;
let signers: any;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers[0]).deploy();
    await ikhlasToken.deployed();

    // const IkhlasToken = await ethers.getContractFactory("IkhlasToken");
    // const ikhlasToken = await IkhlasToken.deploy();
    // await ikhlasToken.deployed();
  })

   it("Should return the defined symbol, name and decimals for the token", async function () {
    const signers = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers[0]).deploy();
    assert.equal(await ikhlasToken.symbol(), ("IKH1"));
    expect(await ikhlasToken.name()).to.equal("Ikhlas NEW coin");
    expect(await ikhlasToken.decimals()).to.equal(18);
  })

  it("Should return the name with the name function", async () => {
    const signers = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers[0]).deploy();
    expect(await ikhlasToken.name()).to.equal("Ikhlas NEW coin");
  });

  it("Should return the symbol with the symbol function", async () => {
    const signers = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers[0]).deploy();
    expect(await ikhlasToken.symbol()).to.equal("IKH1");
  });

  it("Should return the decimal with the decimal function", async () => {
    const signers = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers[0]).deploy();
    expect(await ikhlasToken.decimals()).to.equal(18);
  });

  it("Should return the total supply with the total supply function", async () => {
    const signers = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers[0]).deploy();
    expect(await ikhlasToken.totalSupply()).to.be.equal(ethers.utils.parseUnits("1", 24));
  });

  it("Should return the correct balanceof with the balanceof function", async () =>  {
    const signers = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers[0]).deploy();
    expect(await ikhlasToken.balanceOf(signers[0].address)).to.be.equal(ethers.utils.parseUnits("1", 24));
  });

  it("Should increase the approve with the approve function", async () => {
    const [signers, second] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    expect(await ikhlasToken.connect(signers).approve(second.address, (ethers.utils.parseUnits("1", 20)))).to.emit(ikhlasToken, "Approval").withArgs(signers.address, second.address, (ethers.utils.parseUnits("1", 20)));
  });

  it("Should check the balance of msg.sender about availability of tokens greater than value prior to executing the approve function", async () => {
    const [signers, second] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await expect(ikhlasToken.connect(signers).approve(second.address, (ethers.utils.parseUnits("2", 24)))).to.be.revertedWith("msg.sender does not have sufficient tokens");
  });

  it("Should check if msg.sender token balance is greater than the value prior to executing the transfer function", async () => {
    const [signers, second] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await expect(ikhlasToken.connect(signers).transfer(second.address, (ethers.utils.parseUnits("2", 24)))).to.be.revertedWith("msg.sender does not have sufficient tokens");
  });

  it("Should transfer the tokens with the transfer function", async () => {
    const [signers, second] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    expect(await ikhlasToken.connect(signers).transfer(second.address, (ethers.utils.parseUnits("1", 20)))).to.emit(ikhlasToken, "Transfer").withArgs(signers.address, second.address, (ethers.utils.parseUnits("1", 20)));
  });
  
  it("Should transfer the tokens with the transferfrom function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await ikhlasToken.connect(signers).approve(second.address, (ethers.utils.parseUnits("1", 20)));
    expect(await ikhlasToken.connect(second).transferFrom(signers.address, third.address, (ethers.utils.parseUnits("1", 20)))).to.emit(ikhlasToken, "Transfer").withArgs(signers.address, third.address, (ethers.utils.parseUnits("1", 20)));
  });

  it("Should check availability of tokens in message sender prior to executing the the tokens with the transferfrom function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await ikhlasToken.connect(signers).approve(second.address, (ethers.utils.parseUnits("1", 20)));
    await expect(ikhlasToken.connect(second).transferFrom(signers.address, third.address, (ethers.utils.parseUnits("2", 24)))).to.be.revertedWith("msg.sender does not have sufficient tokens");
  });

  it("Should check allowance balance of tokens prior to executing the transferfrom function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await ikhlasToken.connect(signers).approve(second.address, (ethers.utils.parseUnits("1", 20)));
    await expect(ikhlasToken.connect(second).transferFrom(signers.address, third.address, (ethers.utils.parseUnits("2", 21)))).to.be.revertedWith("value exceeding the allowance limit");
  });

  it("Should display the allowance with the Allowance function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await ikhlasToken.connect(signers).approve(second.address, (ethers.utils.parseUnits("1", 20)));
    expect(await ikhlasToken.connect(second).allowance(signers.address, second.address)).to.be.equal(ethers.utils.parseUnits("1", 20));
  });

  it("Should not allow non-owner to run the mint function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await expect (ikhlasToken.connect(second).mint(second.address, (ethers.utils.parseUnits("1", 20)))).to.be.revertedWith('This transaction can only be carried out by owner!');
  });

  it("Should allow owner to run the mint function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    expect (await ikhlasToken.connect(signers).mint(second.address, (ethers.utils.parseUnits("1", 20)))).to.emit(ikhlasToken, "Transfer").withArgs('0x0000000000000000000000000000000000000000', second.address, (ethers.utils.parseUnits("1", 20)));
  });

  it("Should not allow non-owner to run the burn function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await expect (ikhlasToken.connect(second).burn(second.address, (ethers.utils.parseUnits("1", 20)))).to.be.revertedWith('This transaction can only be carried out by owner!');
  });

  it("Should check if address from which funds will be burned has sufficent tokens prior to running the burn function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await ikhlasToken.connect(signers).transfer(second.address, (ethers.utils.parseUnits("1", 20)));
    await expect (ikhlasToken.connect(signers).burn(second.address, (ethers.utils.parseUnits("2", 20)))).to.be.revertedWith("value to be burned exceeds the balance");
  });

  it("Should allow owner to run the burn function", async () => {
    const [signers, second, third] = await ethers.getSigners();
    const ikhlasToken = await new IkhlasToken__factory(signers).deploy();
    await ikhlasToken.connect(signers).transfer(second.address, (ethers.utils.parseUnits("1", 20)));
    expect (await ikhlasToken.connect(signers).burn(second.address, (ethers.utils.parseUnits("1", 20)))).to.emit(ikhlasToken, "Transfer").withArgs(second.address, '0x0000000000000000000000000000000000000000', (ethers.utils.parseUnits("1", 20)));
  });

});
