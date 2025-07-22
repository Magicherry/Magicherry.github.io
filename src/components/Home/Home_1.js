import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home/home-main.svg";
import Particle from "../MainFrame/Particle";
import Home_2 from "./Home_2";
import TypeWord from "./TypeWord";

function Home_1() {
  useEffect(() => {
    document.body.classList.add("homepage");
    return () => {
      document.body.classList.remove("homepage");
    };
  }, []);

  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 className="heading home__title">
                Hi There!{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="heading-name">
                This is
                <strong className="main-name"> Yuting Zhou</strong>
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
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Home_2 />
    </section>
  );
}

export default Home_1;