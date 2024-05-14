import React from "react";
import { Container, Row, Col} from "react-bootstrap";

const Home = () => {
  return (
    <div className="home-page" style={{ position:"relative" }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <div className="jumbotron">
              <h1 className="text-center">Bienvenido a FutSimSP</h1>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
