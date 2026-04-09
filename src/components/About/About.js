import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about/about.png";
import Toolstack from "./Toolstack";
import { useLanguage } from "../../context/LanguageContext";

function About() {
  const { locale } = useLanguage();
  const copy = locale === "zh"
    ? {
      title: <>进一步了解 <strong className="text-accent">我</strong></>,
      skills: <>我常用的 <strong className="text-accent">技术栈</strong></>,
      tools: <><strong className="text-accent">工具</strong> 与 <strong className="text-accent">工作流</strong></>
    }
    : {
      title: <>Know Who <strong className="text-accent">I'M</strong></>,
      skills: <>Professional <strong className="text-accent">Skillset </strong></>,
      tools: <><strong className="text-accent">Tools</strong> I use</>
    };

  return (
    <Container fluid className="about-section">
      
      <Container >
        <Row className="about__row">
          <Col
            lg={7}
            className="about__content-col"
          >
            <h1 className="about__title">
              {copy.title}
            </h1>
            <Aboutcard />
          </Col>
          <Col
            lg={5}
            className="about__image-col about-img"
          >
            <img
              src={laptopImg}
              alt="about"
              className="img-fluid"
              loading="lazy"
              decoding="async"
            />
          </Col>
        </Row>
        <h1 className="project-heading">
          {copy.skills}
        </h1>

        <Techstack />

        <h1 className="project-heading">
          {copy.tools}
        </h1>
        <Toolstack />

        <Github />
      </Container>
    </Container>
  );
}

export default About;
