import hre from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";

import { testnetBeneficiaries } from "../../config/testnetBeneficiaries";

describe("PlanetSandbox", function () {
  let owner: Contract;
  let user: Contract;
  let PlanetSandbox: ContractFactory;
  const daysOfMonth = 30 * 24 * 60 * 60;
  const beneficiaries = testnetBeneficiaries;
  const startTestTime = Math.round(Date.now() / 1000);

  before(async function () {
    PlanetSandbox = await hre.ethers.getContractFactory("PlanetSandboxVestingMock");
    owner = await PlanetSandbox.deploy("PlanetSandbox Token", "PSB");

    await owner.deployed();

    user = await hre.ethers.getContractAt("PlanetSandboxVestingMock", beneficiaries[0].address);
    await owner.setTokenVestingTime(BigNumber.from(startTestTime + 5));
  });

  describe("Add vesting", function () {
    it("Add vesting success", async () => {
      await Promise.all(
        beneficiaries.map(item =>
          owner.addVestingToken(
            item.address,
            item.amount,
            item.cliff,
            item.releaseTotalRounds,
            item.daysPerRound,
            item.tgePercent,
            item.releaseTgeRounds,
          ),
        ),
      );
      const vesting = await owner.getVestingInfoByUser(beneficiaries[0].address);
      expect(vesting.isActive).equal(true);
    });
  });

  describe("Claim vesting", function () {
    it("Unlock TGE round 1", async () => {
      const beneficiary = beneficiaries[0];
      await owner.setBlockTimestamp(BigNumber.from(startTestTime + 10));
      const claimable = await owner.getVestingClaimableAmount(beneficiary.address);
      const tgeRoundOneRelease = beneficiary.amount
        .mul(1)
        .div(beneficiary.releaseTgeRounds)
        .mul(beneficiary.tgePercent)
        .div(100);

      expect(claimable).equal(tgeRoundOneRelease);
    });

    it("Unlock TGE round 2", async () => {
      const beneficiary = beneficiaries[0];
      await owner.setBlockTimestamp(BigNumber.from(startTestTime + daysOfMonth + 10));
      const claimable = await owner.getVestingClaimableAmount(beneficiary.address);
      const tgeRoundTwoRelease = beneficiary.amount
        .mul(2)
        .div(beneficiary.releaseTgeRounds)
        .mul(beneficiary.tgePercent)
        .div(100);

      expect(claimable).equal(tgeRoundTwoRelease);
    });

    it("Unlock vesting round 1", async () => {
      const beneficiary = beneficiaries[0];
      await owner.setBlockTimestamp(BigNumber.from(startTestTime + 4 * daysOfMonth + 10));
      const claimable = await owner.getVestingClaimableAmount(beneficiary.address);
      const tgeRoundRelease = beneficiary.amount.mul(beneficiary.tgePercent).div(100);
      const vestingRoundOneRelease = beneficiary.amount.sub(tgeRoundRelease).mul(1).div(beneficiary.releaseTotalRounds);

      expect(claimable).equal(tgeRoundRelease.add(vestingRoundOneRelease));
    });

    it("Unlock vesting round 2", async () => {
      const beneficiary = beneficiaries[0];
      await owner.setBlockTimestamp(BigNumber.from(startTestTime + 5 * daysOfMonth + 10));
      const claimable = await owner.getVestingClaimableAmount(beneficiary.address);
      const tgeRoundRelease = beneficiary.amount.mul(beneficiary.tgePercent).div(100);
      const vestingRoundOneRelease = beneficiary.amount.sub(tgeRoundRelease).mul(2).div(beneficiary.releaseTotalRounds);

      expect(claimable).equal(tgeRoundRelease.add(vestingRoundOneRelease));
    });

    it("Unlock vesting last round", async () => {
      const beneficiary = beneficiaries[0];
      await owner.setBlockTimestamp(BigNumber.from(startTestTime + 15 * daysOfMonth + 10));
      const claimable = await owner.getVestingClaimableAmount(beneficiary.address);

      expect(claimable).equal(beneficiary.amount);
    });
  });
});
