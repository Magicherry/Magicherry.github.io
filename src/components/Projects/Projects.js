import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../MainFrame/Particle";
import { BsGridFill, BsListUl } from "react-icons/bs";

// 项目数据
const projects = [
  {
    imgPath: require("../../Assets/projects/AYE.png"),
    title: "AyeNote Online Cloud Notes",
    description: "A full-stack note-taking application featuring a Vue3 front-end and a Django back-end. Includes web scraping and data mining capabilities to analyze user data.",
    ghLink: "https://github.com/Magicherry/AyeNote",
    demoLink: "https://github.com/Magicherry/AyeNote",
    tags: ["Python", "Django", "Vue3"],
  },
  {
    imgPath: require("../../Assets/projects/KOB.png"),
    title: "King of Bots",
    description: "A real-time strategy game with a SpringBoot back-end and a Vue3 front-end. Features a MySQL database and a Bootstrap 4 interface for a dynamic gaming experience.",
    ghLink: "https://github.com/Magicherry/King-of-Bots",
    demoLink: "https://github.com/Magicherry/King-of-Bots",
    tags: ["Java", "SpringBoot", "Vue3", "MySQL"],
  },
  {
    imgPath: require("../../Assets/projects/Movenet.png"),
    title: "Real-time Pose Estimation",
    description: "A web application that uses Google's Movenet model to perform real-time pose estimation from a webcam feed, providing instant feedback on movement accuracy.",
    ghLink: "https://github.com/Magicherry/Pose_Estimation",
    demoLink: "https://github.com/Magicherry/Pose_Estimation",
    tags: ["Computer Vision", "Python", "Movenet"],
  },
  {
    imgPath: require("../../Assets/projects/Book.png"),
    title: "Management Web System",
    description: "A comprehensive management system built with SpringBoot and MyBatis. Features a secure database with MD5 encryption and a clear separation of front-end and back-end concerns.",
    ghLink: "https://github.com/Magicherry/Management_Web_System",
    demoLink: "https://github.com/Magicherry/Management_Web_System",
    tags: ["SpringBoot", "MyBatis", "Vue3", "MySQL"],
  },
  {
    imgPath: require("../../Assets/projects/music.png"),
    title: "MusicApp UX Design",
    description: "A high-fidelity UX prototype for a third-party music streaming application, designed in Axure RP 9 and inspired by Apple Music's clean and intuitive interface.",
    ghLink: "https://github.com/Magicherry/Music-App-Ui-Design",
    demoLink: "https://github.com/Magicherry/Music-App-Ui-Design",
    tags: ["Axure RP"],
  },
  {
    imgPath: require("../../Assets/projects/KOF.png"),
    title: "King of Fighters",
    description: "A classic fighting game clone built with HTML and JavaScript. Features a microservice-based architecture and allows for two-player keyboard-controlled gameplay.",
    ghLink: "https://github.com/Magicherry/King-of-Fighters",
    demoLink: "https://github.com/Magicherry/King-of-Fighters",
    tags: ["HTML", "JavaScript"],
  },
];

const Projects = () => {
  const [viewMode, setViewMode] = useState("list");

  return (
    <Container fluid className="project-section">
      <Particle />
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
                className={`view-switcher__button ${viewMode === "list" ? "view-switcher__button--active" : ""}`}>
              <BsListUl />
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setViewMode("grid")}
              className={`view-switcher__button ${viewMode === "grid" ? "view-switcher__button--active" : ""}`}>
              <BsGridFill />
            </Button>
          </Col>
          {projects.map((project, index) => (
            <Col
              lg={viewMode === "grid" ? 4 : 12}
              md={viewMode === "grid" ? 6 : 12}
              sm={12}
              className="project-card"
              key={index}
            >
              <ProjectCard
                {...project}
                viewMode={viewMode}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default Projects;
