import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com/Magicherry", icon: <AiFillGithub /> },
    { href: "https://x.com/Magicherrys", icon: <FaXTwitter /> },
    { href: "https://www.linkedin.com/in/yuting-zhou-5140ba299/", icon: <FaLinkedinIn /> },
    { href: "https://space.bilibili.com/155876727", icon: <SiBilibili /> },
  ];

  return (
    <Container fluid className="footer">
      <Row>
        <Col md={4} className="footer-copywright">
          <a href="mailto:zyt680129@gmail.com" className="email-link">
            <h3>Email: zyt680129@gmail.com</h3>
          </a>
        </Col>
        <Col md={4} className="footer-copywright">
          <h3>Copyright © {year} Yuting Zhou</h3>
        </Col>
        <Col md={4} className="footer-body">
          <ul className="footer-icons">
            {socialLinks.map((link, index) => (
              <li className="social-icons" key={index}>
                <a
                  href={link.href}
                  style={{ color: "white" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
