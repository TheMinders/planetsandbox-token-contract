import { BigNumber } from "@ethersproject/bignumber";

export interface IBeneficiary {
  address: string;
  amount: BigNumber;
  tgePercent: number;
  releaseTgeRounds: number;
  cliff: number;
  releaseTotalRounds: number;
  daysPerRound: number;
}
