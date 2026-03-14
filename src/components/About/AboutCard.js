import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

const activities = [
  "Reading tech blogs",
  "Playing games",
  "Watching movies & TV",
  "Photography & videography"
];

const AboutCard = () => {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <ul className="about-card__highlights">
            <li className="about-card__highlight">
              Hello, I am <span className="text-accent">Yuting Zhou</span>, a Computer Science master’s student at{" "}
              <span className="text-accent">Rutgers University</span>.
            </li>
            <li className="about-card__highlight">
              I currently work as a Research Assistant at the <span className="text-accent">CAIT Lab</span>, focusing on{" "}
              <span className="text-accent">rail incident modeling</span>, <span className="text-accent">large-scale data engineering</span>, and{" "}
              <span className="text-accent">NLP/LLM-based automation</span> for transportation systems.
            </li>
            <li className="about-card__highlight">
              I am actively seeking <span className="text-accent">Software Engineering</span> opportunities starting{" "}
              <span className="text-accent">Summer 2026</span>, with interests in <span className="text-accent">ML systems</span>,{" "}
              <span className="text-accent">Frontend &amp; Backend Engineering</span>, and <span className="text-accent">data-driven products</span>.
            </li>
            <li className="about-card__highlight">
              Apart from coding, here are some activities I enjoy:
            </li>
          </ul>
          <ul>
            {activities.map((activity, index) => (
              <li className="about-activity" key={index}>
                <ImPointRight /> {activity}
              </li>
            ))}
          </ul>

          <p className="text-accent about-card__quote">
            <em>"No matter what your dream is, you have to dedicate yourself entirely to it."</em>
          </p>
          <footer className="blockquote-footer">AYRTON SENNA</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
};

export default AboutCard;
