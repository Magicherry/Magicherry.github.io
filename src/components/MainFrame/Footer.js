import React, { useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaLinkedinIn, FaWeixin, FaEnvelope } from "react-icons/fa";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";
import { useLanguage } from "../../context/LanguageContext";
import { useCloseOnWindowScroll } from "../../hooks/useCloseOnWindowScroll";

const Footer = () => {
  const year =  new Date().getFullYear();
  const [showWechatModal, setShowWechatModal] = useState(false);
  const { locale } = useLanguage();
  const copy = locale === "zh"
    ? {
      copyright: `版权所有 © 周昱廷 ${year}`,
      wechatQrAlt: "微信二维码",
      email: "zyt680129@163.com"
    }
    : {
      copyright: `Copyright © Yuting Zhou ${year}`,
      wechatQrAlt: "WeChat QR Code",
      email: "zyt680129@gmail.com"
    };

  useCloseOnWindowScroll(showWechatModal, () => setShowWechatModal(false));

  const socialLinks = [
    { href: "https://github.com/Magicherry", icon: <AiFillGithub />, ariaLabel: "GitHub" },
    { href: "https://www.linkedin.com/in/yuting-zhou-magicherry/", icon: <FaLinkedinIn />, ariaLabel: "LinkedIn" },
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
          <Col md={4} className="footer-copyright d-flex align-items-center justify-content-center">
            <a href={`mailto:${copy.email}`} className="email-link footer-email">
              <FaEnvelope className="footer-email__icon" aria-hidden="true" />
              <span className="footer-email__text">{copy.email}</span>
            </a>
          </Col>
          <Col md={4} className="footer-copyright d-flex align-items-center justify-content-center">
            <h3>{copy.copyright}</h3>
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
              className="modal-body-center"
              onClick={() => setShowWechatModal(false)}
          >
            <img
              src={wechatQrCode}
              alt={copy.wechatQrAlt}
              className="img-max-full"
              loading="lazy"
              decoding="async"
            />
          </Modal.Body>
        </Modal>
      </Container>
  );
};

export default React.memo(Footer);
