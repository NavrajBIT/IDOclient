import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Ido.css";
import { useWallet } from "../../Contexts/walletContext";
import Loading from "./loading";
import useAPI from "../useAPI";
import { useNavigate } from "react-router-dom";

const Ido = () => {
  const api = useAPI();
  const wallet = useWallet();
  const navigate = useNavigate();
  const [sol, setSol] = useState("");
  const [bhoomi, setBhoomi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversion, setConversion] = useState(null);
  useEffect(() => {
    if (isNaN(parseFloat(sol))) setBhoomi(0);
    else {
      if (!conversion) setBhoomi(0);
      else {
        setBhoomi(parseFloat(sol) * parseFloat(conversion) * 10);
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
    wallet.isWalletConnected;

  return (
    <>
      <Navbar />

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

              {isValid && (
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    const tx = await wallet
                      .sendSol(parseFloat(sol))
                      .then((res) => res)
                      .catch((err) => null);

                    if (!tx) {
                      setIsLoading(false);
                      alert("Transaction Unsuccessfull!");

                      return;
                    }
                    let amount = Number(parseFloat(bhoomi).toFixed(2));
                    await api
                      .crud("POST", "mintbhoomitoken", {
                        address: wallet.provider.publicKey.toString(),
                        amount: amount,
                        tx: tx,
                      })
                      .then((res) =>
                        alert(
                          "Mint successfull. Bhoomi tokens will reflect in your wallet shortly."
                        )
                      )
                      .catch((err) => console.log(err));
                    window.location.reload();
                    setIsLoading(false);
                  }}
                >
                  Buy
                </button>
              )}
            </div>

            <div className="progressContent">
              <h4>
                Sale Progress (
                {wallet?.supplydata ? `${wallet.supplydata.percentage}%` : "0%"}
                )
              </h4>
              <h6>
                {/* ({wallet?.supplydata?.mintedTokens}$ Of{" "}
                {wallet?.supplydata?.totalAvailableToMint}) */}
              </h6>
              <div className="progressBar">
                <div
                  class="progressContainer"
                  style={{
                    width: wallet?.supplydata
                      ? `${wallet.supplydata.percentage}%`
                      : "0%",
                  }}
                >
                  {/* <div class="progress-bar"></div> */}
                  <div class="progressSphere"></div>
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
                <h6 className="value">
                  GCB6UqJUmf1poDdoLA4CKxuQ5vnmenrUtrikyrSfccco
                </h6>
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
