import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { AiFillGithub } from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaLinkedinIn, FaWeixin } from "react-icons/fa";
import myImg from "../../Assets/avatar/avatar.png";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";

function Home2() {
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
    {
      href: "https://github.com/Magicherry",
      icon: <AiFillGithub />,
      ariaLabel: "GitHub Profile",
    },
    {
      href: "https://www.linkedin.com/in/yuting-zhou-5140ba299/",
      icon: <FaLinkedinIn />,
      ariaLabel: "LinkedIn Profile",
    },
    {
      href: "#wechat",
      icon: <FaWeixin />,
      ariaLabel: "WeChat Profile",
      onClick: e => {
        e.preventDefault();
        setShowWechatModal(true);
      },
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
                LET ME <span className="blue">INTRODUCE</span> MYSELF
              </h1>
              <p className="home-about-body">
                I fell in love with programming and have been exploring it ever since. 🤷‍♂️
                <br /><br />
                I am fluent in classics <b className="blue">C++, Java, and Python.</b>
                <br /><br />
                My expertise includes <b className="blue">front-end technologies</b> <b className="blue">HTML, CSS, JavaScript, Vue.js, React.js</b>,
                and also in <b className="blue">back-end frameworks</b> <b className="blue">Spring, SpringBoot, and SpringCloud Microservices.</b>
                <br /><br />
                Whenever possible, I strive to channel my passion into creating innovative and impactful products!
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
                Feel free to <span className="blue">connect</span> with me
              </p>
              <ul className="home-about-social-links">
                {socialLinks.map((link, idx) => (
                    <li className="social-icons" key={idx}>
                      <a
                          href={link.href}
                          target={link.onClick ? "_self" : "_blank"}
                          rel="noopener noreferrer"
                          className="icon-colour home-social-icons"
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
        </Container>
        <Modal show={showWechatModal} onHide={() => setShowWechatModal(false)} centered>
          <Modal.Body style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setShowWechatModal(false)}>
            <img src={wechatQrCode} alt="WeChat QR Code" style={{ maxWidth: "100%" }} />
          </Modal.Body>
        </Modal>
      </Container>
  );
}

export default Home2;
