import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about/about.png";
import Toolstack from "./Toolstack";

function About() {
  return (
    <Container fluid className="about-section">
      
      <Container >
        <Row className="about__row">
          <Col
            md={7}
            className="about__content-col"
          >
            <h1 className="about__title">
              Know Who <strong className="blue">I'M</strong>
            </h1>
            <Aboutcard />
          </Col>
          <Col
            md={5}
            className="about__image-col about-img"
          >
            <img src={laptopImg} alt="about" className="img-fluid" />
          </Col>
        </Row>
        <h1 className="project-heading">
          Professional <strong className="blue">Skillset </strong>
        </h1>

        <Techstack />

        <h1 className="project-heading">
          <strong className="blue">Tools</strong> I use
        </h1>
        <Toolstack />

        <Github />
      </Container>
    </Container>
  );
}

export default About;
