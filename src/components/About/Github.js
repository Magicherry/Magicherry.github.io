import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";
import { useLanguage } from "../../context/LanguageContext";

function Github() {
  const { locale } = useLanguage();
  return (
    <Row className="github__row">
      <h1 className="project-heading github__title">
        {locale === "zh"
          ? <>我的 <strong className="text-accent">代码活跃度</strong></>
          : <>Days I <strong className="text-accent">Code</strong></>}
      </h1>
      <GitHubCalendar
        username="magicherry"
        blockSize={18}
        blockMargin={5}
        color="#03D3F8"
        fontSize={16}
      />
    </Row>
  );
}

export default Github;
