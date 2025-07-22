import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

const activities = [
  "Writing Tech Blogs",
  "Experiencing Games",
  "Browsing Tech | Movie & TV Reviews",
  "Photography & Videography"
];

const AboutCard = () => {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p className="about-card__paragraph">
            - Hello Guys, I am <span className="blue" >Yuting Zhou</span> from{" "}
            <span className="blue">Shanghai, China.</span>
            <br />
            - I am currently pursuing a Master’s degree in Computer Science at
            Rutgers University–New Brunswick, NJ, US.
            <br />
            - I am actively seeking research opportunities and internships to
            enhance my skills and gain hands-on experience.
            <br />
            <br />
            Apart from coding, here are some activities I love:
          </p>
          <ul>
            {activities.map((activity, index) => (
              <li className="about-activity" key={index}>
                <ImPointRight /> {activity}
              </li>
            ))}
          </ul>

          <p className="blue about-card__quote">
            <em>"No matter what your dream is, you have to dedicate yourself entirely to it"</em>
          </p>
          <footer className="blockquote-footer">AYRTON SENNA</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
};

export default AboutCard;
