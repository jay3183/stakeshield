// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "lib/v4-core/src/types/PoolKey.sol";
import {Currency} from "lib/v4-core/src/types/Currency.sol";

contract EigenProtectedAVSHookTest is Test {
    EigenProtectedAVSHook public hook;
    IPoolManager public poolManager;

    function setUp() public {
        // Deploy mock contracts
        poolManager = IPoolManager(makeAddr("poolManager"));
        
        // Deploy the hook
        hook = new EigenProtectedAVSHook(poolManager);
    }

    function testInitialization() public {
        assertEq(address(hook.poolManager()), address(poolManager));
    }

    function makeAddr(string memory name) internal override returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }
}