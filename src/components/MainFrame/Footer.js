import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaLinkedinIn, FaWeixin } from "react-icons/fa";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";

const Footer = () => {
  const year =  new Date().getFullYear();
  const [showWechatModal, setShowWechatModal] = useState(false);

  useEffect(() => {
    if (!showWechatModal) return;
    const handleScroll = () => setShowWechatModal(false);
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchmove", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [showWechatModal]);

  const socialLinks = [
    { href: "https://github.com/Magicherry", icon: <AiFillGithub />, ariaLabel: "GitHub" },
    { href: "https://www.linkedin.com/in/yuting-zhou-5140ba299/", icon: <FaLinkedinIn />, ariaLabel: "LinkedIn" },
    {
      href: "#wechat",
      icon: <FaWeixin />,
      ariaLabel: "WeChat",
      onClick: e => {
        e.preventDefault();
        setShowWechatModal(true);
      }
    },
    { href: "https://space.bilibili.com/155876727", icon: <SiBilibili />, ariaLabel: "Bilibili" }
  ];

  return (
      <Container fluid className="footer">
        <Row className="align-items-center justify-content-center">
          <Col md={4} className="footer-copywright d-flex align-items-center justify-content-center">
            <a href="mailto:zyt680129@gmail.com" className="email-link">
              <h3>Email: zyt680129@gmail.com</h3>
            </a>
          </Col>
          <Col md={4} className="footer-copywright d-flex align-items-center justify-content-center">
            <h3>Copyright © Yuting Zhou {year}</h3>
          </Col>
          <Col md={4} className="footer-body d-flex align-items-center justify-content-center">
            <ul className="footer-icons">
              {socialLinks.map((link, idx) => (
                  <li className="social-icons" key={idx}>
                    <a
                        href={link.href}
                        className="footer__social-link"
                        target={link.onClick ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={link.ariaLabel}
                        onClick={link.onClick}
                    >
                      {link.icon}
                    </a>
                  </li>
              ))}
            </ul>
          </Col>
        </Row>
        <Modal show={showWechatModal} onHide={() => setShowWechatModal(false)} centered>
          <Modal.Body
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => setShowWechatModal(false)}
          >
            <img src={wechatQrCode} alt="WeChat QR Code" style={{ maxWidth: "100%" }} />
          </Modal.Body>
        </Modal>
      </Container>
  );
};

export default Footer;
