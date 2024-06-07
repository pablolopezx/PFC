import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Home.css"

const Home = () => {
  // Estado para almacenar el índice de la imagen activa
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Array de URLs de las imágenes de la galería
  const galleryImgs = [
    "https://futbolformativo.com/blog/wp-content/uploads/Pizarra_Tactica-300x177.png",
    "https://noticiascoruna.es/wp-content/uploads/2024/04/IMG_20240407_170059-696x522.jpg",
    "https://www.fiebrefutbol.es/wp-content/uploads/2014/11/%C2%BFEstas-preparado-para-entrenar-1030x685.jpg",
    "https://s1.abcstatics.com/abc/www/multimedia/deportes/2024/05/12/1481080974-RNxu1XTNifHiHH3jCDV3rpN-1200x840@diario_abc.jpg",
    "https://imagenes.elpais.com/resizer/v2/SOIGGEGRRON7NJFNX2WC4GJY6U.jpg?auth=6e1442637d5d7b1c2c67ba085b0255a1dcb27aae5c31a93f4dafe6805ea9f2c5&width=414"
  ];

  useEffect(() => {
    // Configurar un intervalo para cambiar la imagen activa cada 5 segundos
    const interval = setInterval(() => {
      const nextImgIndex =
        activeImgIndex + 1 < galleryImgs.length ? activeImgIndex + 1 : 0;
      setActiveImgIndex(nextImgIndex);
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonta o cuando el índice de imagen activa cambia
    return () => clearInterval(interval);
  }, [activeImgIndex, galleryImgs.length]);

  return (
    <div className="home-page">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <div
              className="jumbotron text-center"
              style={{
                padding: "2rem", // Aumenta el espacio alrededor del contenido
                borderRadius: "10px", // Agrega esquinas redondeadas
                color: "#000", // Color del texto
                fontFamily: "Arial, sans-serif", // Fuente del texto
              }}
            >
              <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                Bienvenido a FutSimSP
              </h1>
              <div className="gallery">
                {galleryImgs.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    className={index === activeImgIndex ? "active" : ""}
                  />
                ))}
              </div>
              <p>El simulador de fútbol español más actualizado</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
