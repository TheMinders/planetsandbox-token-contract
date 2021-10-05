import hre from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { expect } from "chai";

describe("PlanetSandbox", function () {
  let owner: Contract;
  let PulvisToken: ContractFactory;
  let ownerAddress: string;
  let testAddress: string;
  const mintAmount = 1000000;

  before(async function () {
    PulvisToken = await hre.ethers.getContractFactory("PulvisToken");
    owner = await PulvisToken.deploy();

    await owner.deployed();
    ownerAddress = await owner.signer.getAddress();
    testAddress = owner.address;
  });

  describe("Add role minter", function () {
    it("Should mint fail if user not has role", async () => {
      let errorMessage = "";
      try {
        await owner.mint(testAddress, 1000000);
      } catch (err: any) {
        errorMessage = err.message;
      }
      expect(errorMessage.includes("Pulvis: MINTER role required")).equal(true);
    });

    it("Should burn fail if user not has role", async () => {
      let errorMessage = "";
      try {
        await owner.burn(testAddress, 1000000);
      } catch (err: any) {
        errorMessage = err.message;
      }
      expect(errorMessage.includes("Pulvis: MINTER role required")).equal(true);
    });

    it("Should mint success if user has role", async () => {
      const MINTER_ROLE = await owner.MINTER_ROLE();

      await owner.grantRole(MINTER_ROLE, ownerAddress);

      await owner.mint(testAddress, mintAmount);
      const balanceOfUser = await owner.balanceOf(testAddress);

      expect(balanceOfUser).equal(mintAmount);
    });

    it("Should burn success if user has role", async () => {
      const MINTER_ROLE = await owner.MINTER_ROLE();

      await owner.grantRole(MINTER_ROLE, ownerAddress);
      
      await owner.burn(testAddress, mintAmount);
      const balanceOfUser = await owner.balanceOf(testAddress);

      expect(balanceOfUser).equal(0);
    });
  });
});
