import React from "react";
import { Container } from "react-bootstrap";

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { timelines } from "./ExperienceData";
import { useLanguage } from "../../context/LanguageContext";

function ExperienceTimeline({ title, subtitle, data, icon: Icon }) {
    const { locale } = useLanguage();
    return (
        <>
            <h1 className="project-heading">
                {locale === "zh"
                    ? <>我的 <strong className="text-accent">{title[locale]} </strong>经历</>
                    : <>My <strong className="text-accent">{title[locale]} </strong> Experiences</>}
            </h1>
            <p className="section-intro-text">{subtitle[locale]}</p>
            <VerticalTimeline>
                {data.map((experience, index) => (
                    <VerticalTimelineElement
                        key={index}
                        className="vertical-timeline-element--work"
                        date={experience.duration}
                        iconStyle={{ background: 'var(--button-bg-primary)', color: '#fff' }}
                        icon={experience.icon ? <experience.icon /> : <Icon />}
                    >
                        <h3 className="vertical-timeline-element-title">{experience.title[locale]}</h3>
                        <h5 className="vertical-timeline-element-subtitle">{experience.company[locale]}</h5>
                        <ul className="experience-description">
                            {experience.description[locale].map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </>
    );
}

function Experiences() {
    return (
        <Container fluid className="experience-section">
            
            <Container>
                {timelines.map((props, idx) => (
                    <ExperienceTimeline key={idx} {...props} />
                ))}
            </Container>
        </Container>
    );
}

export default Experiences;
