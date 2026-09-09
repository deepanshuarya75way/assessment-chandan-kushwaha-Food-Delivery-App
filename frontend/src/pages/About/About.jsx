import React from "react";
import "../InfoPage.css";

const About = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <span className="info-badge">Who we are</span>
        <h1>About FoodZone</h1>
        <p>
          FoodZone is a modern food delivery platform built to make ordering your
          favorite meals simple, quick, and enjoyable. We connect food lovers with
          restaurants serving fresh, delicious food across the city.
        </p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Our Mission</h3>
          <p>
            To make every meal feel effortless by combining quality food, trusted
            service, and a seamless digital experience.
          </p>
        </div>

        <div className="info-card">
          <h3>Our Promise</h3>
          <p>
            Fresh ingredients, transparent service, and dependable delivery that
            keeps your kitchen stress-free.
          </p>
        </div>

        <div className="info-card">
          <h3>Why People Choose Us</h3>
          <p>
            Great taste, quick delivery, and a friendly experience for every order
            from lunch breaks to late-night cravings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
