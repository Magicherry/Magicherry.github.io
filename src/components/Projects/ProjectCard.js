import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsGithub, BsArrowRight } from "react-icons/bs";
import { FaLock } from "react-icons/fa";

const ProjectCard = ({ imgPath, title, description, ghLink, demoLink, tags, viewMode, type, date }) => {
    if (viewMode === "list") {
        return (
            <Card className="project-card-list-view">
                <div className="project-card-list-view__image-container">
                    <Card.Img src={imgPath} alt="Project preview" className="project-card-list-view__image" />
                </div>
                <div className="project-card-list-view__content">
                    <Card.Title className="project-card-list-view__title">{title}</Card.Title>
                    <div className="project-card-list-view__tags">
                        <span className={`project-card-list-view__type ${type === 'Company Internal' ? 'company' : 'personal'}`}>
                            {type}
                        </span>
                        {tags.map((tag, index) => (
                            <span key={index} className="project-card-list-view__tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Card.Text className="project-card-list-view__description">{description}</Card.Text>
                    <div className="project-card-list-view__buttons">
                        {ghLink ? (
                            <Button variant="light" href={ghLink} target="_blank" className="github-pill-btn-project">
                                <BsGithub /> &nbsp; GitHub &nbsp; <BsArrowRight />
                            </Button>
                        ) : (
                            <Button variant="light" disabled className="github-pill-btn-project" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                <FaLock /> &nbsp; Private Repository
                            </Button>
                        )}
                    </div>
                </div>
                {date && <span className="project-card__date project-card__date--list">{date}</span>}
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
                        {ghLink ? (
                            <Button
                                variant="light"
                                href={ghLink}
                                target="_blank"
                                className="project-card__button github-pill-btn-project"
                            >
                                <BsGithub /> &nbsp;
                                GitHub &nbsp; <BsArrowRight />
                            </Button>
                        ) : (
                            <Button
                                variant="light"
                                disabled
                                className="project-card__button github-pill-btn-project"
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            >
                                <FaLock /> &nbsp;
                                Private Repo
                            </Button>
                        )}
                    </div>
                </div>
                {date && <span className="project-card__date project-card__date--grid">{date}</span>}
            </Card>
            <h5 className="project-card__static-title">{title}</h5>
        </div>
    );
};

export default ProjectCard;
