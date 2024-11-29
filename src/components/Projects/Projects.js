import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import KOF from "../../Assets/Projects/KOF.png";
import AYE from "../../Assets/Projects/AYE.png";
import Movenet from "../../Assets/Projects/Movenet.png";
import Management from "../../Assets/Projects/Management.png";
import Cider from "../../Assets/Projects/Cider.png";
import KOB from "../../Assets/Projects/KOB.png"

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="blue">Works </strong>
        </h1>
        <p style={{ color: "white", fontSize: "1.5rem" }}>
          My works make use of a vast variety of the latest technology tools.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={AYE}
              isBlog={false}
              title="AyeNote Online Cloud Notes"
              description="Designed web crawler and data mining functions, built the front-end with Vue3, and developed back-end management system using Django. Utilized Python libraries for user data mining."
              ghLink="https://github.com/Magicherry/AyeNote"
              demoLink="https://github.com/Magicherry/AyeNote"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={KOB}
              isBlog={false}
              title="King of Bots"
              description=" Separation of Front-end and Back-end; used SpringBoot to implement the back-end, used MySQL to achieve database management, built webpack using Vue3, deployed interface elements in Bootstrap4, interacted jQuery's Ajax with back-end data"
              ghLink="https://github.com/Magicherry/King-of-Bots"
              demoLink="https://github.com/Magicherry/King-of-Bots"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Movenet}
              isBlog={false}
              title="Real-time Pose Estimation"
              description="Utilized the Google Movenet model to detect skeletal points of the human body in the video and extract key information. Displayed real-time scores and best scores based on the movement accuracy evaluation result."
              ghLink="https://git.acwing.com/Magicherry/pose_estimation"
              demoLink="https://git.acwing.com/Magicherry/pose_estimation"              
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Management}
              isBlog={false}
              title="Management Web System"
              description="Separation of Front-end and Back-end; used SpringBoot to implement the back-end, used MyBatis and MySQL to achieve database management, interactedwith the front-end through the controller, used MD5 algorithm to encrypt database with salt."
              ghLink="https://github.com/Magicherry/Library_management"
              demoLink="https://github.com/Magicherry/Library_management"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Cider}
              isBlog={false}
              title="MusicApp UX Design"
              description="Designed third-party streaming music application UX interface inspired by Apple Music using Axure RP 9."
              ghLink="https://github.com/Magicherry/Music-App-Ui-Design"
              // demoLink="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" <--------Please include a demo link here
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={KOF}
              isBlog={false}
              title="King of Fighters (Local Game Design)"
              description="Front-end HTML; built webpack using Vue3; implemented logic control with JavaScript, stored control information, enabling both players to use the keyboard to control their character duels (running system Microservice)."
              ghLink="https://git.acwing.com/Magicherry/kof"
              demoLink="https://git.acwing.com/Magicherry/kof"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
