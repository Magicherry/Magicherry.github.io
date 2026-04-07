import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsGithub, BsArrowRight } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

const ProjectCard = ({ imgPath, title, description, ghLink, demoLink, tags, viewMode, type, date }) => {
    const { locale } = useLanguage();
    const localizedTitle = typeof title === "string" ? title : title[locale];
    const localizedDescription = typeof description === "string" ? description : description[locale];
    const localizedType = typeof type === "string" ? type : type[locale];
    const isCompany = localizedType === "Company Internal" || localizedType === "企业内部项目";
    const copy = locale === "zh"
        ? {
            github: "GitHub",
            privateRepository: "私有仓库",
            privateRepoShort: "私有仓库"
        }
        : {
            github: "GitHub",
            privateRepository: "Private Repository",
            privateRepoShort: "Private Repo"
        };

    if (viewMode === "list") {
        return (
            <Card className="project-card-list-view">
                <div className="project-card-list-view__image-container">
                    <Card.Img src={imgPath} alt="Project preview" className="project-card-list-view__image" />
                </div>
                <div className="project-card-list-view__content">
                    <Card.Title className="project-card-list-view__title">{localizedTitle}</Card.Title>
                    <div className="project-card-list-view__tags">
                        <span className={`project-card-list-view__type ${isCompany ? 'company' : 'personal'}`}>
                            {localizedType}
                        </span>
                        {tags.map((tag, index) => (
                            <span key={index} className="project-card-list-view__tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Card.Text className="project-card-list-view__description">{localizedDescription}</Card.Text>
                    <div className="project-card-list-view__buttons">
                        {ghLink ? (
                            <Button variant="light" href={ghLink} target="_blank" className="github-pill-btn-project">
                                <BsGithub /> &nbsp; {copy.github} &nbsp; <BsArrowRight />
                            </Button>
                        ) : (
                            <Button variant="light" disabled className="github-pill-btn-project">
                                <FaLock /> &nbsp; {copy.privateRepository}
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
                        <span className={`project-card__type ${isCompany ? 'company' : 'personal'}`}>
                            {localizedType}
                        </span>
                    </div>
                    <div className="project-card__tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="project-card__tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Card.Text className="project-card__description">{localizedDescription}</Card.Text>
                    <div className="project-card__buttons">
                        {ghLink ? (
                            <Button
                                variant="light"
                                href={ghLink}
                                target="_blank"
                                className="project-card__button github-pill-btn-project"
                            >
                                <BsGithub /> &nbsp;
                                {copy.github} &nbsp; <BsArrowRight />
                            </Button>
                        ) : (
                            <Button
                                variant="light"
                                disabled
                                className="project-card__button github-pill-btn-project"
                            >
                                <FaLock /> &nbsp;
                                {copy.privateRepoShort}
                            </Button>
                        )}
                    </div>
                </div>
                {date && <span className="project-card__date project-card__date--grid">{date}</span>}
            </Card>
            <h5 className="project-card__static-title">{localizedTitle}</h5>
        </div>
    );
};

export default ProjectCard;
