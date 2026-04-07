import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home/home-main.svg";


import TypeWord from "./TypeWord";
import { useLanguage } from "../../context/LanguageContext";

function Home1() {
  const { locale } = useLanguage();
  const copy = locale === "zh"
    ? {
      greeting: "你好呀！",
      intro: "我是",
      name: "周昱廷",
      waveLabel: "挥手"
    }
    : {
      greeting: "Hi There!",
      intro: "I'M",
      name: "YUTING ZHOU",
      waveLabel: "wave"
    };

  return (
    <section>
      <Container fluid className="home-section" id="home">
        
        <Container className="home-content">
          <Row className="align-items-center">
            <Col md={7} className="home-header">
              <h1 className="heading home__title">
                {copy.greeting}{" "}
                <span className="wave" role="img" aria-label={copy.waveLabel}>
                  👋🏻
                </span>
              </h1>

              <h1 className="home-heading-label">
                {copy.intro}
                <strong className="home-hero-name"> {copy.name}</strong>
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
