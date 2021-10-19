import React, { useState } from "react";
import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = (props) => {
  const [drawerIsOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}

      <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
        <nav className="main-navigation-drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation-menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>

        <h1 className="main-navigation-title">
          <Link to="/">Ghumo Phiro </Link>
        </h1>

        <nav className="main-navigation-header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
