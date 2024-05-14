import React from "react";

const Footer = () => {
  return (
    <div style={{
      position: "relative",
      marginBottom: "auto"
    }}>
      <footer className="mt-2 text-light text-center py-3 initial-bottom" 
        style={{
          background: "rgba(0, 94, 164, 0.99)",
        }}
      >
        <div className="container">&copy; 2024 FutSimSP</div>
      </footer>

    </div>
  );
};

export default Footer;
