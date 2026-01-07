import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deploymentsPath = path.join(__dirname, '../ignition/deployments/chain-31337');
const artifactsDir = path.join(deploymentsPath, "artifacts");
const frontendDir = path.join(__dirname, '../frontend');

const tokenSaleArtifactPath = path.join(artifactsDir, 'TokenSaleModule#TokenSale.json');
const deployedAddressPath = path.join(deploymentsPath, 'deployed_addresses.json');

fs.copyFileSync(tokenSaleArtifactPath, path.join(frontendDir, 'TokenSale.json'));
fs.copyFileSync(deployedAddressPath, path.join(frontendDir, 'deployed_addresses.json'));

console.log('ABI and deployed addresses copied to frontend directory.');