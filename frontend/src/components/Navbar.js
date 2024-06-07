import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import SignUp from "./SignUp";
import { AuthContext } from "./AuthContext";
import logo from "../logo.png"

const Navbar = () => {
  // Obtiene el estado del usuario del contexto de autenticación
  const { user } = useContext(AuthContext);

  // Estado local para controlar la visibilidad de los modales de inicio de sesión, cierre de sesión y registro
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Funciones para abrir y cerrar los modales
  const handleCloseSignInModal = () => setShowSignInModal(false);
  const handleOpenSignInModal = () => setShowSignInModal(true);
  const handleCloseSignUpModal = () => setShowSignUpModal(false);
  const handleOpenSignUpModal = () => setShowSignUpModal(true);
  const handleCloseSignOutModal = () => setShowSignOutModal(false);
  const handleOpenSigOutModal = () => setShowSignOutModal(true);

  return (
    // Barra de navegación
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "rgba(0, 94, 164, 0.99)" }}>
      <div className="container">
        {/* Botón de hamburguesa para dispositivos móviles */}
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
        {/* Contenido de la barra de navegación */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          {/* Enlaces de navegación */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/squads">
                Plantillas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/simulator">
                Simulador
              </Link>
            </li>
          </ul>
          {/* Sección de autenticación */}
          {/* Enlace a la página principal con el logo */}
        <Link className="navbar-brand" to="/">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo-img" style={{ maxHeight: "80px" }} />
          </div>
        </Link>
          <ul className="navbar-nav">
            <li className="nav-item ml-auto">
              {/* Si el usuario está autenticado, muestra enlaces al perfil y cierre de sesión */}
              {user ? (
                <div className="d-flex">
                  <Link className="nav-link" to="/perfil">Perfil</Link>
                  <SignOut handleCloseModal={handleCloseSignOutModal} />
                </div>
              ) : (
                /* Si el usuario no está autenticado, muestra enlaces a inicio de sesión, registro y registrarse */
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
