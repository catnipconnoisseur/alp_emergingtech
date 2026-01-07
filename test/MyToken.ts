import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("MyToken", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("Should deploy with correct name, symbol, and decimals", async function () {
    const tokenName = "My Token";
    const tokenSymbol = "MTK";
    const tokenDecimals = 18;
    
    const token = await viem.deployContract("MyToken", [tokenName, tokenSymbol, tokenDecimals]);
    
    assert.equal(tokenName, await token.read.name());
    assert.equal(tokenSymbol, await token.read.symbol());
    assert.equal(tokenDecimals, await token.read.decimals());
  });
});