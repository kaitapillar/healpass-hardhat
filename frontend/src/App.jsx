import { useState } from 'react';
import { ethers } from 'ethers';
import HealpassDAO from './HealpassDAO.json'; // DAO ABI
import HealpassToken from './HealpassToken.json'; // Token ABI

const daoAddress = '0x90bA4897796515FccD1E5FE4f0a4C904a4B832F4'; // Replace with your deployed HealpassDAO address
const tokenAddress = '0x600D80e81Ca01809Ec368BB325cd82DBA11Db570'; // Replace with your deployed HealpassToken address

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [daoContract, setDaoContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState('0');

  // Connects the user's wallet using MetaMask and sets up contracts
  const connectWallet = async () => {
    const desiredNetworkId = '0xa869'; // Fuji Chain ID (43113 in hex)

    try {
      if (!window.ethereum) return alert("Please install MetaMask.");

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);

      // Check and switch network
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== desiredNetworkId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredNetworkId }],
          });
          console.log(`Switched to Fuji network (Chain ID: ${desiredNetworkId})`);
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: desiredNetworkId,
                  chainName: 'Avalanche Fuji C-Chain',
                  nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
                  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
                },
              ],
            });
            console.log('Fuji network added to MetaMask');
          } else {
            console.error("Failed to switch network:", switchError);
            return;
          }
        }
      }

      // Set up ethers provider and contracts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const dao = new ethers.Contract(daoAddress, HealpassDAO.abi, signer);
      setDaoContract(dao);

      const token = new ethers.Contract(tokenAddress, HealpassToken.abi, signer);
      setTokenContract(token);

      // Fetch initial total supply
      const supply = await token.total_supply();
      setTotalSupply(ethers.formatUnits(supply, 0)); // HealpassToken uses 0 decimals for 100 units

    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet. Check console for details.");
    }
  };

  // Join the DAO (placeholder logic)
  const handleJoin = async () => {
    if (!daoContract || !currentAccount) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const tx = await daoContract.join(currentAccount);
      await tx.wait();
      console.log('Joined DAO successfully!');
      // Add logic to update UI if needed
    } catch (error) {
      console.error("Join failed:", error);
      alert("Join failed. Check console for details.");
    }
  };

  // Mint tokens via HealpassDAO
  const handleMint = async () => {
    if (!daoContract || !currentAccount) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const mintPrice = ethers.parseEther("0.01"); // 0.01 ETH
      const tx = await daoContract.mintToken(currentAccount, { value: mintPrice });
      await tx.wait();
      const newSupply = await tokenContract.total_supply();
      setTotalSupply(ethers.formatUnits(newSupply, 0));
      console.log('Minted 100 HEAL successfully!');
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Check console for details.");
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        margin: '20px'
      }}>
        <h1 style={{
          marginBottom: '30px',
          color: '#2d3748',
          fontSize: '2.5rem'
        }}>Healpass DAO</h1>
        
        {!currentAccount ? (
          <button 
            onClick={connectWallet}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#3182ce'
              }
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p style={{ marginBottom: '10px', color: '#4a5568' }}>
              Connected Account: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
            </p>
            <p style={{ marginBottom: '20px', color: '#4a5568' }}>
              Total Supply: {totalSupply} HEAL
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button
                onClick={handleJoin}
                style={{
                  padding: '12px 24px',
                  cursor: 'pointer',
                  backgroundColor: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  transition: 'background-color 0.2s'
                }}
              >
                Join
              </button>
              <button
                onClick={handleMint}
                style={{
                  padding: '12px 24px',
                  cursor: 'pointer',
                  backgroundColor: '#ed8936',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  transition: 'background-color 0.2s'
                }}
              >
                Mint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;