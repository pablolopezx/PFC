import React, { useState } from "react";
import { Modal, Button, Form, FormControl, FormGroup } from "react-bootstrap"; // Importa componentes de Bootstrap
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Importa funciones de autenticación de Firebase
import { auth } from "../firebase/firebase-config"; // Importa objeto de autenticación de Firebase
import { Link } from "react-router-dom"; // Importa componente Link de React Router

const SignIn = ({ handleCloseModal }) => {
  // Estados para controlar la visibilidad del modal, email, contraseña y errores
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  // Función para abrir el modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal de inicio de sesión
  const handleCloseSignInModal = () => {
    setShowModal(false);
  };

  // Función para iniciar sesión con correo y contraseña
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Usuario ingresado:", userCredential.user);
      handleCloseModal(); // Cierra el modal después de iniciar sesión
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message); // Establece el mensaje de error
    }
  };

  // Función para iniciar sesión con Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Usuario ingresado:", userCredential.user);
      handleCloseModal(); // Cierra el modal después de iniciar sesión
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  return (
    <>
      {/* Enlace para abrir el modal de inicio de sesión */}
      <Link className="nav-link" onClick={handleOpenModal}>Iniciar sesión</Link>
      {/* Modal de inicio de sesión */}
      <Modal show={showModal} onHide={handleCloseSignInModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Formulario de inicio de sesión */}
          <Form>
            <FormGroup className="mb-3">
              <FormControl
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormControl
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
          </Form>
          {/* Botón para iniciar sesión con Google */}
          <Button variant="light" className="w-100 d-flex align-items-center justify-content-center" onClick={signInWithGoogle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="20px"
              height="20px"
              className="me-2"
            >
              <path fill="#4285F4" d="M24 9.5c3.21 0 5.89 1.18 8.08 3.12l6.04-6.04C34.39 3.43 29.55 1 24 1 14.95 1 7.36 6.48 3.68 14.29l7.04 5.47C12.97 13.41 18.03 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.5 24c0-1.68-.15-3.3-.44-4.87H24v9.24h12.62c-.59 3.2-2.23 5.91-4.74 7.75l7.04 5.47C43.61 37.52 46.5 31.18 46.5 24z"/>
              <path fill="#FBBC05" d="M10.72 29.76c-1.11-1.55-1.75-3.46-1.75-5.76s.64-4.21 1.75-5.76l-7.04-5.47C2.14 16.15 1 19.95 1 24s1.14 7.85 2.68 11.23l7.04-5.47z"/>
              <path fill="#EA4335" d="M24 46.5c5.55 0 10.39-1.84 13.87-4.99l-7.04-5.47c-2.02 1.35-4.6 2.15-6.83 2.15-5.97 0-11.03-3.91-12.93-9.23l-7.04 5.47C7.36 41.52 14.95 46.5 24 46.5z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Iniciar sesión con Google
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between align-items-center mb-3 w-100">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
            </div>
            {/* Enlace para restablecer la contraseña */}
            <Link to="#" className="text-muted">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="d-grid gap-2 mb-3 w-100">
            {/* Botón para iniciar sesión con correo y contraseña */}
            <Button variant="primary" onClick={handleSignIn}>Iniciar sesión</Button>
          </div>
          {/* Mostrar mensaje de error si hay uno */}
          {error && <p className="text-danger">{error}</p>}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignIn;
