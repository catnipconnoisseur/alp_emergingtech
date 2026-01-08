import { createPublicClient, http } from 'viem';
import { hardhat } from 'viem/chains';
import fs from 'fs';

const addresses = JSON.parse(
  fs.readFileSync('./frontend/deployed_addresses.json', 'utf-8')
);

const tokenAddress = addresses['TokenSaleModule#MyToken'] as `0x${string}`;

const client = createPublicClient({
  chain: hardhat,
  transport: http('http://127.0.0.1:8545'),
});

async function checkTokenInfo() {
  // symbol() - 0x95d89b41
  const symbolResult = await client.call({
    to: tokenAddress,
    data: '0x95d89b41' as `0x${string}`,
  });

  // name() - 0x06fdde03
  const nameResult = await client.call({
    to: tokenAddress,
    data: '0x06fdde03' as `0x${string}`,
  });

  // decimals() - 0x313ce567
  const decimalsResult = await client.call({
    to: tokenAddress,
    data: '0x313ce567' as `0x${string}`,
  });

  console.log('='.repeat(60));
  console.log('Token Contract Information');
  console.log('='.repeat(60));
  console.log(`Contract Address: ${tokenAddress}`);
  
  if (nameResult.data) {
    const name = Buffer.from(nameResult.data.slice(130), 'hex').toString('utf8').replace(/\0/g, '');
    console.log(`Name:             ${name}`);
  }
  
  if (symbolResult.data) {
    const symbol = Buffer.from(symbolResult.data.slice(130), 'hex').toString('utf8').replace(/\0/g, '');
    console.log(`Symbol:           ${symbol}`);
  }
  
  if (decimalsResult.data) {
    const decimals = parseInt(decimalsResult.data, 16);
    console.log(`Decimals:         ${decimals}`);
  }
  
  console.log('='.repeat(60));
}

checkTokenInfo().catch(console.error);
