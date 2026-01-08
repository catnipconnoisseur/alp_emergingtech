import { createPublicClient, http, parseAbi, formatEther } from 'viem';
import { localhost } from 'viem/chains';

const TOKEN_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
const YOUR_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Account #0

async function main() {
  const publicClient = createPublicClient({
    chain: localhost,
    transport: http('http://127.0.0.1:8545'),
  });

  const abi = parseAbi([
    'function balanceOf(address) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
    'function symbol() view returns (string)',
  ]);

  console.log('Checking balances for new token...');
  console.log('Token Address:', TOKEN_ADDRESS);
  console.log('Your Address:', YOUR_ADDRESS);

  const balance = await publicClient.readContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi,
    functionName: 'balanceOf',
    args: [YOUR_ADDRESS],
  });

  const totalSupply = await publicClient.readContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi,
    functionName: 'totalSupply',
  });

  const symbol = await publicClient.readContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi,
    functionName: 'symbol',
  });

  console.log(`\nYour ${symbol} Balance:`, formatEther(balance));
  console.log(`Total Supply:`, formatEther(totalSupply));
}

main().catch(console.error);
