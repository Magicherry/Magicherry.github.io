import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hello Guys, I am <span className="blue">Yuting Zhou</span> from{" "}
            <span className="blue">Shanghai, China.</span>
            <br />
            I am currently pursuing a Master’s degree in Computer Science at Rutgers University–New Brunswick, NJ, US.
            <br />
            I am actively seeking research opportunities and internships to enhance my skills and gain hands-on experience.
            <br />
            <br />
            Apart from coding, here are some activities I love:
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Writing Tech Blogs
            </li>
            <li className="about-activity">
              <ImPointRight /> Evaluating Digital Products
            </li>
          </ul>

          <p style={{ color: "rgb(3, 232, 248)" }}>
            "Strive to build things that make a difference!"
          </p>
          <footer className="blockquote-footer">Yuting Zhou</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
