import React from "react";
import { BsGithub } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

/* Beyond this the tag strip wraps onto a third line and the row loses its
   scannable, uniform height. The remainder collapses into a "+N" chip. */
const MAX_VISIBLE_TAGS = 4;

const ProjectRow = ({ imgPath, title, description, ghLink, tags, type, date }) => {
    const { locale } = useLanguage();
    const localizedTitle = typeof title === "string" ? title : title[locale];
    const localizedDescription = typeof description === "string" ? description : description[locale];
    const localizedType = typeof type === "string" ? type : type[locale];
    const isCompany = localizedType === "Company Internal" || localizedType === "企业内部项目";
    const copy = locale === "zh"
        ? { github: "GitHub", private: "私有", privateFull: "私有仓库" }
        : { github: "GitHub", private: "Private", privateFull: "Private repository" };

    const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
    const hiddenTagCount = tags.length - visibleTags.length;

    return (
        <article className="project-row">
            <img
                className="project-row__icon"
                src={imgPath}
                alt=""
                loading="lazy"
                decoding="async"
            />

            <div className="project-row__head">
                <h3 className="project-row__title">{localizedTitle}</h3>
                <p className="project-row__meta">
                    <span className={`project-row__type ${isCompany ? "company" : "personal"}`}>
                        {localizedType}
                    </span>
                    <span className="project-row__date">{date}</span>
                </p>
            </div>

            <div className="project-row__action">
                {ghLink ? (
                    <a
                        className="project-row__get"
                        href={ghLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${copy.github} - ${localizedTitle}`}
                    >
                        <BsGithub aria-hidden="true" />
                        <span>{copy.github}</span>
                    </a>
                ) : (
                    <span className="project-row__get project-row__get--locked" title={copy.privateFull}>
                        <FaLock aria-hidden="true" />
                        <span>{copy.private}</span>
                    </span>
                )}
            </div>

            <p className="project-row__description">{localizedDescription}</p>

            <ul className="project-row__tags">
                {visibleTags.map((tag) => (
                    <li key={tag} className="project-row__tag">{tag}</li>
                ))}
                {hiddenTagCount > 0 && (
                    <li className="project-row__tag project-row__tag--more">+{hiddenTagCount}</li>
                )}
            </ul>
        </article>
    );
};

export default React.memo(ProjectRow);
