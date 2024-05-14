import React, { useState } from "react";
import { Modal, Button, Form, FormControl, FormGroup } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

const SignUp = ({ showModal, handleCloseModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Estado para controlar si el usuario ha iniciado sesión

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
          <Button variant="primary" onClick={registrar} style={{ minWidth: '2%' }}>Registrarse</Button>
          <Button variant="secondary" onClick={handleCloseModal} style={{ minWidth: '25%' }}>Cancelar</Button>
        </div>
        <Button className="w-100 mx-auto text-align-center" variant="light" onClick={registrarConGoogle}>Registrarse con Google</Button>
        {successMessage && <p>{successMessage}</p>}
      </Modal.Footer>
    </Modal>
  );
};

export default SignUp;
