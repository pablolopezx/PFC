import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase-config";
import { Link } from "react-router-dom";

const SignOut = ({ handleCloseModal }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Usuario cerró sesión exitosamente");
      handleCloseModal(); // Cerrar el modal después de cerrar sesión
      navigate('/'); // Redirige al usuario a la página de inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handleConfirmSignOut = async () => {
    console.log("Sesión cerrada");
    await handleSignOut();
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirmar cierre de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas cerrar la sesión?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center mb-3">
          <Button variant="primary" onClick={handleConfirmSignOut} className="btn btn-block" style={{ minWidth: '20%' }}>
            Sí
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)} className="btn btn-block" style={{ minWidth: '20%' }}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <Link className="nav-link" onClick={() => setShowModal(true)}>Cerrar sesión</Link>
    </>
  );
};

export default SignOut;
