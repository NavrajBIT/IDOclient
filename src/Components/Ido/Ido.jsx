import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Ido.css";
import { useWallet } from "../../Contexts/walletContext";
import Loading from "./loading";
import useAPI from "../useAPI";

const Ido = () => {
  const api = useAPI();
  const wallet = useWallet();
  const [sol, setSol] = useState("");
  const [bhoomi, setBhoomi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isNaN(parseFloat(sol))) setBhoomi(0);
    else {
      setBhoomi(parseFloat(sol) / 10);
    }
  }, [sol]);

  const isValid = !isNaN(sol) && sol > 0 && !isNaN(bhoomi) && bhoomi > 0;

  return (
    <>
      <Navbar />

      <div className="bgStyle">
        {isLoading && <Loading />}
        <section className="idoSection">
          <div className="formContainer">
            <h1 className="containerHead">$BHOOMI Token Sale</h1>

            <label htmlFor="">Enter total $ Sol you want to contribute:</label>
            <input
              type="number"
              value={sol}
              onChange={(e) => setSol(e.target.value)}
            />

            <label htmlFor="">Total Bhoomi tokens to be received:</label>
            <input type="text" value={bhoomi} onChange={() => {}} />

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
                  setIsLoading(false);
                }}
              >
                Buy
              </button>
            )}

            <div
              class="progressContainer"
              style={{
                width: wallet?.supplydata
                  ? `${wallet.supplydata.percentage}%`
                  : "99%",
              }}
            >
              {/* <div class="progress-bar"></div> */}
              <div class="progressSphere"></div>
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
                  5UmjnxfKkG55E2m6BPAZFaM6hUy6jtEJC9zGgxdqjxKL
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
