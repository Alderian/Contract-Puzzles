const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    console.log("brute-force sequential");
    // good luck
    const threshold = 0x00ffffffffffffffffffffffffffffffffffffff;
    let i = 0;
    let isValid;
    let lastSigner;
    let address;
    //loop until find valid address
    while (!isValid) {
      lastSigner = ethers.provider.getSigner(i);
      address = await lastSigner.getAddress();
      if (address < threshold) {
        isValid = true;
      }
      i++;
    }

    console.log("tried accounts", i);
    console.log("using account", address);
    await game.connect(lastSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    console.log("brute-force random");

    // good luck
    const threshold = 0x00ffffffffffffffffffffffffffffffffffffff;
    let i = 0;
    let isValid;
    let lastSigner;
    let address;
    //loop until find valid address
    while (!isValid) {
      lastSigner = ethers.Wallet.createRandom();
      address = await lastSigner.getAddress();
      if (address < threshold) {
        isValid = true;
      }
      i++;
    }

    console.log("tried accounts", i);
    console.log("using account", address);

    // Instantiate wallet and found it
    lastSigner = lastSigner.connect(ethers.provider);
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("100"),
    });

    await game.connect(lastSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
