// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PIFGive.sol";
import "./PIFReceive.sol";

/**
  * @title  Pay It Forward Depositor
  * @author Rhain McClelland
  * @notice This is the main Pay It Forward Contract.
*/

contract PayItForwardDepositor {
    PIFGive public giveToken;
    PIFReceive public receiveToken;
    address private _owner;
    address public lastDoner;

    event paidForward(address _from, address _to, uint _amount);
    event giveMinted(address _from, uint _amount);
    event receiveMinted(address _from, uint _amount);


    /**
     * @notice Deploy Pay It Forward Depositor smart contract.
     * @notice Must have a payable amount so the first user can receive some funds.
     * @param _give Address of the PIFGive contract.
     * @param _receive Address of the PIFReceive contract.
     */
    constructor(PIFGive _give, PIFReceive _receive) payable {
        giveToken = _give;
        receiveToken = _receive;
        giveToken.give(msg.sender, msg.value);
    }

    /**
     * @notice Main function that allows the user to deposit funds.
     * @notice User must deposit at least 0.0001 ether.
     */
    function payItForward() public payable {
        require(msg.value > 1*10**14, 'Not enough Funds sent');

        uint amount = address(this).balance - msg.value;

        giveToken.give(msg.sender, msg.value);
        emit giveMinted(msg.sender, msg.value);

        receiveToken.give(msg.sender, amount);
        emit receiveMinted(msg.sender, amount);

        withdraw();
        lastDoner = msg.sender;
    }

    /**
     * @notice Withdraws the funds to the sender.
     */
    function withdraw() private {
        uint amount = address(this).balance - msg.value;
        (bool withdrawSuccess, ) = msg.sender.call{value: amount}("");
        require(withdrawSuccess, "Failed to deposit");
        
        emit paidForward(lastDoner, msg.sender, amount);
    }


}