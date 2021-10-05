import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("deploy:psb")
  .addFlag("verify", "Verify contracts at Etherscan")
  .setAction(async ({}, hre: HardhatRuntimeEnvironment) => {
    const multiSigAccount = "0xF9560642f3450fA82DC63639CC7C9E918B7628Ac";
    const tokenFactory = await hre.ethers.getContractFactory("PlanetSandboxToken");
    const token = await tokenFactory.deploy(multiSigAccount);
    await token.deployed();
    console.log("token deployed to: ", token.address);

    // We need to wait a little bit to verify the contract after deployment
    await delay(30000);
    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: [multiSigAccount],
      libraries: {},
    });
  });

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
