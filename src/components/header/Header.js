import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../logo.svg";

const nav = [
  {
    text: "home",
    path: "/",
  },
  {
    text: "about",
    path: "/about",
  },
  {
    text: "Destination",
    path: "/destination",
  },
  {
    text: "Tour",
    path: "/tour",
  },
  {
    text: "Blog",
    path: "/blog",
  },
];

const Header = () => {
  const [navList, setNavList] = useState(false);

  return (
    <>
      <header>
        <div className="container flex">
          <div className="logo">
            <a>
            <img src={logo} alt="" />Dorm</a>
          </div>
          <div className="nav">
            <ul className={navList ? "small" : "flex"}>
              {nav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path}>{list.text}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="button flex">
            <h4>
              Login
            </h4>
            <button className="btn1">
              <i className="fa fa-sign-out"></i> Sign Up
            </button>
          </div>

          <div className="toggle">
            <button onClick={() => setNavList(!navList)} className="user-button">
              {navList ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
