import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // Sticky Nav Ref
  const navRef = useRef(null);

  // Sticky Navbar Handler
  const handleStickyNavbar = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      navRef.current.classList.add("sticky_nav");
    } else {
      navRef.current.classList.remove("sticky_nav");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const openHome = (event) => {
    event.preventDefault();
    setMenu("home");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMenu = (event) => {
    event.preventDefault();
    setMenu("menu");
    navigate("/");

    window.setTimeout(() => {
      document.getElementById("explore-menu")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  return (
    <div className="navbar" ref={navRef}>
      <Link to={"/"} onClick={openHome} className="logo">
        FoodZone
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={openHome}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>

        <a
          href="/#explore-menu"
          onClick={openMenu}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>

       

        <Link
          to="/contact"
          onClick={() => setMenu("contact us")}
          className={menu === "contact us" ? "active" : ""}
        >
          contact us
        </Link>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to={"/cart"}>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>login</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
