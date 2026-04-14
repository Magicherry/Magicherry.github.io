import React, { useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiOutlineDownload } from "react-icons/ai";
import { SiBilibili } from "react-icons/si";
import { FaLinkedinIn, FaWeixin } from "react-icons/fa";
import myImg from "../../Assets/avatar/avatar.png";
import wechatQrCode from "../../Assets/about/social/Wechat.jpg";
import cvFile from "../../Assets/cv/Yuting_Zhou_CV.pdf";
import cvFileZh from "../../Assets/cv/Yuting_Zhou_CV_zh.pdf";
import { useLanguage } from "../../context/LanguageContext";
import { useCloseOnWindowScroll } from "../../hooks/useCloseOnWindowScroll";

function Home2() {
    const [showWechatModal, setShowWechatModal] = useState(false);
    const { locale } = useLanguage();
    const copy = locale === "zh"
        ? {
            title: <>关于 <strong className="text-accent">我</strong></>,
            body: (
                <>
                    我一直追求将模糊的想法打磨成真实、可用的产品。在我看来，编程不仅是功能的实现，更是将逻辑与细节有机组织的过程。正因如此，我对技术始终保持着浓厚的兴趣。
                    <br /><br />
                    目前我尤其关注<b className="text-accent">机器学习系统</b>、<b className="text-accent">数据驱动的产品形态</b>，以及能够真正落地的<b className="text-accent">工程实践</b>。我乐于把分析、建模与业务打通，沉淀为稳定、清晰、可持续演进的软件体验。
                    <br /><br />
                    在技术栈上，我既参与<b className="text-accent">简洁、响应迅速的前端界面开发</b>，也能搭建<b className="text-accent">稳定可靠的后端服务</b>。在<b className="text-accent">数据库设计、API 设计、数据处理流程，以及容器化部署</b>方面，我都有持续的实践积累。
                    <br /><br />
                    我希望自己做出的东西不仅“能跑”，还应该<b className="text-accent">足够流畅、便于维护、对人友好</b>。如果一个系统既在技术上经得起推敲，用起来又自然顺手，那便是我追求的最理想目标。
                </>
            ),
            downloadCv: "下载简历",
            findMe: "联系我",
            connect: <>欢迎通过以下平台与我 <span className="text-accent">联系或交流</span></>,
            avatarAlt: "头像",
            wechatQrAlt: "微信二维码"
        }
        : {
            title: <>LET ME <span className="text-accent">INTRODUCE</span> MYSELF</>,
            body: (
                <>
                    I fell in love with programming and have stayed curious ever since.
                    <br /><br />
                    I am especially interested in <b className="text-accent">ML systems</b> and <b className="text-accent">data-driven products</b> that turn insights into reliable, practical software.
                    <br /><br />
                    I work across the stack, from crafting <b className="text-accent">clean, responsive interfaces</b> to building <b className="text-accent">dependable back-end services</b>. I am comfortable with <b className="text-accent">databases, API design, and containerized deployments that scale</b>.
                    <br /><br />
                    Whenever possible, I strive to turn ideas into products that are <b className="text-accent">fast, maintainable, and a joy</b> to use.
                </>
            ),
            downloadCv: "Download CV",
            findMe: "FIND ME ON",
            connect: <>Feel free to <span className="text-accent">connect</span> with me</>,
            avatarAlt: "avatar",
            wechatQrAlt: "WeChat QR Code"
        };
    const activeCvFile = locale === "zh" ? cvFileZh : cvFile;

    useCloseOnWindowScroll(showWechatModal, () => setShowWechatModal(false));



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
                <Row className="align-items-center home-about-intro-row">
                    <Col lg={8} className="home-about-description">
                        <h1 className="home-about__title">
                            {copy.title}
                        </h1>
                        <p className="home-about-body">
                            {copy.body}
                        </p>
                    </Col>
                    <Col lg={4} className="home-avatar">
                        <div className="home-avatar-wrapper">
                            <Tilt>
                                <img
                                    src={myImg}
                                    className="img-fluid"
                                    alt={copy.avatarAlt}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </Tilt>
                            <div className="d-flex justify-content-center w-100 home-about-actions">
                                <a
                                    href={activeCvFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="download-cv-button"
                                >
                                    <AiOutlineDownload />
                                    <span>{copy.downloadCv}</span>
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="home-about-social">
                        <h1>{copy.findMe}</h1>
                        <p>{copy.connect}</p>
                        <ul className="home-about-social-links">
                            {socialLinks.map((link, idx) => (
                                <li className="social-icons" key={idx}>
                                    <a
                                        href={link.href}
                                        target={link.onClick ? "_self" : "_blank"}
                                        rel="noopener noreferrer"
                                        className="home-social-icons"
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
                <Modal.Body className="modal-body-center" onClick={() => setShowWechatModal(false)}>
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
}

export default Home2;
