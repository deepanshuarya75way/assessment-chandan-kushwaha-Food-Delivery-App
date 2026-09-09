import React from "react";
import "../InfoPage.css";

const Privacy = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <span className="info-badge">Trust & safety</span>
        <h1>Privacy Policy</h1>
        <p>
          FoodZone values your privacy. We collect only the information needed to
          process orders, improve service, and provide better support.
        </p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Data We Use</h3>
          <p>
            We use your contact and delivery information only to complete orders,
            send updates, and support service requests.
          </p>
        </div>

        <div className="info-card">
          <h3>How We Protect It</h3>
          <p>
            Your personal details are kept secure and only accessed by the team
            required to provide a safe ordering experience.
          </p>
        </div>

        <div className="info-card">
          <h3>Your Control</h3>
          <p>
            You can choose what information you share, and we do not share your
            personal data with third parties without your consent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
