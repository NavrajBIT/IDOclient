import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Ido.css";
import { useWallet } from "../../Contexts/walletContext";

const Ido = () => {
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
  return (
    <>
      <Navbar />

      <div className="bgStyle">
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

            <button
              onClick={async () => {
                const tx = await wallet.sendSol(parseFloat(sol));
              }}
            >
              Buy
            </button>
            <button onClick={() => wallet.getBalance()}>Balance</button>

            <div class="progressContainer">
              {/* <div class="progress-bar"></div> */}
              <div class="progressSphere"></div>
            </div>
          </div>

          <div className="infoContainer">
            <div className="balanceContainer">
              <h4 className="containerHead">BHOOMI Balance</h4>
              <h1>1,00,000</h1>
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
                  Aa5w19iqzLynJ1kcAKQf53LhWSBX9c1dGhSzRJweRUY9
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
