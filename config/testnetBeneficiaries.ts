import { IBeneficiary } from "@interfaces/IBeneficiary";
import { BigNumber } from "@ethersproject/bignumber";
import { DAYS_OF_MONTH, DECIMAL_MULTIPLIER, ONE_MILLION } from "./constant";

export const testnetBeneficiaries: IBeneficiary[] = [
  // Total supply 100m 100,000,000
  // ==========================================
  // Total seed, private, public 20% 20,000,000

  // seed 3,000,000
  {
    address: "0x997749b71602b28dceb13c7f36b7baf95a96a90b",
    amount: BigNumber.from(3).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 3% 3m
    tgePercent: 10, // total tge percent for all tge round
    releaseTgeRounds: 2, // interval 30 days
    cliff: 3 * DAYS_OF_MONTH, // lock 3 months after the first month from the start time vesting
    releaseTotalRounds: 12, // total time vesting 15 months
    daysPerRound: DAYS_OF_MONTH, // 1 month
  },
  // // private 15,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(15).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 15% 15m
  //   tgePercent: 10, // total tge percent for all tge round
  //   releaseTgeRounds: 2, // interval 30 days
  //   cliff: 3 * DAYS_OF_MONTH, // lock 3 months after the first month from the start time vesting
  //   releaseTotalRounds: 9, // total time vesting 12 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
  // // public 2,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(2).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 2% 2m
  //   tgePercent: 50, // total tge percent for all tge round
  //   releaseTgeRounds: 1, // interval 30 days
  //   cliff: 0, // only lock first month from the start time vesting
  //   releaseTotalRounds: 2, // total time vesting 2 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
  // // team & advisors 20,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(20).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 20% 20m
  //   tgePercent: 0, // total tge percent for all tge round
  //   releaseTgeRounds: 0, // interval 30 days
  //   cliff: 8 * DAYS_OF_MONTH, // lock 8 months after the first month from the start time vesting
  //   releaseTotalRounds: 48, // total time vesting 56 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
  // // reserve 23,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(23).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 23% 23m
  //   tgePercent: 0, // total tge percent for all tge round
  //   releaseTgeRounds: 0, // interval 30 days
  //   cliff: 0, // only lock first month from the start time vesting
  //   releaseTotalRounds: 48, // total time vesting 48 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
  // // marketing & partnership 3,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(3).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 3% 3m
  //   tgePercent: 20, // total tge percent for all tge round
  //   releaseTgeRounds: 1, // interval 30 days
  //   cliff: 0, // only lock first month from the start time vesting
  //   releaseTotalRounds: 6, // total time vesting 6 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
  // // game 25,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(25).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 25% 25m
  //   tgePercent: 0, // total tge percent for all tge round
  //   releaseTgeRounds: 0, // interval 30 days
  //   cliff: 0, // only lock first month from the start time vesting
  //   releaseTotalRounds: 48, // total time vesting 48 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
  // // liquidity & listing 7,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(7).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 7% 7m
  //   tgePercent: 0, // total tge percent for all tge round
  //   releaseTgeRounds: 0, // interval 30 days
  //   cliff: 0, // only lock first month from the start time vesting
  //   releaseTotalRounds: 6, // total time vesting 6 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
  // // airdrop 2,000,000
  // {
  //   address: "0xE9e65cA5F4879Cd1DC64280864FA516957bf320E",
  //   amount: BigNumber.from(2).mul(ONE_MILLION).mul(DECIMAL_MULTIPLIER), // 2% 2m
  //   tgePercent: 0, // total tge percent for all tge round
  //   releaseTgeRounds: 0, // interval 30 days
  //   cliff: 0, // only lock first month from the start time vesting
  //   releaseTotalRounds: 48, // total time vesting 48 months
  //   daysPerRound: DAYS_OF_MONTH, // 1 month
  // },
];
