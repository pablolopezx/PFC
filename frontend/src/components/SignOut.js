import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Importa hook para la navegación en React Router
import { auth } from "../firebase/firebase-config"; // Importa objeto de autenticación de Firebase
import { Link } from "react-router-dom"; // Importa componente Link de React Router

const SignOut = ({ handleCloseModal }) => {
  // Estado para controlar la visibilidad del modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Cierra la sesión del usuario
      console.log("Usuario cerró sesión exitosamente");
      handleCloseModal(); // Cierra el modal después de cerrar sesión
      navigate('/'); // Redirige al usuario a la página de inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  // Función para confirmar el cierre de sesión
  const handleConfirmSignOut = async () => {
    console.log("Sesión cerrada");
    await handleSignOut();
  };

  return (
    <>
      {/* Modal de confirmación para cerrar sesión */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirmar cierre de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas cerrar la sesión?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center mb-3">
          {/* Botón para confirmar el cierre de sesión */}
          <Button variant="primary" onClick={handleConfirmSignOut} className="btn btn-block" style={{ minWidth: '20%' }}>
            Sí
          </Button>
          {/* Botón para cancelar el cierre de sesión */}
          <Button variant="secondary" onClick={() => setShowModal(false)} className="btn btn-block" style={{ minWidth: '20%' }}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Enlace para abrir el modal de confirmación */}
      <Link className="nav-link" onClick={() => setShowModal(true)}>Cerrar sesión</Link>
    </>
  );
};

export default SignOut;
