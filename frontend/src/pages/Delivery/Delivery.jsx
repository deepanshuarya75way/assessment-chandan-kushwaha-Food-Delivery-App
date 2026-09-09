import React from "react";
import "../InfoPage.css";

const Delivery = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <span className="info-badge">Fast service</span>
        <h1>Delivery</h1>
        <p>
          We offer fast and reliable food delivery across your area. Orders are
          prepared fresh and packed carefully to ensure they reach you in great
          condition.
        </p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Quick Dispatch</h3>
          <p>
            Orders are prepared and sent out quickly to reduce waiting time and
            keep your food fresh and hot.
          </p>
        </div>

        <div className="info-card">
          <h3>Live Tracking</h3>
          <p>
            Stay informed as your order moves from the kitchen to your door with a
            smooth delivery process.
          </p>
        </div>

        <div className="info-card">
          <h3>Area Coverage</h3>
          <p>
            We aim to serve a wide range of neighborhoods so your favorite meals
            are always within reach.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
