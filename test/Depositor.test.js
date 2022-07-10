const { expect, assert } = require("chai");

let depositor;
let giveToken;
let receiveToken;
let accounts;

const initialDonation = 0.001; //Test fails with larger numbers Investigate
const transferVal = 0.004;

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

describe("Interaction", function () {
    it("Should reward new Doner Correctly", async function () {
        const startBalance = await hre.ethers.provider.getBalance(accounts[1].address);
        const txn = await depositor.connect(accounts[1]).payItForward({value: hre.ethers.utils.parseEther('{0}'.replace('{0}', transferVal))});
        await txn.wait();

        
        const deltaBal = (initialDonation-transferVal)*10**18;
        const deltaActual = await hre.ethers.provider.getBalance(accounts[1].address) - startBalance;
        
        expect(deltaBal).to.approximately(deltaActual, 1*10**15); //Assumes 1E15 is gas impact

        expect(await hre.ethers.provider.getBalance(depositor.address)).to.equal(transferVal*10**18);

    });

    it("Should reward new Doner with PIFGive and PIFReceive", async function () {
        const txn = await depositor.connect(accounts[1]).payItForward({value: hre.ethers.utils.parseEther('{0}'.replace('{0}', transferVal))});
        await txn.wait();

        expect(await giveToken.balanceOf(accounts[1].address)).to.equal(transferVal*10**18);
        expect(await receiveToken.balanceOf(accounts[1].address)).to.equal(initialDonation*10**18);
    });
});