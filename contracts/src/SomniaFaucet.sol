// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

contract SomniaTestnetFaucetSuite {
    address public owner;

    error ClaimFail();
    error Unauthorized();
    error InvalidToken();
    error NotEnoughBalance();

    event NativeDispensed(address indexed to, uint256 amount);
    event ERC20Dispensed(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    constructor() {
        owner = msg.sender;
    }

    modifier Owner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    receive() external payable {}

    function claimNative(address to, uint256 amount) external Owner {
        if (address(this).balance < amount) revert NotEnoughBalance();
        (bool ok, ) = payable(to).call{value: amount}("");
        if (!ok) revert ClaimFail();

        emit NativeDispensed(to, amount);
    }

    function getBalNative() external view returns (uint256) {
        return address(this).balance;
    }

    function claimERC20(
        address token,
        address to,
        uint256 amount
    ) external Owner {
        IERC20 erc20 = IERC20(token);
        if (amount > erc20.balanceOf(address(this))) revert NotEnoughBalance();

        bool ok = erc20.transfer(to, amount);
        if (!ok) revert ClaimFail();

        emit ERC20Dispensed(token, to, amount);
    }

    function getBalErc20(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function changeOwner(address newOwner) external Owner {
        owner = newOwner;
    }
}
