import React, { useState, useEffect } from "react";
import "./Hero.css";

const Hero = () => {
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

        <div
          style={{
            fontSize: "3rem",
          }}
          className="heroMaintext"
        >
          In Progress
        </div>

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
