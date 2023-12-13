import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <>
      <SideDrawer show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks onClick={() => setDrawerIsOpen(false)} />
        </nav>
      </SideDrawer>
      {drawerIsOpen && <Backdrop onClick={() => setDrawerIsOpen(false)} />}
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={() => setDrawerIsOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Discoverer</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks onClick={() => setDrawerIsOpen(false)} />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
