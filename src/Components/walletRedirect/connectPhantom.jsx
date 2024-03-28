import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import bs58 from "bs58";
import nacl from "tweetnacl";
import { useWallet } from "../../Contexts/walletContext";

const ConnectPhantom = () => {
  const wallet = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    redirect();
  }, []);

  const redirect = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {};
    for (const [key, value] of urlParams.entries()) {
      queryParams[key] = value;
    }
    if ("errorCode" in queryParams) {
      alert("Wallet Connection Denied!!");
      navigate("/");
      return;
    }

    const sharedSecret = nacl.box.before(
      bs58.decode(queryParams.phantom_encryption_public_key),
      wallet.mobile.dappKeyPair.secretKey
    );
    const decodedData = bs58.decode(queryParams.data);
    const decodedNonce = bs58.decode(queryParams.nonce);

    const decryptedData = nacl.box.open.after(
      decodedData,
      decodedNonce,
      sharedSecret
    );

    const decodedParsedData = JSON.parse(
      Buffer.from(decryptedData).toString("utf8")
    );

    wallet.mobile.setPublicKey(decodedParsedData.public_key);
    wallet.mobile.setSharedSecret(sharedSecret);
    localStorage.setItem("sharedSecret", sharedSecret);
    wallet.mobile.setSession(decodedParsedData.session);
    wallet.mobile.setEncryptionPublicKey(
      queryParams.phantom_encryption_public_key
    );
    wallet.setIsWalletConnected(true);
    localStorage.setItem("wallet", "phantom");
    localStorage.setItem("wallettype", "mobile");
    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Redirecting...
    </div>
  );
};

export default ConnectPhantom;
