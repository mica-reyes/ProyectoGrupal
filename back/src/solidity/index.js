const Web3 = require("web3");
const web3Provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
const TruffleContract = require("truffle-contract")
const TetherContractJSON = require("./build/contracts/Tether.json");
const BinanceContractJSON = require("./build/contracts/Binance.json");
const HenryContractJSON = require("./build/contracts/Henry.json");

const contracts = [TetherContractJSON, BinanceContractJSON, HenryContractJSON].map(contract => TruffleContract(contract));
contracts.forEach(contract => contract.setProvider(web3Provider));

module.exports = async function () {
  const deployed = await Promise.all(contracts.map(contract => contract.deployed()));
  deployed.forEach(async contract => {
    const name = await contract.name()
    const symbol = await contract.symbol()
    console.log(name, symbol, contract.address);
  });
};
