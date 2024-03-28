import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Ido.css";
import { useWallet } from "../../Contexts/walletContext";
import Loading from "./loading";
import useAPI from "../useAPI";
import { useNavigate } from "react-router-dom";
import SaleClosed from "./saleClosed";
import SuccessPopup from "./successPopup";

const Ido = () => {
  const api = useAPI();
  const wallet = useWallet();
  const navigate = useNavigate();
  const [sol, setSol] = useState("");
  const [bhoomi, setBhoomi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversion, setConversion] = useState(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (isNaN(parseFloat(sol))) setBhoomi(0);
    else {
      if (!conversion) setBhoomi(0);
      else {
        let convertedAmount = parseFloat(sol) * parseFloat(conversion) * 10;
        let amount = Number(parseFloat(convertedAmount).toFixed(9));
        setBhoomi(amount);
      }
    }
  }, [sol, conversion]);

  useEffect(() => {
    getExchangeRate();
  }, []);

  const getExchangeRate = async () => {
    setIsLoading(true);
    await fetch(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=SOL&tsyms=SOL,USD&api_key=a0d74da5182505e471796936416d849166115c9f413ddad7f7e2caff213b0ae5"
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        console.log(`SOL exchange rate = ${res["SOL"]["USD"]}`);
        setConversion(parseFloat(res["SOL"]["USD"]));
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const isValid =
    !isNaN(sol) &&
    sol > 0 &&
    !isNaN(bhoomi) &&
    bhoomi > 0 &&
    conversion &&
    wallet.isWalletConnected &&
    bhoomi <= wallet?.supplydata?.remaintingTokens &&
    wallet?.supplydata?.remaintingTokens >= 1;

  const isSaleClosed = wallet?.supplydata?.remaintingTokens <= 1;

  return (
    <>
      <Navbar />
      {success && <SuccessPopup />}
      {isSaleClosed && <SaleClosed />}
      <div className="bgStyle">
        {isLoading && <Loading />}
        <section className="idoSection">
          <div className="formContainer">
            <div className="formColor">
              <h1 className="containerHead">$BHOOMI Token Sale</h1>
              <label htmlFor="">
                Enter total $ Sol you want to contribute:
              </label>
              <input
                type="text"
                value={sol}
                onChange={(e) => setSol(e.target.value)}
              />

              <label htmlFor="">Total Bhoomi tokens to be received:</label>
              <input type="text" value={bhoomi} onChange={() => {}} />

              {!wallet.isWalletConnected && (
                <div
                  style={{
                    paddingBottom: "3.5rem",
                  }}
                >
                  *Please connect your wallet.
                </div>
              )}
              {wallet?.supplydata?.remaintingTokens <= 1 && (
                <div
                  style={{
                    paddingBottom: "1.5rem",
                    fontSize: "2rem",
                  }}
                >
                  Token sale is closed.
                </div>
              )}

              {isValid && (
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    let tx = null;
                    let wallettype = localStorage.getItem("wallettype");
                    if (wallettype == "mobile") {
                      tx = await wallet.mobile.signAndSendTransaction(
                        sol,
                        bhoomi
                      );
                    } else {
                      tx = await wallet
                        .sendSol(parseFloat(sol))
                        .then((res) => res)
                        .catch((err) => null);
                    }

                    if (!tx) {
                      setIsLoading(false);
                      alert("Transaction Unsuccessfull!");
                      return;
                    }

                    if (tx !== "mobile") {
                      await api
                        .crud("POST", "mint", {
                          address: wallet.provider.publicKey.toString(),
                          amount: bhoomi,
                          tx: tx,
                          sol: sol,
                        })
                        .then((res) => {
                          setSuccess(true);
                        })
                        .catch((err) => {
                          alert(
                            "Something went wrong. Please try again. If your amount was deducted, please contact support@beimagine.tech"
                          );
                        });
                    }

                    setIsLoading(false);
                  }}
                >
                  Buy
                </button>
              )}

              <div style={{ marginBottom: "1rem" }}>
                Available Tokens = {wallet?.supplydata?.remaintingTokens}
              </div>
            </div>

            <div className="progressContent">
              <h4>
                Sale Progress (
                {wallet?.supplydata
                  ? `${Math.min(
                      parseFloat(wallet.supplydata.percentage),
                      100
                    )}%`
                  : "0%"}
                )
              </h4>
              <h6>
                {/* ({wallet?.supplydata?.mintedTokens}$ Of{" "}
                {wallet?.supplydata?.totalAvailableToMint}) */}
              </h6>
              <div className="progressBar">
                <div
                  className="progressContainer"
                  style={{
                    width: wallet?.supplydata
                      ? `${Math.min(
                          parseFloat(wallet.supplydata.percentage),
                          100
                        )}%`
                      : "0%",
                  }}
                >
                  {/* <div class="progress-bar"></div> */}
                  <div className="progressSphere"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="infoContainer">
            <div className="balanceContainer">
              <h4 className="containerHead">BHOOMI Balance</h4>
              <h1>{wallet.bhoomibalance}</h1>
            </div>
            <div className="detailContainer">
              <h4 className="containerHead">Token Details</h4>
              <span>
                <span>Symbol:</span>
                <span className="value">$Bhoomi</span>
              </span>
              <span className="address">
                <span>Contract Address:</span>
                <h6 className="value">{wallet?.contractAddress}</h6>
              </span>
              <span>
                <span>Decimal:</span>
                <span className="value">9</span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Ido;
