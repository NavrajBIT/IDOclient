import SolflareWallet from "@solflare-wallet/sdk";
import React, { useState, useEffect, useContext } from "react";
import * as web3 from "@solana/web3.js";
import useAPI from "../Components/useAPI";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const WalletContext = React.createContext();

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider(props) {
  const api = useAPI();
  const [provider, setProvider] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [solbalance, setSolBalance] = useState(0);
  const [bhoomibalance, setBhoomibalance] = useState(0);
  const [supplydata, setSupplyData] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);

  // let connection = new web3.Connection("https://api.mainnet-beta.solana.com/");
  let connection = new web3.Connection(
    "https://solana-mainnet.g.alchemy.com/v2/kMrUikMCKkIijBbmIki8WnfM5kP72Coj"
  );
  // let connection = new web3.Connection("https://api.devnet.solana.com/");

  useEffect(() => {
    try {
      let wallet = localStorage.getItem("wallet");
      console.log(wallet);
      if (wallet === "phantom") connect();
      if (wallet === "solflare") connectSolflare();
    } catch {}
  }, []);

  useEffect(() => {
    getBalance();
    getSupply();
    const myinterval = setInterval(() => {
      getBalance();
      getSupply();
    }, 5000);
    try {
      provider.on("disconnect", () => {
        disconnect();
      });
      provider.on("accountChanged", () => {
        disconnect();
      });
      provider.on("networkChanged", () => {
        disconnect();
      });
    } catch {}
    return () => clearInterval(myinterval);
  }, [provider]);

  const getBalance = async (address = provider?.publicKey) => {
    if (!provider) return;
    if (!contractAddress) return;
    await api
      .crud(
        "POST",
        "getbhoomibalance",
        {
          address: provider?.publicKey?.toString(),
        },
        true
      )
      .then((res) => {
        console.log(res);
        let tokenBalance = parseFloat(res.balance);
        tokenBalance = tokenBalance / Math.pow(10, 9);
        tokenBalance = Math.round(tokenBalance * 100) / 100;
        setBhoomibalance(tokenBalance);
      })
      .catch((err) => console.log(err));
  };

  const getSupply = async () => {
    await api
      .crud("GET", "getSupply")
      .then((res) => {
        setContractAddress(res.address);
        let avlTokens = parseFloat(res.currentAvailableToMint);
        // avlTokens = avlTokens / Math.pow(10, 9);
        let totalAvlTokens = parseFloat(res.totalAvailableToMint);
        let percentage = parseFloat(
          ((totalAvlTokens - avlTokens) / totalAvlTokens) * 100
        );
        try {
          percentage = Math.round(percentage * 100) / 100;
        } catch {}
        let mintedTokens = parseInt(totalAvlTokens - avlTokens);
        let remaintingTokens = parseFloat(res.currentAvailableToMint);
        // remaintingTokens = remaintingTokens / Math.pow(10, 9);

        if (isNaN(percentage)) percentage = 100;
        if (isNaN(mintedTokens)) mintedTokens = 0;
        if (isNaN(remaintingTokens)) remaintingTokens = 0;
        if (remaintingTokens < 1) percentage = 100;
        setSupplyData({
          ...res,
          percentage: percentage,
          mintedTokens: mintedTokens,
          remaintingTokens: remaintingTokens,
        });
      })
      .catch((err) => console.log(err));
  };

  const connectSolflare = async () => {
    if (window.solflare) {
      try {
        const solflareWallet = new SolflareWallet();
        solflareWallet.on("connect", () => {
          setPublicKey(solflareWallet.publicKey.toString());
          setProvider(solflareWallet);
          setIsWalletConnected(true);
          localStorage.setItem("wallet", "solflare");
        });
        await solflareWallet.connect();
      } catch {
        setIsWalletConnected(false);
        alert("Wallet connection declined!");
      }
    } else {
      window.open("https://solflare.com/", "_blank");
    }
  };

  const connect = async () => {
    if ("phantom" in window) {
      try {
        console.log("trying to connect");
        let myprovider = window.phantom?.solana;
        const resp = await myprovider.connect();
        console.log("request processed...");
        setPublicKey(resp.publicKey);
        localStorage.setItem("wallet", "phantom");
        setProvider(myprovider);
        setIsWalletConnected(true);
      } catch {
        setIsWalletConnected(false);
        alert("Wallet connection declined!");
      }
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const sendSol = async (sol) => {
    if (!provider) {
      alert("Please connect wallet.");
      return;
    }
    const recipientAddress = "CqQq7oBtMjoRfaxipxWpzZeu4aQfRSN7tRivpqTD7boY";
    let transaction = new web3.Transaction();
    console.log(`Sending ${sol} SOL`);
    transaction.add(
      web3.SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: new web3.PublicKey(recipientAddress),
        lamports: parseInt(sol * web3.LAMPORTS_PER_SOL),
      })
    );

    transaction.feePayer = provider.publicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    const tx = await provider
      .signAndSendTransaction(transaction)
      .then((res) => {
        console.log(res);
        if (provider.isPhantom) {
          return res.signature;
        } else {
          return res;
        }
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (tx === null) {
      throw "Transaction Unsuccessfull.";
    } else {
      return tx;
    }
  };

  const disconnect = async () => {
    try {
      provider.request({ method: "disconnect" });
    } catch {}
    setIsWalletConnected(false);
    setProvider(null);
    setPublicKey(null);
    setSolBalance(0);
    setBhoomibalance(0);
  };

  const value = {
    publicKey,
    provider,
    sendSol,
    isWalletConnected,
    solbalance,
    connect,
    connectSolflare,
    getBalance,
    bhoomibalance,
    supplydata,
    disconnect,
    contractAddress,
  };

  return (
    <WalletContext.Provider value={value}>
      {props.children}
    </WalletContext.Provider>
  );
}

// const transactionStatus = async (txnSig) => {
//   const result = await connection.getSignatureStatus(txnSig, {
//     searchTransactionHistory: true,
//   });

//   if (!result.value) {
//     setTrxnStatus("Processing...");
//     setTimeout(() => {
//       transactionStatus(txnSig);
//     }, 1000);
//   } else {
//     const {
//       value: { confirmationStatus },
//     } = result;
//     // console.log(result.value);
//     if (confirmationStatus === "processed") {
//       setTrxnStatus("Confirming...");
//     } else if (confirmationStatus === "confirmed") {
//       setTrxnStatus("Finalizing...");
//     } else if (confirmationStatus === "finalized") {
//       setTrxnStatus("Finalized");
//       console.log(txnSig);
//       return txnSig;
//     }
//     setTimeout(() => {
//       transactionStatus(txnSig);
//     }, 3000);
//   }
// };
