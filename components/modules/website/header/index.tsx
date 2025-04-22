"use client";
import React, { useState, useEffect } from "react";
import Ad from "./Ad";
import Menus from "./Menus";
import Main from "./Main";
import Col from "../../custom/Col";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) { // Height of Ad section
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <Col className="gap-y-2">
        <Ad className={`transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`} />
        <div className={`${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''}`}>
          <Main />
          <Menus />
        </div>
      </Col>
    </header>
  );
}
