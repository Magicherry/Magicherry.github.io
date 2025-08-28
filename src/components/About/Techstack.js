import React from "react";
import { Col, Row } from "react-bootstrap";
import FadeInOnScroll from "../MainFrame/FadeInOnScroll";
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
import {
    SiSpringboot,
    SiRedis,
    SiNextdotjs,
    SiGo,
    SiMysql,
    SiDocker,
    SiKubernetes,
    SiTensorflow,
    SiPytorch
} from "react-icons/si";
import { FaGlassMartiniAlt } from "react-icons/fa"; // Gin 占位图标
import { CgCPlusPlus } from "react-icons/cg";

const techStackIcons = [
    // Languages & Backend
    { icon: <CgCPlusPlus />, name: "C++", link: "https://isocpp.org/" },
    { icon: <DiJava />, name: "Java", link: "https://www.java.com/" },
    { icon: <SiSpringboot />, name: "Spring Boot", link: "https://spring.io/projects/spring-boot" },
    { icon: <SiGo />, name: "Go", link: "https://go.dev/" },
    { icon: <FaGlassMartiniAlt />, name: "Gin", link: "https://gin-gonic.com/" },
    { icon: <DiJavascript1 />, name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { icon: <DiPython />, name: "Python", link: "https://www.python.org/" },
    { icon: <DiNodejs />, name: "Node.js", link: "https://nodejs.org/" },

    // Frontend
    { icon: <DiReact />, name: "React", link: "https://react.dev/" },
    { icon: <IoLogoVue />, name: "Vue.js", link: "https://vuejs.org/" },
    { icon: <SiNextdotjs />, name: "Next.js", link: "https://nextjs.org/" },

    // Databases
    { icon: <SiMysql />, name: "MySQL", link: "https://www.mysql.com/" },
    { icon: <DiMongodb />, name: "MongoDB", link: "https://www.mongodb.com/" },
    { icon: <SiRedis />, name: "Redis", link: "https://redis.io/" },

    // DevOps / Tools
    { icon: <SiDocker />, name: "Docker", link: "https://www.docker.com/" },
    { icon: <SiKubernetes />, name: "Kubernetes", link: "https://kubernetes.io/" },

    // AI / ML
    { icon: <SiPytorch />, name: "PyTorch", link: "https://pytorch.org/" },
    { icon: <SiTensorflow />, name: "TensorFlow", link: "https://www.tensorflow.org/" },
];


function Techstack() {
    return (
        <FadeInOnScroll>
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
        </FadeInOnScroll>
    );
}

export default Techstack;
