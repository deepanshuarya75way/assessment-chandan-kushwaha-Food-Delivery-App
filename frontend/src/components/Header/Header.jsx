import React from "react";
import "./Header.css";

const Header = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("explore-menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Place your favorite food order here</h2>
        <p>
          Select from a diverse menu offering a delectable selection of dishes,
          made with the finest ingredients and expert culinary skills. Our goal
          is to satisfy your cravings and enhance your dining experience with
          every delicious meal.
        </p>
        <button id="view-menu-button" type="button" onClick={scrollToMenu}>
          View Menu
        </button>
      </div>
    </div>
  );
};

export default Header;
