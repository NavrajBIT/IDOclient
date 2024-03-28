import nacl from "tweetnacl";
import bs58 from "bs58";
import { useState } from "react";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const Mobilewallet = () => {
  const dappKeyPair = nacl.box.keyPair();
  const [publicKey, setPublicKey] = useState(null);
  const [sharedSecret, setSharedSecret] = useState(null);
  const [session, setSession] = useState(null);
  const [encryptionPublicKey, setEncryptionPublicKey] = useState(null);

  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/kMrUikMCKkIijBbmIki8WnfM5kP72Coj"
  );
  //   const connection = new Connection("https://api.devnet.solana.com");

  //   const newpublicKey = new Uint8Array([
  //     132, 175, 111, 28, 47, 172, 248, 2, 124, 119, 76, 146, 190, 183, 1, 33, 38,
  //     151, 186, 89, 74, 151, 175, 108, 226, 90, 184, 87, 161, 193, 34, 24,
  //   ]);
  //   const secretKey = new Uint8Array([
  //     160, 222, 205, 219, 231, 240, 192, 121, 62, 119, 66, 161, 245, 123, 84, 58,
  //     178, 183, 74, 215, 39, 16, 42, 127, 101, 126, 208, 124, 23, 117, 115, 208,
  //   ]);
  //   const dappKeyPair = { publicKey: newpublicKey, secretKey: secretKey };

  function connectWithMobileApp(isSolflare = false) {
    const appUrl = "https://bitbhoomiido.tech/";
    const encryptionPublicKey = bs58.encode(dappKeyPair.publicKey);
    const redirectLink = isSolflare
      ? "https://bitbhoomiido.tech/#/wallet/connect/solflare"
      : "https://bitbhoomiido.tech/#/wallet/connect/phantom";
    const encodedAppUrl = encodeURIComponent(appUrl);
    const encodedEncryptionPublicKey = encodeURIComponent(encryptionPublicKey);
    const encodedRedirectLink = encodeURIComponent(redirectLink);
    const baseUrl = isSolflare
      ? "https://solflare.com/ul/v1/connect"
      : "https://phantom.app/ul/v1/connect";
    const queryParams = `?app_url=${encodedAppUrl}&dapp_encryption_public_key=${encodedEncryptionPublicKey}&redirect_link=${encodedRedirectLink}`;
    const deepLinkUrl = `${baseUrl}${queryParams}`;
    window.location.href = deepLinkUrl;
  }

  const createTransferTransaction = async (sol) => {
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(publicKey),
        toPubkey: new PublicKey("CqQq7oBtMjoRfaxipxWpzZeu4aQfRSN7tRivpqTD7boY"),
        lamports: parseInt(sol * LAMPORTS_PER_SOL),
      })
    );
    transaction.feePayer = publicKey;
    const anyTransaction = transaction;
    anyTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    return transaction;
  };

  const encryptPayload = (payload) => {
    const sharedSecret = nacl.box.before(
      bs58.decode(encryptionPublicKey),
      dappKeyPair.secretKey
    );

    const nonce = nacl.randomBytes(24);
    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      sharedSecret
    );

    return [nonce, encryptedPayload];
  };

  const signAndSendTransaction = async (sol, bhoomi) => {
    const isSolflare = localStorage.getItem("wallet") == "solflare";
    let alertMessage = `Opening ${
      isSolflare ? "Solflare" : "Phantom"
    } wallet. Please approve the transaction from your wallet. Do not close the wallet before the transaction is complete.`;

    const transaction = await createTransferTransaction(sol);
    transaction.feePayer = new PublicKey(publicKey);

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });

    const payload = {
      session,
      transaction: bs58.encode(serializedTransaction),
    };

    alert(alertMessage);

    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const appUrl = "https://bitbhoomiido.tech/";
    const encryptionPublicKey = bs58.encode(dappKeyPair.publicKey);
    const redirectLink = `https://bitbhoomiido.tech/#/wallet/tx/${sol}/${bhoomi}`;
    const encodedAppUrl = encodeURIComponent(appUrl);
    const encodedEncryptionPublicKey = encodeURIComponent(encryptionPublicKey);
    const encodedRedirectLink = encodeURIComponent(redirectLink);
    const baseUrl = isSolflare
      ? "https://solflare.com/ul/v1/signAndSendTransaction"
      : "https://phantom.app/ul/v1/signAndSendTransaction";
    const queryParams = `?app_url=${encodedAppUrl}&dapp_encryption_public_key=${encodedEncryptionPublicKey}&redirect_link=${encodedRedirectLink}&payload=${bs58.encode(
      encryptedPayload
    )}&nonce=${bs58.encode(nonce)}`;
    const deepLinkUrl = `${baseUrl}${queryParams}`;

    window.location.href = deepLinkUrl;
    return "mobile";
  };

  return {
    connectWithMobileApp,
    dappKeyPair,
    publicKey,
    setPublicKey,
    sharedSecret,
    setSharedSecret,
    signAndSendTransaction,
    session,
    setSession,
    encryptionPublicKey,
    setEncryptionPublicKey,
  };
};

export default Mobilewallet;
