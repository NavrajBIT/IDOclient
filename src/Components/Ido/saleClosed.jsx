import { useNavigate } from "react-router-dom";

const SaleClosed = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: "fixed",
        background: "rgba(0,0,0,0.8)",
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
        Token Sale is Closed!!
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

export default SaleClosed;
