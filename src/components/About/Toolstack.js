import React from "react";
import { Col, Row } from "react-bootstrap";

const toolStackIcons = [
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/windows11/windows11-original.svg" alt="Windows" className="tech-icon-windows" style={{ width: "1em", height: "1em" }} />, name: "Windows", link: "https://www.microsoft.com/en-us/windows" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/apple/apple-original.svg" alt="macOS" style={{ width: "1em", height: "1em" }} className="theme-invert" />, name: "macOS", link: "https://www.apple.com/macos/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/linux/linux-original.svg" alt="Linux" style={{ width: "1em", height: "1em" }} />, name: "Linux", link: "https://ubuntu.com/desktop/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/postman/postman-original.svg" alt="Postman" style={{ width: "1em", height: "1em" }} />, name: "Postman", link: "https://www.postman.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/vscode/vscode-original.svg" alt="VS Code" style={{ width: "1em", height: "1em" }} />, name: "Visual Studio Code", link: "https://code.visualstudio.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/jetbrains/jetbrains-original.svg" alt="JetBrains" style={{ width: "1em", height: "1em" }} />, name: "JetBrains", link: "https://www.jetbrains.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.simpleicons.org/claude/CC785C" alt="Claude Code" style={{ width: "1em", height: "1em" }} />, name: "Claude Code", link: "https://www.anthropic.com/claude-code" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.jsdelivr.net/npm/simple-icons@15.15.0/icons/openai.svg" alt="Codex" className="tech-icon-codex" style={{ width: "1em", height: "1em" }} />, name: "Codex", link: "https://developers.openai.com/codex" },
    { icon: <img loading="lazy" width="16" height="16" src="https://cdn.simpleicons.org/googlegemini" alt="Gemini CLI" className="tech-icon-gemini-cli" style={{ width: "1em", height: "1em" }} />, name: "Gemini CLI", link: "https://github.com/google-gemini/gemini-cli" },
    {
        // Cursor ships a light and a dark mark. `prefers-color-scheme` would tie
        // them to the OS, which desyncs the moment a visitor uses the site's own
        // theme toggle - so both are rendered and CSS picks one off [data-theme].
        icon: (
            <span className="tech-icon-cursor">
                <img
                    loading="lazy"
                    width="16"
                    height="16"
                    src="https://cursor.com/marketing-static/favicon.svg"
                    alt="Cursor"
                    className="tech-icon-cursor__on-dark"
                    style={{ width: "1em", height: "1em" }}
                />
                <img
                    loading="lazy"
                    width="16"
                    height="16"
                    src="https://cursor.com/marketing-static/favicon-light.svg"
                    alt="Cursor"
                    className="tech-icon-cursor__on-light"
                    style={{ width: "1em", height: "1em" }}
                />
            </span>
        ),
        name: "Cursor",
        link: "https://www.cursor.com/",
    },
    { icon: <img loading="lazy" width="16" height="16" src="https://www.zerotier.com/wp-content/uploads/2024/10/icon.svg" alt="ZeroTier" style={{ width: "1em", height: "1em" }} />, name: "ZeroTier", link: "https://www.zerotier.com/" },
    { icon: <img loading="lazy" width="16" height="16" src="https://tailscale.com/favicon.svg" alt="Tailscale" style={{ width: "1em", height: "1em" }} />, name: "Tailscale", link: "https://tailscale.com/" },
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
