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
  { icon: <CgCPlusPlus />, name: "C++", link: "https://isocpp.org/" },
  { icon: <DiJava />, name: "Java", link: "https://www.java.com/" },
  { icon: <DiJavascript1 />, name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { icon: <DiPython />, name: "Python", link: "https://www.python.org/" },
  { icon: <DiNodejs />, name: "Node.js", link: "https://nodejs.org/" },
  { icon: <DiReact />, name: "React", link: "https://react.dev/" },
  { icon: <IoLogoVue />, name: "Vue.js", link: "https://vuejs.org/" },
  { icon: <SiSpringboot />, name: "Spring Boot", link: "https://spring.io/projects/spring-boot" },
  { icon: <DiMongodb />, name: "MongoDB", link: "https://www.mongodb.com/" },
  { icon: <SiNextdotjs />, name: "Next.js", link: "https://nextjs.org/" },
  { icon: <DiGit />, name: "Git", link: "https://git-scm.com/" },
  { icon: <SiRedis />, name: "Redis", link: "https://redis.io/" },
];

function Techstack() {
  return (
      <Row className="tech-stack__row">
        {techStackIcons.map((tech, index) => (
            <Col key={index} xs={4} md={2} className="tech-stack__col">
              <a
                  className="tech-icons tech-stack__icon-link"
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={tech.name} // 悬停显示技能名称
              >
                {tech.icon}
              </a>
            </Col>
        ))}
      </Row>
  );
}

export default Techstack;
