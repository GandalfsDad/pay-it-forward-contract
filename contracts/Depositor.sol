// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PayItForwardDepositor {
    ERC20 public giveToken;
    ERC20 public receiveToken;

    constructor(ERC20 _give, ERC20 _receive)  {
        giveToken = _give;
        receiveToken = _receive;
    }
}