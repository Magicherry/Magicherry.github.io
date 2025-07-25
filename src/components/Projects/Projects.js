import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProjectCard from "./ProjectCard";

import FadeInOnScroll from "../MainFrame/FadeInOnScroll";
import { BsGridFill, BsListUl } from "react-icons/bs";
import { projects } from "./ProjectData";

const Projects = () => {
  const [viewMode, setViewMode] = useState("list");

  return (
      <Container fluid className="project-section">
        
        <Container>
          <h1 className="project-heading">
            My Recent <strong className="blue">Works</strong>
          </h1>
          <p className="projects__paragraph">
            My works make use of a vast variety of the latest technology tools.
          </p>
          <Row className={`projects__row ${viewMode}`}>
            <Col md={12} className="d-flex justify-content-end mb-4">
              <Button
                  variant="outline-primary"
                  onClick={() => setViewMode("list")}
                  className={`view-switcher__button ${viewMode === "list" ? "view-switcher__button--active" : ""}`}
              >
                <BsListUl />
              </Button>
              <Button
                  variant="outline-primary"
                  onClick={() => setViewMode("grid")}
                  className={`view-switcher__button ${viewMode === "grid" ? "view-switcher__button--active" : ""}`}
              >
                <BsGridFill />
              </Button>
            </Col>
            {projects.map((project, index) => (
                <Col
                    lg={viewMode === "grid" ? 4 : 12}
                    md={viewMode === "grid" ? 6 : 12}
                    sm={12}
                    className="project-card"
                    key={`${viewMode}-${index}`}
                >
                  <FadeInOnScroll delay={index * 100}>
                    <ProjectCard
                        {...project}
                        viewMode={viewMode}
                    />
                  </FadeInOnScroll>
                </Col>
            ))}
          </Row>
        </Container>
      </Container>
  );
};

export default Projects;