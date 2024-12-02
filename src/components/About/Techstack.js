import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiJava,
} from "react-icons/di";
import { IoLogoVue } from "react-icons/io5";
import { SiSpringboot, SiRedis, SiNextdotjs } from "react-icons/si";
import { CgCPlusPlus } from "react-icons/cg"; // 正确的导入路径

const techStackIcons = [
  { icon: <CgCPlusPlus />, name: "C++" },
  { icon: <DiJava />, name: "Java" },
  { icon: <DiJavascript1 />, name: "JavaScript" },
  { icon: <DiPython />, name: "Python" },
  { icon: <DiNodejs />, name: "Node.js" },
  { icon: <DiReact />, name: "React" },
  { icon: <IoLogoVue />, name: "Vue.js" },
  { icon: <SiSpringboot />, name: "Spring Boot" },
  { icon: <DiMongodb />, name: "MongoDB" },
  { icon: <SiNextdotjs />, name: "Next.js" },
  { icon: <DiGit />, name: "Git" },
  { icon: <SiRedis />, name: "Redis" },
];

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {techStackIcons.map((tech, index) => (
        <Col key={index} xs={4} md={2} className="tech-icons">
          {tech.icon}
        </Col>
      ))}
    </Row>
  );
}

export default Techstack;
