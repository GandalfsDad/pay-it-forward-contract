// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
  * @title  Pay It Forward Give
  * @author Rhain McClelland
  * @notice This is a ERC20 that is meant to represent the total amount of tokens given to the contract.
*/


contract PIFGive is ERC20 {

    /**
     * @notice Deploy Pay It Forward Give smart contract.
     */
    constructor () ERC20("PIFGIVE","PIFG") {
    } 

    /**
     * @notice Give tokens to the user.
     * @param _to Address of the user to receive the tokens.
     * @param _amount Amount of tokens to give (mint).
     */
    function give(address _to, uint256 _amount) external  {
        _mint(_to, _amount);
    }
}