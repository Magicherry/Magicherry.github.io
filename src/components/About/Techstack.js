import React from "react";
import { Col, Row } from "react-bootstrap";

const techStackIcons = [
    // Languages
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/python/python-original.svg" alt="Python" style={{ width: "1em", height: "1em" }} />, name: "Python", link: "https://www.python.org/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/java/java-original.svg" alt="Java" className="tech-icon-java" style={{ width: "1em", height: "1em" }} />, name: "Java", link: "https://www.java.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/javascript/javascript-original.svg" alt="JavaScript" style={{ width: "1em", height: "1em" }} />, name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/go/go-original.svg" alt="Go" style={{ width: "1em", height: "1em" }} />, name: "Go", link: "https://go.dev/" },

    // Frontend
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/react/react-original.svg" alt="React" style={{ width: "1em", height: "1em" }} />, name: "React", link: "https://react.dev/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/nextjs/nextjs-original.svg" alt="Next.js" style={{ width: "1em", height: "1em" }} className="theme-invert" />, name: "Next.js", link: "https://nextjs.org/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/vuejs/vuejs-original.svg" alt="Vue.js" style={{ width: "1em", height: "1em" }} />, name: "Vue.js", link: "https://vuejs.org/" },

    // Backend
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/nodejs/nodejs-original.svg" alt="Node.js" style={{ width: "1em", height: "1em",filter: "brightness(1.2) contrast(1.0)" }} />, name: "Node.js", link: "https://nodejs.org/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/spring/spring-original.svg" alt="Spring Boot" style={{ width: "1em", height: "1em" }} />, name: "Spring Boot", link: "https://spring.io/projects/spring-boot" },
    { icon: <span className="tech-icon-fastapi-brand" aria-hidden="true" />, name: "FastAPI", link: "https://fastapi.tiangolo.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/django/django-plain.svg" alt="Django" style={{ width: "1em", height: "1em", filter: "brightness(3.5) contrast(1.2)" }} />, name: "Django", link: "https://www.djangoproject.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/flask/flask-original.svg" alt="Flask" style={{ width: "1em", height: "1em" }} className="theme-invert" />, name: "Flask", link: "https://flask.palletsprojects.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://raw.githubusercontent.com/gin-gonic/logo/master/color.png" alt="Gin" style={{ width: "1em", height: "1em", objectFit: "contain" }} />, name: "Gin", link: "https://gin-gonic.com/" },

    // Databases
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/mysql/mysql-original.svg" alt="MySQL" style={{ width: "1em", height: "1em", filter: "brightness(1.8) contrast(1.2)" }} />, name: "MySQL", link: "https://www.mysql.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" style={{ width: "1em", height: "1em" }} />, name: "PostgreSQL", link: "https://www.postgresql.org/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/mongodb/mongodb-original.svg" alt="MongoDB" style={{ width: "1em", height: "1em",filter: "brightness(1.2) contrast(1.0)"}} />, name: "MongoDB", link: "https://www.mongodb.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/redis/redis-original.svg" alt="Redis" style={{ width: "1em", height: "1em" }} />, name: "Redis", link: "https://redis.io/" },

    // AI / Data
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.simpleicons.org/langchain" alt="LangChain" style={{ width: "1em", height: "1em" }} />, name: "LangChain", link: "https://www.langchain.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.simpleicons.org/ollama" alt="Ollama" style={{ width: "1em", height: "1em" }} className="theme-invert" />, name: "Ollama", link: "https://ollama.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/pytorch/pytorch-original.svg" alt="PyTorch" style={{ width: "1em", height: "1em" }} />, name: "PyTorch", link: "https://pytorch.org/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow" style={{ width: "1em", height: "1em" }} />, name: "TensorFlow", link: "https://www.tensorflow.org/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/apachespark/apachespark-original.svg" alt="Apache Spark" style={{ width: "1em", height: "1em" }} />, name: "Apache Spark", link: "https://spark.apache.org/" },

    // DevOps
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/docker/docker-original.svg" alt="Docker" style={{ width: "1em", height: "1em", filter: "brightness(1.5) contrast(1.0)"}} />, name: "Docker", link: "https://www.docker.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/kubernetes/kubernetes-original.svg" alt="Kubernetes" style={{ width: "1em", height: "1em" }} />, name: "Kubernetes", link: "https://kubernetes.io/" },
];


function Techstack() {
    return (
        <Row className="tech-stack__row">
            {techStackIcons.map((tech, index) => (
                <Col
                    key={index}
                    xs={4}
                    sm={4}
                    md={3}
                    lg={2}
                    xl={2}
                    className="tech-stack__col"
                >
                    <a
                        className="tech-icons tech-stack__icon-link"
                        href={tech.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={tech.name} // Show skill name on hover
                    >
                        <span className="tech-icons__icon" aria-hidden="true">
                            {tech.icon}
                        </span>
                        <span className="tech-icons__name">{tech.name}</span>
                    </a>
                </Col>
            ))}
        </Row>
    );
}

export default Techstack;
