import { createWalletClient, http } from 'viem';
import { hardhat } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';

// Read deployed addresses
const addresses = JSON.parse(
  fs.readFileSync('./frontend/deployed_addresses.json', 'utf-8')
);

const tokenAddress = addresses['TokenSaleModule#MyToken'] as `0x${string}`;

// Account #1 (sender - has no tokens yet, so we'll use TokenSale to send back)
// Actually, let's buy tokens first then send them
const account1 = privateKeyToAccount('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');
const myAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Your address

const client = createWalletClient({
  account: account1,
  chain: hardhat,
  transport: http('http://127.0.0.1:8545'),
});

async function sendTokensToTriggerRabby() {
  console.log('Step 1: Account #1 buying tokens from TokenSale...');
  
  const tokenSaleAddress = addresses['TokenSaleModule#TokenSale'] as `0x${string}`;
  
  // Buy 10 tokens with Account #1
  const purchaseHash = await client.sendTransaction({
    to: tokenSaleAddress,
    value: 10n * 10n ** 18n, // 10 ETH = 10 CLR
    data: '0x64edfbf0' as `0x${string}`, // purchase() function
  });
  
  console.log(`✅ Account #1 purchased tokens: ${purchaseHash}`);
  console.log('');
  console.log('Step 2: Now Account #1 sending 3 CLR to YOUR address...');
  console.log('(This should trigger Rabby to detect the token)');
  console.log('');
  
  // Wait a bit for the purchase to be mined
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Now send tokens from Account #1 to your address
  const amount = 3n * 10n ** 18n; // 3 tokens
  const data = `0xa9059cbb${myAddress.slice(2).padStart(64, '0')}${amount.toString(16).padStart(64, '0')}` as `0x${string}`;
  
  const transferHash = await client.sendTransaction({
    to: tokenAddress,
    data: data,
  });
  
  console.log(`✅ Transfer sent: ${transferHash}`);
  console.log('');
  console.log('🎯 INCOMING TRANSACTION SENT TO YOUR ADDRESS!');
  console.log('');
  console.log('Now check Rabby - it should detect the incoming CLR tokens!');
  console.log('If Rabby was watching, it should now show the CLR token.');
}

sendTokensToTriggerRabby().catch(console.error);
