import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";

function Github() {
  return (
    <Row className="github__row">
      <h1 className="project-heading github__title">
        Days I <strong className="blue">Code</strong>
      </h1>
      <GitHubCalendar
        username="magicherry"
        blockSize={15}
        blockMargin={5}
        color="#03D3F8"
        fontSize={16}
      />
    </Row>
  );
}

export default Github;
