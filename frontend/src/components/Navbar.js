import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignOut from "./SignOut";
import { AuthContext } from "./AuthContext";
import logo from "../logo.png"

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleCloseSignInModal = () => setShowSignInModal(false);
  const handleOpenSignInModal = () => setShowSignInModal(true);
  const handleCloseSignUpModal = () => setShowSignUpModal(false);
  const handleOpenSignUpModal = () => setShowSignUpModal(true);
  const handleCloseSignOutModal = () => setShowSignOutModal(false);
  const handleOpenSigOutModal = () => setShowSignOutModal(true);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "rgba(0, 94, 164, 0.99)" }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo-img" style={{ maxHeight: "80px" }} />
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/videos">
                Plantillas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/videos">
                Simulador
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item ml-auto">
              {user ? (
                <div className="d-flex">
                  <Link className="nav-link" onClick={"#"}>Perfil</Link>
                  <SignOut handleCloseModal={handleCloseSignOutModal} />
                </div>
              ) : (
                <div className="d-flex">
                  <SignIn showModal={showSignInModal} handleCloseModal={handleCloseSignInModal} />
                  <SignUp showModal={showSignUpModal} handleCloseModal={handleCloseSignUpModal} />
                  <Link className="nav-link" onClick={handleOpenSignUpModal}>Registrarse</Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
