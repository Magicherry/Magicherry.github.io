import React from "react";
import { Col, Row } from "react-bootstrap";

const toolStackIcons = [
    { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg" alt="Windows" style={{ width: "1em", height: "1em", filter: "brightness(1.5) contrast(1.2)" }} />, name: "Windows", link: "https://www.microsoft.com/en-us/windows" },
    { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg" alt="macOS" style={{ width: "1em", height: "1em" }} className="theme-invert" />, name: "macOS", link: "https://www.apple.com/macos/" },
    { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" alt="Linux" style={{ width: "1em", height: "1em" }} />, name: "Linux", link: "https://ubuntu.com/desktop/" },
    { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg" alt="Jupyter" style={{ width: "1em", height: "1em" }} />, name: "Jupyter", link: "https://jupyter.org/" },
    { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" alt="VS Code" style={{ width: "1em", height: "1em" }} />, name: "Visual Studio Code", link: "https://code.visualstudio.com/" },
    { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jetbrains/jetbrains-original.svg" alt="JetBrains" style={{ width: "1em", height: "1em" }} />, name: "JetBrains", link: "https://www.jetbrains.com/" },
];

function Toolstack() {
    return (
        <Row className="tech-stack__row">
            {toolStackIcons.map((tool, index) => (
                <Col
                    key={index}
                    xs={4}
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