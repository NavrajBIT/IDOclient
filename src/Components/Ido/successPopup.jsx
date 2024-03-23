import React from "react";

const SuccessPopup = () => {
  return (
    <div
      style={{
        position: "fixed",
        background: "var(--green-40)",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        zIndex: "200",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontSize: "3rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontSize: "3rem",
          background: "black",
          padding: "30px",
          gap: "10px",
          border: "1px solid white",
          textAlign: "center",
        }}
      >
        Transaction Successfull!
        <div
          style={{
            fontSize: "2rem",
          }}
        >
          Bhoomi tokens will reflect in your wallet within 24 hours.
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "30px",
            fontSize: "2rem",
            borderRadius: "100px",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
