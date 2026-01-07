import { network } from "hardhat";
import { formatEther } from "viem";

async function main() {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  // Get deployed addresses
  const myTokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const tokenSaleAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  const buyerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // First Hardhat account

  const myToken = await viem.getContractAt("MyToken", myTokenAddress);

  console.log("=== Token Balances ===");
  const tokenSaleBalance = await myToken.read.balanceOf([tokenSaleAddress]);
  console.log("TokenSale contract balance:", formatEther(tokenSaleBalance), "CLR");

  const buyerBalance = await myToken.read.balanceOf([buyerAddress]);
  console.log("Buyer balance:", formatEther(buyerBalance), "CLR");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
