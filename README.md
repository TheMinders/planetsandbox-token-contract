### Contracts
| Name | Feature |
|--|--|
| PlanetSandbox.sol | ERC20 token of PlanetSandBox |
| PuvisToken.sol | ERC20 token (game token) of PlanetSandbox |
| PlanetSandboxVestingMocking.sol | Mocking contract for local testing Do not deploy it to network |

### VestingInfo
|Name| Description |
|--|--|
| beneficiary | Wallet of the beneficiary |
| amount| Total distribution amount to the beneficiary|
| cliff | Time cliff before vesting |
| releaseTotalRounds| Total rounds for release after cliff |
| daysPerRound | Total days per each round |
| tgePercent | The percentage of total distribution amount paid in TGE round |
| releaseTgeRounds | Total TGE rounds |

### Deployment Flow

 1. Deploy PSB token using PlanetSandbox.sol
 2. Deploy PULV token using PuvisToken.sol
 3. Owner calls PlanetSandbox contract (addVestingToken method) to add new beneficiary. **No duplicated address**
 4. Verify contracts