import React from "react";
import { Container } from "react-bootstrap";

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { timelines } from "./ExperienceData";

function ExperienceTimeline({ title, subtitle, data, icon: Icon }) {
    return (
        <>
            <h1 className="project-heading">
                My <strong className="blue">{title} </strong> Experiences
            </h1>
            <p style={{ color: "white" }}>{subtitle}</p>
            <VerticalTimeline>
                {data.map((experience, index) => (
                    <VerticalTimelineElement
                        key={index}
                        className="vertical-timeline-element--work"
                        date={experience.duration}
                        iconStyle={{ background: 'var(--button-bg-primary)', color: '#fff' }}
                        icon={<Icon />}
                    >
                        <h3 className="vertical-timeline-element-title">{experience.title}</h3>
                        <h4 className="vertical-timeline-element-subtitle">{experience.department}</h4>
                        <h5 className="vertical-timeline-element-subtitle">{experience.company}</h5>
                        <ul className="experience-description">
                            {experience.description.map((item, i) => (
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
