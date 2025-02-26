// SPDX-License-Identifier: MIT
const { ethers } = require("hardhat");

async function deployContract() {
    const Test = await ethers.getContractFactory("HealpassToken");

    console.log('\nDeploying Contract...');

    const TestContract = await Test.deploy();

    const tx = await TestContract.deploymentTransaction();
    
    console.log(`Contract deployed successfully.\n`);
    console.log(`Transaction Hash: ${tx.hash}`);

    const address = await TestContract.getAddress();
    console.log(`Contract Address: ${address}\n`);
}

deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });