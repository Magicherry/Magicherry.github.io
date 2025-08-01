import React from "react";
import { Container, Row, Col, OverlayTrigger, Popover } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaLinkedinIn, FaWeixin } from "react-icons/fa";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com/Magicherry", icon: <AiFillGithub />, ariaLabel: "GitHub" },
    { href: "https://www.linkedin.com/in/yuting-zhou-5140ba299/", icon: <FaLinkedinIn />, ariaLabel: "LinkedIn" },
    { href: "#wechat", icon: <FaWeixin />, ariaLabel: "WeChat" },
    { href: "https://space.bilibili.com/155876727", icon: <SiBilibili />, ariaLabel: "Bilibili" },
  ];

  const wechatPopover = (
    <Popover id="popover-wechat-footer" className="wechat-popover">
      <Popover.Body>
        <img src={wechatQrCode} alt="WeChat QR Code" style={{ width: '150px' }} />
      </Popover.Body>
    </Popover>
  );

  return (
    <Container fluid className="footer">
      <Row>
        <Col md={4} className="footer-copywright">
          <a href="mailto:zyt680129@gmail.com" className="email-link">
            <h3>Email: zyt680129@gmail.com</h3>
          </a>
        </Col>
        <Col md={4} className="footer-copywright">
          <h3>Copyright © Yuting Zhou {year} </h3>
        </Col>
        <Col md={4} className="footer-body">
          <ul className="footer-icons">
            {socialLinks.map((link, index) => (
              <li className="social-icons" key={index}>
                {link.ariaLabel === "WeChat" ? (
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    placement="top"
                    overlay={wechatPopover}
                  >
                    <a
                      href={link.href}
                      className="footer__social-link"
                      aria-label={link.ariaLabel}
                      onClick={(e) => e.preventDefault()}
                    >
                      {link.icon}
                    </a>
                  </OverlayTrigger>
                ) : (
                  <a
                    href={link.href}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                  >
                    {link.icon}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
