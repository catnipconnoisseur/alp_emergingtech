import { createPublicClient, http, formatEther } from 'viem';
import { hardhat } from 'viem/chains';
import fs from 'fs';

// Read deployed addresses
const addresses = JSON.parse(
  fs.readFileSync('./frontend/deployed_addresses.json', 'utf-8')
);

const tokenAddress = addresses['TokenSaleModule#MyToken'] as `0x${string}`;

// Your wallet address (Account #0)
const myAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const client = createPublicClient({
  chain: hardhat,
  transport: http('http://127.0.0.1:8545'),
});

async function checkBalance() {
  // ERC20 balanceOf function signature
  const data = `0x70a08231000000000000000000000000${myAddress.slice(2)}` as `0x${string}`;

  const result = await client.call({
    to: tokenAddress,
    data: data,
  });

  if (result.data) {
    const balance = BigInt(result.data);
    const balanceInTokens = Number(balance) / 1e18;
    
    console.log('='.repeat(50));
    console.log('CLR Token Balance Check');
    console.log('='.repeat(50));
    console.log(`Token Address: ${tokenAddress}`);
    console.log(`Your Address:  ${myAddress}`);
    console.log(`Balance:       ${balanceInTokens.toLocaleString()} CLR`);
    console.log(`Raw Balance:   ${balance.toString()}`);
    console.log('='.repeat(50));
  }
}

checkBalance().catch(console.error);
