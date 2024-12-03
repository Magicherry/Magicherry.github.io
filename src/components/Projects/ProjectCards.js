import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

const ProjectCards = ({ imgPath, title, description, ghLink, demoLink, isBlog }) => {
    return (
        <Card className="project-card-view">
            <Card.Img variant="top" src={imgPath} alt="Project preview" />
            <Card.Body className="card-body">
                <Card.Title>{title}</Card.Title>
                <Card.Text className="card-description">{description}</Card.Text>
                <div className="project-button-group">
                    <Button
                        variant="primary"
                        href={ghLink}
                        target="_blank"
                        className="custom-button"
                    >
                        <BsGithub className="button-icon" />
                        GitHub
                    </Button>
                    {demoLink && !isBlog && (
                        <Button
                            variant="primary"
                            href={demoLink}
                            target="_blank"
                            className="custom-button"
                        >
                            <CgWebsite className="button-icon" />
                            Demo
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProjectCards;
