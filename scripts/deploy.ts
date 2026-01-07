import hre from "hardhat";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  
  console.log("Deploying contracts with account:", deployer.account.address);

  // Deploy MyToken
  const myToken = await hre.viem.deployContract("MyToken", ["My Token", "CLR", 18n]);
  console.log("MyToken deployed to:", myToken.address);

  // Deploy TokenSale
  const tokenSale = await hre.viem.deployContract("TokenSale", [myToken.address]);
  console.log("TokenSale deployed to:", tokenSale.address);

  // Transfer tokens to TokenSale
  const amount = 50n * 10n ** 18n;
  const hash = await myToken.write.transfer([tokenSale.address, amount]);
  console.log("Transferred 50 CLR tokens to TokenSale, tx:", hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
