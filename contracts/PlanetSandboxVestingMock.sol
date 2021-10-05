// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

/// @author PlanetSandbox Blockchain Dev
contract PlanetSandboxVestingMock is ERC20, ReentrancyGuard, Ownable {
    using SafeERC20 for ERC20;
    uint256 public constant DECIMAL_MULTIPLIER = 10**18;
    uint256 public constant TOTAL_SUPPLY = (10**8) * DECIMAL_MULTIPLIER;
    uint256 public constant INITIAL_SUPPLY = 38 * (10**5) * DECIMAL_MULTIPLIER;
    uint256 public PROJECTED_SUPPLY = 0;

    uint256 public startTimeVesting; // time vesting
    uint256 public blockTimestamp;

    mapping(address => VestingInfo) private _vestingList;

    struct VestingInfo {
        bool isActive;
        uint256 amount; // total amount
        uint256 startTimeVesting; // time start vesting
        uint256 startTimeCliff; // time start cliff
        uint256 claimedAmount; // claimed vest
        uint256 cliff; // time cliff before vesting
        uint256 releaseTotalRounds;
        uint256 daysPerRound;
        uint256 tgePercent;
        uint256 releaseTgeRounds;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(_msgSender(), INITIAL_SUPPLY);
        PROJECTED_SUPPLY = PROJECTED_SUPPLY + INITIAL_SUPPLY;
    }

    /**
     * @dev Set first day token listing on exchange for vesting process
     */
    function setTokenVestingTime(uint256 vestingTime) public onlyOwner {
        require(vestingTime >= blockTimestamp, "PlanetSandbox: Token listing must be in future date");

        startTimeVesting = vestingTime;
    }

    function addVestingToken(
        address beneficiary,
        uint256 amount,
        uint256 cliff,
        uint256 releaseTotalRounds,
        uint256 daysPerRound,
        uint256 tgePercent,
        uint256 releaseTgeRounds
    ) external onlyOwner {
        require(beneficiary != address(0), "PlanetSandbox: Zero address");
        require(amount > 0, "PlanetSandbox: Amount must be greater than 0");
        require(PROJECTED_SUPPLY + amount <= TOTAL_SUPPLY, "PlanetSandbox: Max supply exceeded");
        require(startTimeVesting > 0, "PlanetSandbox: No vesting time");
        require(!_vestingList[beneficiary].isActive, "PlanetSandbox: Duplicate vesting address");
        VestingInfo memory info = VestingInfo(
            true,
            amount,
            startTimeVesting,
            startTimeVesting + 30 days,
            0,
            cliff,
            releaseTotalRounds,
            daysPerRound,
            tgePercent,
            releaseTgeRounds
        );
        _vestingList[beneficiary] = info;
        PROJECTED_SUPPLY = PROJECTED_SUPPLY + amount;
    }

    function revokeVestingToken(address user) external onlyOwner {
        require(_vestingList[user].isActive, "PlanetSandbox: Invalid beneficiary");
        uint256 claimableAmount = _getVestingClaimableAmount(user);
        _vestingList[user].isActive = false;
        if (claimableAmount > 0) {
            require(totalSupply() + claimableAmount <= TOTAL_SUPPLY, "PlanetSandbox: Max supply exceeded");
            _mint(user, claimableAmount);
            _vestingList[user].claimedAmount = _vestingList[user].claimedAmount + claimableAmount;
            PROJECTED_SUPPLY = PROJECTED_SUPPLY - (_vestingList[user].amount - _vestingList[user].claimedAmount);
        }
    }

    function getVestingInfoByUser(address user) external view returns (VestingInfo memory) {
        return _vestingList[user];
    }

    /**
     * @dev
     *
     * Requirements:
     *
     * - `user` cannot be the zero address.
     */
    function _getVestingClaimableAmount(address user) internal view returns (uint256 claimableAmount) {
        if (!_vestingList[user].isActive) return 0;
        VestingInfo memory info = _vestingList[user];
        if (blockTimestamp < info.startTimeVesting) return 0;

        claimableAmount = 0;
        uint256 tgeReleasedAmount = 0;
        uint256 roundReleasedAmount = 0;
        uint256 releasedAmount = 0;
        uint256 releaseTime = info.startTimeCliff + (info.cliff * 1 days);
        uint256 tgeRounds = ((blockTimestamp - info.startTimeVesting) / 30 days) + 1;

        if (info.tgePercent > 0) {
            if (tgeRounds <= info.releaseTgeRounds) {
                tgeReleasedAmount = (info.amount * info.tgePercent * tgeRounds) / (info.releaseTgeRounds * 100);
            } else {
                tgeReleasedAmount = (info.amount * info.tgePercent) / 100;
            }
        }

        if (blockTimestamp >= releaseTime) {
            uint256 roundsPassed = ((blockTimestamp - releaseTime) / (info.daysPerRound * 1 days)) + 1;

            if (roundsPassed >= info.releaseTotalRounds) {
                roundReleasedAmount = info.amount - tgeReleasedAmount;
            } else {
                roundReleasedAmount = ((info.amount - tgeReleasedAmount) * roundsPassed) / info.releaseTotalRounds;
            }
        }

        releasedAmount = tgeReleasedAmount + roundReleasedAmount;

        if (releasedAmount > info.claimedAmount) {
            claimableAmount = releasedAmount - info.claimedAmount;
        }
    }

    function getVestingClaimableAmount(address user) external view returns (uint256) {
        return _getVestingClaimableAmount(user);
    }

    function claimVestingToken() external nonReentrant returns (uint256) {
        require(_vestingList[_msgSender()].isActive, "PlanetSandbox: Not in vesting list");
        uint256 claimableAmount = _getVestingClaimableAmount(_msgSender());
        require(claimableAmount > 0, "PlanetSandbox: Nothing to claim");
        require(totalSupply() + claimableAmount <= TOTAL_SUPPLY, "PlanetSandbox: Max supply exceeded");
        _vestingList[_msgSender()].claimedAmount = _vestingList[_msgSender()].claimedAmount + claimableAmount;
        _mint(_msgSender(), claimableAmount);
        return claimableAmount;
    }

    function setBlockTimestamp(uint256 value) public onlyOwner returns (uint256) {
        blockTimestamp = value;
        return blockTimestamp;
    }

    receive() external payable {
        revert();
    }
}
