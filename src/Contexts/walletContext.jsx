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

  let connection = new web3.Connection(web3.clusterApiUrl("devnet"));

  useEffect(() => {
    getProvider();
  }, []);

  useEffect(() => {
    getBalance();
  }, [provider]);

  const getProvider = () => {
    if ("phantom" in window) {
      const myprovider = window.phantom?.solana;
      if (myprovider?.isPhantom) {
        setProvider(myprovider);

        if (myprovider.isConnected) {
          setIsWalletConnected(true);
        }
      }
    }
  };

  const getBalance = async (address = provider?.publicKey) => {
    if (!provider) return;
    await api
      .crud("POST", "getbhoomibalance", {
        address: provider?.publicKey?.toString(),
      })
      .then((res) => {
        let totalBalance = res.balance;
        let balancewithoutdecimal = totalBalance.substring(
          0,
          totalBalance.length - 7
        );
        let predecimal = balancewithoutdecimal.substring(
          0,
          balancewithoutdecimal.length - 2
        );
        let postdecimal = balancewithoutdecimal.substring(
          balancewithoutdecimal.length - 2,
          balancewithoutdecimal.length
        );
        setBhoomibalance(`${predecimal}.${postdecimal}`);
      })
      .catch((err) => console.log(err));
    await api
      .crud("GET", "getbhoomisupply")
      .then((res) => {
        let avl = res.currentAvailableToMint;
        let availableTokens = avl.substring(0, avl.length - 9);
        let percentage = parseInt(parseFloat(availableTokens) / 10000000);
        setSupplyData({ percentage: percentage, ...res });
      })
      .catch((err) => console.log(err));
  };

  const connectSolflare = async () => {
    if (window.solflare) {
      try {
        const solflareWallet = new SolflareWallet();
        solflareWallet.on("connect", () => {
          console.log("yes---");
          setPublicKey(solflareWallet.publicKey.toString());
          setProvider(solflareWallet);
          setIsWalletConnected(true);
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
        let myprovider = window.phantom?.solana;
        const resp = await myprovider.connect();
        setPublicKey(resp.publicKey);
        getProvider();
        getBalance(resp.publicKey);
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
      getProvider();
      return;
    }
    const recipientAddress = "9G4RTia1n5uThQ42tfmci2k9w1nauXjAKQPGQV9FKRuD";
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
      .catch((err) => null);
    if (tx === null) {
      throw "Transaction Unsuccessfull.";
    } else {
      return tx;
    }
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
