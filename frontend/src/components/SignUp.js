import React, { useState } from "react";
import { Modal, Button, Form, FormControl, FormGroup } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Importar función para crear usuario con correo y contraseña desde Firebase Auth
import { auth } from "../firebase/firebase-config"; // Importar objeto de autenticación de Firebase

const SignUp = ({ showModal, handleCloseModal }) => {
  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Estado para controlar si el usuario ha iniciado sesión

  // Función para registrar un usuario con correo y contraseña
  const registrar = async () => {
    try {
      const credencialUsuario = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Usuario registrado:", credencialUsuario.user);
      setSuccessMessage("¡Registro exitoso!");
      handleCloseModal(true);
      setIsUserLoggedIn(true); // Actualiza el estado para indicar que el usuario ha iniciado sesión
    } catch (error) {
      console.error("Error al registrarse:", error.message);
    }
  };

  // Función para registrar un usuario con Google
  const registrarConGoogle = async () => {
    try {
      const proveedor = new firebase.auth.GoogleAuthProvider();
      const credencialUsuario = await auth.signInWithPopup(proveedor);
      console.log("Usuario registrado con Google:", credencialUsuario.user);
      setSuccessMessage("¡Registro exitoso!");
      handleCloseModal();
      setIsUserLoggedIn(true); // Actualiza el estado para indicar que el usuario ha iniciado sesión
    } catch (error) {
      console.error("Error al registrarse con Google:", error.message);
    }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Campos de formulario para nombre, teléfono, correo electrónico y contraseña */}
          <FormGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormControl
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormControl
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormControl
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex w-100 justify-content-around">
          {/* Botón para registrarse con correo y contraseña */}
          <Button variant="primary" onClick={registrar} style={{ minWidth: '2%' }}>Registrarse</Button>
          {/* Botón para cancelar */}
          <Button variant="secondary" onClick={handleCloseModal} style={{ minWidth: '25%' }}>Cancelar</Button>
        </div>
        {/* Botón para registrarse con Google */}
        <Button className="w-100 mx-auto text-align-center" variant="light" onClick={registrarConGoogle}>
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
          Registrarse con Google
        </Button>
        {/* Mostrar mensaje de éxito después del registro */}
        {successMessage && <p>{successMessage}</p>}
      </Modal.Footer>
    </Modal>
  );
};

export default SignUp;
