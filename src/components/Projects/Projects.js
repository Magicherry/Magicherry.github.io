import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";

// 项目数据
const projects = [
  {
    imgPath: require("../../Assets/Projects/AYE.png"),
    title: "AyeNote Online Cloud Notes",
    description: "Designed web crawler and data mining functions, built the front-end with Vue3, and developed back-end management system using Django. Utilized Python libraries for user data mining.",
    ghLink: "https://github.com/Magicherry/AyeNote",
    demoLink: "https://github.com/Magicherry/AyeNote",
  },
  {
    imgPath: require("../../Assets/Projects/KOB.png"),
    title: "King of Bots",
    description: "Separation of Front-end and Back-end; used SpringBoot to implement the back-end, used MySQL to achieve database management, built webpack using Vue3, deployed interface elements in Bootstrap4, interacted jQuery's Ajax with back-end data",
    ghLink: "https://github.com/Magicherry/King-of-Bots",
    demoLink: "https://github.com/Magicherry/King-of-Bots",
  },
  {
    imgPath: require("../../Assets/Projects/Movenet.png"),
    title: "Real-time Pose Estimation",
    description: "Utilized the Google Movenet model to detect skeletal points of the human body in the video and extract key information. Displayed real-time scores and best scores based on the movement accuracy evaluation result.",
    ghLink: "https://git.acwing.com/Magicherry/pose_estimation",
    demoLink: "https://git.acwing.com/Magicherry/pose_estimation",
  },
  {
    imgPath: require("../../Assets/Projects/Book.png"),
    title: "Management Web System",
    description: "Separation of Front-end and Back-end; used SpringBoot to implement the back-end, used MyBatis and MySQL to achieve database management, interacted with the front-end through the controller, used MD5 algorithm to encrypt database with salt.",
    ghLink: "https://github.com/Magicherry/Library_management",
    demoLink: "https://github.com/Magicherry/Library_management",
  },
  {
    imgPath: require("../../Assets/Projects/Cider.png"),
    title: "MusicApp UX Design",
    description: "Designed third-party streaming music application UX interface inspired by Apple Music using Axure RP 9.",
    ghLink: "https://github.com/Magicherry/Music-App-Ui-Design",
    demoLink: "https://github.com/Magicherry/Music-App-Ui-Design", // Add demo link if available
  },
  {
    imgPath: require("../../Assets/Projects/KOF.png"),
    title: "King of Fighters",
    description: "Front-end HTML; built webpack using Vue3; implemented logic control with JavaScript, stored control information, enabling both players to use the keyboard to control their character duels (running system Microservice).",
    ghLink: "https://git.acwing.com/Magicherry/kof",
    demoLink: "https://git.acwing.com/Magicherry/kof",
  },
];

const Projects = () => (
  <Container fluid className="project-section">
    <Particle />
    <Container>
      <h1 className="project-heading">
        My Recent <strong className="blue">Works</strong>
      </h1>
      <p style={{ color: "white", fontSize: "1.5rem" }}>
        My works make use of a vast variety of the latest technology tools.
      </p>
      <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
        {projects.map((project, index) => (
          <Col md={4} className="project-card" key={index}>
            <ProjectCard
              imgPath={project.imgPath}
              isBlog={false}
              title={project.title}
              description={project.description}
              ghLink={project.ghLink}
              demoLink={project.demoLink}
            />
          </Col>
        ))}
      </Row>
    </Container>
  </Container>
);

export default Projects;
