import React, { useState } from "react";
import { Modal, Button, Form, FormControl, FormGroup } from "react-bootstrap";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { Link } from "react-router-dom";

const SignIn = ({ handleCloseModal }) => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseSignInModal = () => {
    setShowModal(false);
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Usuario ingresado:", userCredential.user);
      handleCloseModal(); 
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message); 
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Usuario ingresado:", userCredential.user);
      handleCloseModal(); 
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  return (
    <>
      <Link className="nav-link" onClick={handleOpenModal}>Iniciar sesión</Link>
      <Modal show={showModal} onHide={handleCloseSignInModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button variant="light" className="w-100" onClick={signInWithGoogle}>Iniciar sesión con Google</Button>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between align-items-center mb-3 w-100">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
            </div>
            <Link to="#" className="text-muted">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="d-grid gap-2 mb-3 w-100">
            <Button variant="primary" onClick={handleSignIn}>Iniciar sesión</Button>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignIn;
