//SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @author PlanetSandbox Blockchain Dev
contract PulvisToken is ERC20, AccessControl, Ownable {
    using SafeERC20 for ERC20;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant DECIMAL_MULTIPLIER = 10**18;
    uint256 public constant TOTAL_SUPPLY = 5 * (10**11) * DECIMAL_MULTIPLIER;

    constructor() ERC20("PlanetSandbox Pulvis Token", "PULV") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Pulvis: ADMIN role required");
        _;
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, _msgSender()), "Pulvis: MINTER role required");
        _;
    }

    function mint(address beneficiary, uint256 amount) public onlyMinter {
        require(totalSupply() + amount <= TOTAL_SUPPLY, "Pulvis: Max supply exceeded");
        _mint(beneficiary, amount);
    }

    function burn(address account, uint256 amount) public {
        require(_msgSender() == account || hasRole(MINTER_ROLE, _msgSender()), "Pulvis: MINTER role required");
        _burn(account, amount);
    }
}
