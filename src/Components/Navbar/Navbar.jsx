import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useWallet } from "../../Contexts/walletContext";

const Navbar = () => {
  const mobileNavElement = useRef();
  const navigate = useNavigate();
  const wallet = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: "transparent",
  });

  const openMobileNav = () => {
    if (mobileNavElement.current)
      mobileNavElement.current.style.width = "250px";
  };

  const closeMobileNav = () => {
    setIsDropdownOpen(false);
    if (mobileNavElement.current) mobileNavElement.current.style.width = "";
  };

  const scrollToTop = () => {
    navigate("/");
    closeMobileNav();
    if (window !== "undefined")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setNavbarStyle({
        backgroundColor: scrollY > 0 ? "var(--green-40)" : "transparent",
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className="navbar"
      style={navbarStyle}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <span>
        <img src="/logo_white.png" alt="BitBhoomi_logo" className="logoImg" />
      </span>
      <div className="linksContainer">
        <button className="navLinks" onClick={scrollToTop}>
          HOME
        </button>
        <button className="navLinks" onClick={() => navigate("/ido")}>
          IDO
        </button>
        <button className="navLinks" onClick={() => navigate("/airdrop")}>
          AIRDROP
        </button>
      </div>
      <div className="btnContainer">
        <button
          className="walletBtn"
          onMouseEnter={() => setIsDropdownOpen(true)}
        >
          {wallet.isWalletConnected
            ? `${wallet?.provider?.publicKey
                .toString()
                .slice(0, 4)}...${wallet?.provider?.publicKey
                .toString()
                .slice(39)}`
            : "Connect Wallet"}
        </button>
        <img
          src="/hamburger.png"
          alt="hamburger_image"
          onClick={openMobileNav}
          className="hamburgerImg"
        />
        {isDropdownOpen && !wallet.isWalletConnected && (
          <div className="dropdown">
            <span>
              <img src="/phantom.png" alt="phantom_logo" />
              <button onClick={wallet.connect}>Phantom</button>
            </span>
            <hr />
            <span>
              <img src="/solfare.png" alt="solfare_logo" />
              <button onClick={wallet.connectSolflare}>Solfare</button>
            </span>
          </div>
        )}
        {isDropdownOpen && wallet.isWalletConnected && (
          <div className="dropdown">
            <span>
              <button onClick={wallet.disconnect}>Disconnect</button>
            </span>
          </div>
        )}
      </div>
      {/* </div> */}

      {/* MOBILE NAVBAR */}

      <div className="mobileNav" ref={mobileNavElement}>
        <img
          src="/close.png"
          alt="closeIcon"
          onClick={closeMobileNav}
          className="closeIcon"
        />
        <button className="navLinks" onClick={scrollToTop}>
          Home
        </button>
        <button className="navLinks" onClick={() => navigate("/ido")}>
          IDO
        </button>
        <button className="navLinks" onClick={() => navigate("/airdrop")}>
          Airdrop
        </button>
        <button
          className="walletBtn"
          style={{ marginTop: "1rem" }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Connect Wallet
        </button>
        {isDropdownOpen && (
          <div className="dropdown mobileDropdown">
            <span>
              <img src="/phantom.png" alt="phantom_logo" />
              <button>Phantom</button>
            </span>
            <hr />
            <span>
              <img src="/solfare.png" alt="solfare_logo" />
              <button>Solfare</button>
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
