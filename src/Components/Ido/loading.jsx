import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        background: "rgba(0,0,0,0.5)",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        zIndex: "100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div>Loading...</div>
      <div
        style={{
          width: "300px",
          height: "30px",
          background: "white",
          borderRadius: "30px",
          animation: "loading 1s infinite",
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

export default Loading;
