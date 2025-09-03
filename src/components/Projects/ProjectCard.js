import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

const ProjectCard = ({ imgPath, title, description, ghLink, demoLink, tags, viewMode, type }) => {
    if (viewMode === "list") {
        return (
            <Card className="project-card-list-view">
                <div className="project-card-list-view__image-container">
                    <Card.Img src={imgPath} alt="Project preview" className="project-card-list-view__image" />
                </div>
                <div className="project-card-list-view__content">
                    <Card.Title className="project-card-list-view__title">{title}</Card.Title>
                    <div className="project-card-list-view__type-container">
                        <span className={`project-card-list-view__type ${type === 'Company Internal' ? 'company' : 'personal'}`}>
                            {type}
                        </span>
                    </div>
                    <div className="project-card-list-view__tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="project-card-list-view__tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Card.Text className="project-card-list-view__description">{description}</Card.Text>
                    <div className="project-card-list-view__buttons">
                        {ghLink && (<Button variant="primary" href={ghLink} target="_blank">
                            <BsGithub /> &nbsp; GitHub
                        </Button>)}
                        {demoLink && (
                            <Button variant="primary" href={demoLink} target="_blank" className="ms-2">
                                <CgWebsite /> &nbsp; Demo
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="project-card-wrapper">
            <Card className="project-card-grid-view">
                <div className="project-card__image-container">
                    <Card.Img variant="top" src={imgPath} alt="Project preview" className="project-card__image" />
                </div>
                <div className="project-card__overlay">
                    <div className="project-card__type-container">
                        <span className={`project-card__type ${type === 'Company Internal' ? 'company' : 'personal'}`}>
                            {type}
                        </span>
                    </div>
                    <div className="project-card__tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="project-card__tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Card.Text className="project-card__description">{description}</Card.Text>
                    <div className="project-card__buttons">
                        {ghLink && (<Button
                            variant="primary"
                            href={ghLink}
                            target="_blank"
                            className="project-card__button"
                        >
                            <BsGithub /> &nbsp;
                            GitHub
                        </Button>)}
                        {demoLink && (
                            <Button
                                variant="primary"
                                href={demoLink}
                                target="_blank"
                                className="project-card__button"
                            >
                                <CgWebsite /> &nbsp;
                                Demo
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
            <h5 className="project-card__static-title">{title}</h5>
        </div>
    );
};

export default ProjectCard;
