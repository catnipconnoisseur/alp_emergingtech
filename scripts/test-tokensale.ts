import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

async function main() {
  const { viem } = await network.connect();
  const [owner, buyer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("Deploying contracts...");
  
  // Deploy MyToken
  const myToken = await viem.deployContract("MyToken", ["My Token", "CLR", 18]);
  console.log("MyToken deployed to:", myToken.address);

  // Deploy TokenSale
  const tokenSale = await viem.deployContract("TokenSale", [myToken.address]);
  console.log("TokenSale deployed to:", tokenSale.address);

  // Transfer tokens to TokenSale contract
  const tokenAmount = parseEther("100");
  await myToken.write.transfer([tokenSale.address, tokenAmount]);
  console.log("Transferred 100 tokens to TokenSale contract");

  // Check buyer balance before purchase
  const balanceBefore = await myToken.read.balanceOf([buyer.account.address]);
  console.log("Buyer balance before:", formatEther(balanceBefore), "CLR");

  // Buy tokens
  console.log("\nBuying 2 tokens...");
  const ethAmount = parseEther("2");
  await tokenSale.write.purchase({ account: buyer.account, value: ethAmount });

  // Check buyer balance after purchase
  const balanceAfter = await myToken.read.balanceOf([buyer.account.address]);
  console.log("Buyer balance after:", formatEther(balanceAfter), "CLR");

  console.log("\n✅ Token purchase successful!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
