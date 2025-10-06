import React from "react";
import Navbar from "../Navbar";
import FooterSection from "../FooterSection";

function Guestlayout(props) {
  const { children } = props;
  return (
    <div>
      <Navbar />
      {children}
      <FooterSection />
    </div>
    
  );
}

export default Guestlayout;
