let provider;
let signer;
let contract;
let address;
let addresses;

const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletAddress = document.getElementById('walletAddress');
const buyTokenBtn = document.getElementById('buyTokenBtn');
const ethAmount = document.getElementById('ethAmount');
const statusMessage = document.getElementById('statusMessage');

(async() =>{
    try {
        const response = await fetch('deployed_addresses.json');
        addresses = await response.json();
        if (addresses["TokenSaleModule#TokenSale"]) {
            console.log("Token Sale deployed at:", addresses["TokenSaleModule#TokenSale"]);
        }
    } catch (e) {
        console.log("Error fetching deployed addresses:", e);
    }
})();

function showStatus(message, type = "info") {
    statusMessage.className = "mt-3 alert alert-" + type;
    statusMessage.textContent = message;
    statusMessage.classList.remove("d-none");
}

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = await provider.getSigner();
            address = await signer.getAddress();
            
            walletAddress.textContent = "Connected: " + address;
            connectWalletBtn.textContent = "Wallet Connected";
            buyTokenBtn.disabled = false;
            
            showStatus("Wallet connected successfully.", "success");
            console.log("Connected wallet:", address);
        } catch (error) {
            console.log(error);
            showStatus("Failed to connect wallet.", "warning");
        }
    } else {
        console.log("Ethereum provider not found. Please install Rabby or MetaMask.");
        showStatus("Failed to connect wallet. Please install Rabby or MetaMask.", "warning");
    }
}

async function buyToken() {
        const contractAddress = addresses["TokenSaleModule#TokenSale"];
        const amount = ethAmount.value;

    if (!ethers.isAddress(contractAddress)) {
        showStatus("Invalid contract address.", "danger");
        return;
    }

    if (!amount || amount <= 0) {
        showStatus("Please enter a valid ETH amount.", "warning");
        return;
    }

    try {
        buyTokenBtn.disabled = true;
        buyTokenBtn.textContent = "Processing...";
        showStatus("Initiating token purchase...", "info");

        const response = await fetch("TokenSale.json");
        const artifact = await response.json();
        const TokenSaleABI = artifact.abi;

        const tokenSaleContract = new ethers.Contract(contractAddress, TokenSaleABI, signer);

        const tx = await tokenSaleContract.purchase({ value: ethers.parseEther(ethAmount.value)});
        showStatus("Transaction sent. Waiting for confirmation...", "info");
        await tx.wait();
        showStatus("Token purchase successful!", "success");

    } catch (error) {
        console.log(error);
        showStatus("Token purchase failed: " + error.message, "danger");
    } finally {
        buyTokenBtn.textContent = "Buy Tokens";
        buyTokenBtn.disabled = false;
    }
}

connectWalletBtn.addEventListener('click', connectWallet);
buyTokenBtn.addEventListener('click', buyToken);

