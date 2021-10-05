import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("deploy:pulv")
  .addFlag("verify", "Verify contracts at Etherscan")
  .setAction(async ({ verify }, hre: HardhatRuntimeEnvironment) => {
    const tokenFactory = await hre.ethers.getContractFactory("PulvisToken");
    const token = await tokenFactory.deploy();
    await token.deployed();
    console.log("token deployed to: ", token.address);

    // We need to wait a little bit to verify the contract after deployment
    await delay(30000);
    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: [],
      libraries: {},
    });
  });

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
