import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home/home-main.svg";


import TypeWord from "./TypeWord";

function Home1() {
  

  return (
    <section>
      <Container fluid className="home-section" id="home">
        
        <Container className="home-content">
          <Row className="align-items-center">
            <Col md={7} className="home-header">
              <h1 className="heading home__title">
                Hi There!{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="home-heading-label">
                I'M
                <strong className="home-hero-name"> YUTING ZHOU</strong>
                .
              </h1>

              <div className="home__typewriter-container">
                <TypeWord />
              </div>
            </Col>

            <Col md={5} className="home__image-col">
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid home__image"
                decoding="async"
                fetchPriority="high"
              />
            </Col>
          </Row>
        </Container>
      </Container>
      
    </section>
  );
}

export default Home1;