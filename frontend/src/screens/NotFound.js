import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <Container className="text-center">
        <img
          src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
          alt="Not Found"
          className="img-fluid mb-4"
          style={{ maxWidth: "300px" }}
        />
        <h1 className="display-4 mb-3">404 - Página no encontrada</h1>
        <p className="lead mb-4">La página que estás buscando no existe.</p>
        <Button variant="primary" size="lg">
          <Link className="text-white" to="/" style={{ textDecoration: "none" }}>
            Volver a la página de inicio
          </Link>
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
