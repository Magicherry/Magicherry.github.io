import React from "react";
import { Col, Row } from "react-bootstrap";
import {
    SiVisualstudiocode,
    SiLinux,
    SiWindows11,
    SiJetbrains,
    SiJupyter,
} from "react-icons/si";
import { FaApple } from "react-icons/fa";

const toolStackIcons = [
    { icon: <SiWindows11 />, name: "Windows", link: "https://www.microsoft.com/en-us/windows" },
    { icon: <FaApple />, name: "macOS", link: "https://www.apple.com/macos/" },
    { icon: <SiLinux />, name: "Linux", link: "https://ubuntu.com/desktop/" },
    { icon: <SiJupyter />, name: "Jupyter", link: "https://jupyter.org/" },
    { icon: <SiVisualstudiocode />, name: "Visual Studio Code", link: "https://code.visualstudio.com/" },
    { icon: <SiJetbrains />, name: "JetBrains", link: "https://www.jetbrains.com/" },
];

function Toolstack() {
    return (
        <Row className="tech-stack__row">
            {toolStackIcons.map((tool, index) => (
                <Col
                    key={index}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    xl={2}
                    className="tech-stack__col"
                >
                    <a
                        className="tech-icons tech-stack__icon-link"
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={tool.name} // Show tool name on hover
                    >
                        <span className="tech-icons__icon" aria-hidden="true">
                        {tool.icon}
                        </span>
                        <span className="tech-icons__name">{tool.name}</span>
                    </a>
                </Col>
            ))}
        </Row>
    );
}

export default Toolstack;