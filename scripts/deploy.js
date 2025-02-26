// SPDX-License-Identifier: MIT
const { ethers } = require("hardhat");

async function deployContracts() {
  // Deploy HealpassToken
  const HealpassToken = await ethers.getContractFactory("HealpassToken");
  const token = await HealpassToken.deploy();
  const tokenTx = await token.deploymentTransaction();
  await tokenTx.wait();
  const tokenAddress = await token.getAddress();
  console.log(`HealpassToken deployed at: ${tokenAddress}`);

  // Deploy HealpassDAO with HealpassToken address
  const HealpassDAO = await ethers.getContractFactory("HealpassDAO");
  const dao = await HealpassDAO.deploy(tokenAddress);
  const daoTx = await dao.deploymentTransaction();
  await daoTx.wait();
  const daoAddress = await dao.getAddress();
  console.log(`HealpassDAO deployed at: ${daoAddress}`);

  return { tokenAddress, daoAddress };
}

deployContracts()
  .then(({ tokenAddress, daoAddress }) => {
    console.log("Deployment completed!");
    console.log(`Token Address: ${tokenAddress}`);
    console.log(`DAO Address: ${daoAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });