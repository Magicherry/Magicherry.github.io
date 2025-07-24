import React from "react";
import { Container } from "react-bootstrap";
import Particle from "../MainFrame/Particle";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import "./Experiences.css";
import { researchExperience, internshipExperience } from "./ExperienceData";
import { FaBriefcase, FaFlask } from 'react-icons/fa';

function Experiences() {
  return (
      <Container fluid className="experience-section">
        <Particle />
        <Container>
          <h1 className="project-heading">
            My <strong className="blue">Research </strong> Experiences
          </h1>
          <p style={{ color: "white" }}>
            Here are a few research projects I've worked on.
          </p>
          <VerticalTimeline>
            {researchExperience.map((experience, index) => (
                <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element--work"
                    date={experience.duration}
                    iconStyle={{ background: 'var(--button-bg-primary)', color: '#fff' }}
                    icon={<FaFlask />}
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

          <h1 className="project-heading">
            My <strong className="blue">Internship </strong> Experiences
          </h1>
          <p style={{ color: "white" }}>
            Here are a few internships I've had.
          </p>
          <VerticalTimeline>
            {internshipExperience.map((experience, index) => (
                <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element--work"
                    date={experience.duration}
                    iconStyle={{ background: 'var(--button-bg-primary)', color: '#fff' }}
                    icon={<FaBriefcase />}
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
        </Container>
      </Container>
  );
}

export default Experiences;
