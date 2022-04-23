import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-web3";
import "uniswap-v3-deploy-plugin";
import "./tasks/index.ts";

dotenv.config();

let mnemonic = process.env.MNEMONIC;
let INFURA_KEY = process.env.INFURA_KEY;
let ALCHEMY_KEY = process.env.ALCHEMY_KEY;

const config: HardhatUserConfig = {
  solidity: {
      compilers: [
        {
          version: '0.6.2',
        },
        {
          version: '0.8.11',
        }
                ]
  },
  networks: {
      hardhat: {
          forking: {
              url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
              blockNumber: 14639968
          }
      },
  },
  etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY
  },
};

export default config;
