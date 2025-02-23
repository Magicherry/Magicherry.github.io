import React from "react";
import { Col, Row } from "react-bootstrap";
import {
    SiVisualstudiocode,
    SiPostman,
    SiSlack,
    SiVercel,
    SiMacos,
    SiLinux,
    SiWindows11,
    SiJetbrains,
} from "react-icons/si";

const toolStackIcons = [
    { icon: <SiWindows11 />, name: "Windows 11", link: "https://www.microsoft.com/en-us/windows" },
    { icon: <SiMacos />, name: "MacOS", link: "https://www.apple.com/macos/" },
    { icon: <SiLinux />, name: "Linux", link: "https://www.kernel.org/" },
    { icon: <SiVisualstudiocode />, name: "Visual Studio Code", link: "https://code.visualstudio.com/" },
    { icon: <SiJetbrains />, name: "JetBrains", link: "https://www.jetbrains.com/" },
];

function Toolstack() {
    return (
        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
            {toolStackIcons.map((tool, index) => (
                <Col key={index} xs={4} md={2} style={{ padding: "10px" }}>
                    <a
                        className="tech-icons"
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={tool.name} // 悬停时显示工具名称
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            textDecoration: "none",
                            color: "inherit"
                        }}
                    >
                        {tool.icon}
                    </a>
                </Col>
            ))}
        </Row>
    );
}

export default Toolstack;