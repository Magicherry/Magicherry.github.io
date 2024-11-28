import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter,
} from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <a
            href="mailto:zyt680129@gmail.com"
            className="email-link"
          >
            <h3>Email: zyt680129@gmail.com</h3>
          </a>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>Copyright © {year} Yuting Zhou</h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">
              <a
                href="https://github.com/Magicherry"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://x.com/Magicherrys"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaXTwitter />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://www.linkedin.com/in/yuting-zhou-5140ba299/"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://space.bilibili.com/155876727"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <SiBilibili />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
