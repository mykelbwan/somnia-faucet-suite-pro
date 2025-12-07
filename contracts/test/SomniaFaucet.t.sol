// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {SomniaFaucet} from "../src/SomniaFaucet.sol";
import {MockERC20} from "./mock/MockErc.t.sol";
import {FailingERC20} from "./mock/MockFailingErc.t.sol";

// Helper contract to test ETH claim failure
contract Rejector {
    receive() external payable {
        revert("I reject ETH");
    }
}

contract SomniaFaucetTest is Test {
    SomniaFaucet faucet;
    MockERC20 token;
    Rejector rejector;

    address owner = address(0xABCD);
    address alice = address(0x1);
    address bob = address(0x2);

    uint256 constant FAUCET_ETH_BALANCE = 10 ether;
    uint256 constant FAUCET_TOKEN_BALANCE = 1000 ether;

    function setUp() public {
        // 1. Setup Accounts
        vm.deal(owner, 100 ether);

        // 2. Deploy Contracts as owner
        vm.startPrank(owner);
        faucet = new SomniaFaucet();
        token = new MockERC20();
        rejector = new Rejector();
        vm.stopPrank();

        // 3. Fund Faucet with ETH
        vm.deal(address(faucet), FAUCET_ETH_BALANCE);

        // 4. Fund Faucet with Tokens
        token.mint(address(faucet), FAUCET_TOKEN_BALANCE);
    }

    /* ========================================================================
                                OWNERSHIP TESTS
       ======================================================================== */

    function test_Initialization() public view {
        assertEq(faucet.owner(), owner);
    }

    function test_ChangeOwner_Success() public {
        vm.prank(owner);
        faucet.changeOwner(alice);
        assertEq(faucet.owner(), alice);
    }

    function test_ChangeOwner_Revert_Unauthorized() public {
        vm.prank(alice); // Not owner
        vm.expectRevert(SomniaFaucet.Unauthorized.selector);
        faucet.changeOwner(alice);
    }

    /* ========================================================================
                                NATIVE ETH TESTS
       ======================================================================== */

    function test_ClaimNative_Success() public {
        uint256 amount = 1 ether;
        uint256 preBalance = alice.balance;

        vm.prank(owner);
        faucet.claimNative(alice, amount);

        assertEq(alice.balance, preBalance + amount);
        assertEq(address(faucet).balance, FAUCET_ETH_BALANCE - amount);
    }

    function test_ClaimNative_Revert_NotEnoughBalance() public {
        uint256 amount = FAUCET_ETH_BALANCE + 1 ether;

        vm.prank(owner);
        vm.expectRevert(SomniaFaucet.NotEnoughBalance.selector);
        faucet.claimNative(alice, amount);
    }

    function test_ClaimNative_Revert_ClaimFail() public {
        // We try to send ETH to the 'Rejector' contract which reverts on receive
        uint256 amount = 1 ether;

        vm.prank(owner);
        vm.expectRevert(SomniaFaucet.ClaimFail.selector);
        faucet.claimNative(address(rejector), amount);
    }

    function test_ClaimNative_Revert_Unauthorized() public {
        vm.prank(alice);
        vm.expectRevert(SomniaFaucet.Unauthorized.selector);
        faucet.claimNative(alice, 1 ether);
    }

    /* ========================================================================
                                ERC20 TESTS
       ======================================================================== */

    function test_ClaimERC20_Success() public {
        uint256 amount = 100 ether;

        vm.prank(owner);
        faucet.claimERC20(address(token), alice, amount);

        assertEq(token.balanceOf(alice), amount);
        assertEq(
            token.balanceOf(address(faucet)),
            FAUCET_TOKEN_BALANCE - amount
        );
    }

    function test_ClaimERC20_Revert_NotEnoughBalance() public {
        uint256 amount = FAUCET_TOKEN_BALANCE + 1 ether;

        vm.prank(owner);
        vm.expectRevert(SomniaFaucet.NotEnoughBalance.selector);
        faucet.claimERC20(address(token), alice, amount);
    }

    function test_ClaimERC20_Revert_ClaimFail() public {
        // Use the FailingERC20 mock which returns false on transfer
        FailingERC20 badToken = new FailingERC20();

        vm.prank(owner);
        vm.expectRevert(SomniaFaucet.ClaimFail.selector);
        // We request less than the mock's hardcoded balance (100 ether) to pass the first check
        // but fail the second check (transfer returns false)
        faucet.claimERC20(address(badToken), alice, 10 ether);
    }

    function test_ClaimERC20_Revert_Unauthorized() public {
        vm.prank(alice);
        vm.expectRevert(SomniaFaucet.Unauthorized.selector);
        faucet.claimERC20(address(token), alice, 10 ether);
    }

    /* ========================================================================
                                RECEIVE TESTS
       ======================================================================== */

    function test_Receive_AcceptsETH() public {
        uint256 amount = 5 ether;
        uint256 preBalance = address(faucet).balance;

        (bool success, ) = address(faucet).call{value: amount}("");

        assertTrue(success);
        assertEq(address(faucet).balance, preBalance + amount);
    }
}
