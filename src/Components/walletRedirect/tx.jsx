import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { useWallet } from "../../Contexts/walletContext";
import { useParams } from "react-router-dom";
import useAPI from "../useAPI";

const Tx = () => {
  const api = useAPI();
  const wallet = useWallet();
  const navigate = useNavigate();
  const params = useParams();

  const [txStatus, setTxStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    processTx();
  }, []);

  const processTx = async () => {
    setTxStatus(
      "Processing Transaction... Please do not refresh or press the back button."
    );
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {};
    for (const [key, value] of urlParams.entries()) {
      queryParams[key] = value;
    }
    if ("errorCode" in queryParams) {
      setIsLoading(false);
      setTxStatus("Transaction Unsuccessfull!");
    } else {
      let sharedSecretString = localStorage.getItem("sharedSecret");
      const numbers = sharedSecretString.split(",").map(Number);
      const sharedSecret = new Uint8Array(numbers);
      try {
        const decodeParamData = bs58.decode(queryParams.data);
        const decodeParamNonce = bs58.decode(queryParams.nonce);
        const decryptedData = nacl.box.open.after(
          decodeParamData,
          decodeParamNonce,
          sharedSecret
        );

        console.log(decryptedData);

        let decodedData = JSON.parse(
          Buffer.from(decryptedData).toString("utf8")
        );
        console.log(decodedData);
        const signature = decodedData.signature;
        await api
          .crud("POST", "mint", {
            address: decodedData.publicKey,
            amount: params.bhoomi,
            tx: signature,
            sol: params.sol,
          })
          .then((res) => {
            setIsLoading(false);
            setTxStatus(
              "Transaction Successfull. Bhoomi tokens will reflect in your wallet within 24 hours."
            );
          })
          .catch((err) => {
            setIsLoading(false);
            setTxStatus(
              "Something went wrong. Please Try again. If your amount was deducted, please contact support@beimagine.tech"
            );
          });
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setTxStatus(
          "Something went wrong. Please Try again. If your amount was deducted, please contact support@beimagine.tech"
        );
      }
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem" }}>
        {isLoading
          ? "Processing Transaction... Please do not refresh or press the back button."
          : txStatus}
      </div>
      {!isLoading && (
        <button
          style={{
            fontSize: "2rem",
            padding: "20px",
            borderRadius: "50%",
          }}
          onClick={() => navigate("/")}
        >
          OK
        </button>
      )}
    </div>
  );
};

export default Tx;
