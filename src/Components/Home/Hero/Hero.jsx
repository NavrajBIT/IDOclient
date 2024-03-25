import React, { useState, useEffect } from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  //   const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setRemainingTime(calculateRemainingTime());
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }, []);

  //   function calculateRemainingTime() {
  //     const targetDate = new Date("2024-03-25T18:00:00");
  //     const now = new Date();
  //     const difference = targetDate - now;

  //     if (difference <= 0) {
  //       return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  //     }

  //     const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  //     const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  //     const minutes = Math.floor((difference / 1000 / 60) % 60);
  //     const seconds = Math.floor((difference / 1000) % 60);

  //     return { days, hours, minutes, seconds };
  //   }

  return (
    <>
      <section className="heroSection">
        <h1 className="heroMaintext">Welcome to BitBhoomi IDO</h1>

        <h1 className="heroTagline">Where Technology Meets Sustainability</h1>

        {/* <div
          style={{
            fontSize: "3rem",
          }}
          className="heroMaintext"
        >
          In Progress
        </div> */}

        <button
          style={{
            padding: "20px",
            fontSize: "2rem",
            color: "white",
            background:
              "linear-gradient(95.33deg, #AD8CF8 11.46%, #9B73F7 16.35%, #8D5FF6 21.24%, #7770E2 26.14%, #7178DB 31.03%, #6288CB 35.92%, #5E8DC7 40.81%, #509CB9 45.7%, #529ABA 50.59%, #43AAAC 55.48%, #37B89F 60.37%, #2AC591 65.27%, #20D386 70.16%, #30C197 75.05%, #32BD99 79.94%, #318B86 84.83%, #49A3B2 89.72%)",
            borderRadius: "25px",
            // background: "var(--green-10)",
          }}
          onClick={() => navigate("ido")}
        >
          <h1
            // className="heroMaintext"
            style={{
              fontSize: "2rem",
              color: "white",
            }}
          >
            Buy $BHOOMI
          </h1>
        </button>

        {/* <div className="timerContainer">
          <div className="timerBox">
            <h2 className="number">{remainingTime.days}</h2>
            <h4 className="unit">Days</h4>
          </div>
          <h2 className="colon" variant="h2">
            :
          </h2>
          <div className="timerBox">
            <h2 variant="h4" className="number">
              {remainingTime.hours}
            </h2>
            <h4 variant="h6" className="unit">
              Hours
            </h4>
          </div>
          <h2 className="colon" variant="h2">
            :
          </h2>
          <div className="timerBox">
            <h2 variant="h4" className="number">
              {remainingTime.minutes}
            </h2>
            <h4 variant="h6" className="unit">
              Mins
            </h4>
          </div>
          <h2 className="colon" variant="h2">
            :
          </h2>
          <div className="timerBox">
            <h2 variant="h4" className="number">
              {remainingTime.seconds}
            </h2>
            <h4 variant="h6" className="unit">
              Sec
            </h4>
          </div>
        </div> */}
      </section>
    </>
  );
};

export default Hero;
