import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Row } from "react-bootstrap";
import { useLanguage } from "../../context/LanguageContext";

function Github({ theme }) {
  const { locale } = useLanguage();
  const colorScheme = theme === "light" ? "light" : "dark";

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
        colorScheme={colorScheme}
        fontSize={16}
        theme={{
          light: ["#e5e7eb", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490"],
          dark: ["#e5e7eb", "#0e7490", "#0891b2", "#06b6d4", "#22d3ee"],
        }}
      />
    </Row>
  );
}

export default Github;
