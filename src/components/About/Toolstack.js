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
  { icon: <SiWindows11 />, name: "Windows 11" },
  { icon: <SiMacos />, name: "MacOS" },
  { icon: <SiLinux />, name: "Linux" },
  { icon: <SiVisualstudiocode />, name: "Visual Studio Code" },
  { icon: <SiJetbrains />, name: "JetBrains" },
];

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {toolStackIcons.map((tool, index) => (
        <Col key={index} xs={4} md={2} className="tech-icons">
          {tool.icon}
        </Col>
      ))}
    </Row>
  );
}

export default Toolstack;
