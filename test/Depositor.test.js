const { expect, assert } = require("chai");

let depositor;
let giveToken;
let receiveToken;
let accounts;

const initialDonation = 0.001; //Test fails with larger numbers Investigate

beforeEach(async () => {
    accounts = await ethers.getSigners();

    let giveTokenFactory = await ethers.getContractFactory("PIFGive");
    giveToken = await giveTokenFactory.deploy();
    await giveToken.deployed();

    let receiveTokenFactory = await ethers.getContractFactory("PIFReceive");
    receiveToken = await receiveTokenFactory.deploy();
    await receiveToken.deployed();

    let depositorFactory = await ethers.getContractFactory("PayItForwardDepositor");
    depositor = await depositorFactory.connect(accounts[0]).deploy(giveToken.address, receiveToken.address, {value: hre.ethers.utils.parseEther('{0}'.replace('{0}', initialDonation))});
    await depositor.deployed();
});

describe("Deployment", function () {
    it("Should Deploy with the correct Value", async function () {
        
      expect(await hre.ethers.provider.getBalance(depositor.address)).to.equal(initialDonation*10**18);
    });
  
    it("Should store Correct Doner Address", async function () {
      expect(await depositor.lastDoner()).to.equal(accounts[0].address);
    });

    it("Should have the correct Give Balance after deployment", async function() {
        expect(await giveToken.balanceOf(accounts[0].address)).to.equal(initialDonation*10**18);
    });
  });