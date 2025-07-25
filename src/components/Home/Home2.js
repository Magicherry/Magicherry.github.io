import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar/avatar.png";
import Tilt from "react-parallax-tilt";
import { AiFillGithub } from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter} from "react-icons/fa6";

function Home2() {
  const socialLinks = [
    {
      href: "https://github.com/Magicherry",
      icon: <AiFillGithub />,
      ariaLabel: "GitHub Profile",
    },
    {
      href: "https://x.com/Magicherrys",
      icon: <FaXTwitter/>,
      ariaLabel: "Twitter Profile",
    },
    {
      href: "https://www.linkedin.com/in/yuting-zhou-5140ba299/",
      icon: <FaLinkedinIn />,
      ariaLabel: "LinkedIn Profile",
    },
    {
      href: "https://space.bilibili.com/155876727",
      icon: <SiBilibili />,
      ariaLabel: "Bilibili Profile",
    },
  ];

  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 className="home-about__title">
              LET ME <span className="blue"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I fell in love with programming and have been exploring it ever since.
              🤷‍♂️
              <br />
              <br />I am fluent in classics like
              <i>
                <b className="blue"> C++, Java, and Python. </b>
              </i>
              <br />
              <br />
              My expertise includes{" "}
              <b className="blue">
                front-end technologies
              </b>{" "}
              like{" "}
              <i>
                <b className="blue">
                  HTML, CSS, JavaScript, Vue.js, React.js
                </b>
              </i>
              , and also in areas related to{" "}
              <b className="blue">
                back-end frameworks
              </b>{" "}
              such as{" "}
              <i>
                <b className="blue">
                  Spring, SpringBoot, and SpringCloud Microservices.
                </b>
              </i>
              <br />
              <br />
              Whenever possible, I strive to channel my passion into creating
              innovative and impactful products!
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="blue">connect </span>with me
            </p>
            {/* 动态渲染社交链接 */}
            <ul className="home-about-social-links">
              {socialLinks.map((link, index) => (
                <li className="social-icons" key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-colour home-social-icons"
                    aria-label={link.ariaLabel}
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;
