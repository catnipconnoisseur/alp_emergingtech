import { createWalletClient, http, parseEther, formatEther } from 'viem';
import { hardhat } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';

// Read deployed addresses
const addresses = JSON.parse(
  fs.readFileSync('./frontend/deployed_addresses.json', 'utf-8')
);

const tokenAddress = addresses['TokenSaleModule#MyToken'] as `0x${string}`;

// Account #0 private key (sender)
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

// Account #1 address (recipient)
const recipientAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

const client = createWalletClient({
  account,
  chain: hardhat,
  transport: http('http://127.0.0.1:8545'),
});

async function transferTokens() {
  console.log('='.repeat(60));
  console.log('Transferring CLR Tokens');
  console.log('='.repeat(60));
  console.log(`From:   ${account.address}`);
  console.log(`To:     ${recipientAddress}`);
  console.log(`Amount: 5 CLR`);
  console.log('');

  // ERC20 transfer function: transfer(address to, uint256 amount)
  // Function signature: 0xa9059cbb
  // Encode: to address (32 bytes) + amount (32 bytes)
  const amount = 5n * 10n ** 18n; // 5 tokens with 18 decimals
  
  const data = `0xa9059cbb${recipientAddress.slice(2).padStart(64, '0')}${amount.toString(16).padStart(64, '0')}` as `0x${string}`;

  console.log('Sending transaction...');
  
  const hash = await client.sendTransaction({
    to: tokenAddress,
    data: data,
  });

  console.log(`✅ Transaction sent!`);
  console.log(`Transaction hash: ${hash}`);
  console.log('');
  console.log('Transfer successful! 5 CLR tokens sent to Account #1.');
  console.log('='.repeat(60));
}

transferTokens().catch(console.error);
