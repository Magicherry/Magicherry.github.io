import React from "react";
import Typewriter from "typewriter-effect";
import { useLanguage } from "../../context/LanguageContext";

function TypeWord() {
  const { locale } = useLanguage();
  const strings = locale === "zh"
    ? [
      "AI Agent 工程师",
      "业务规划分析",
      "软件工程师",
      "机器学习工程师",
      "前端开发工程师",
      "后端开发工程师",
      "全栈开发工程师",
      "测试工程师",
      "数据分析"
    ]
    : [
      "AI Agent Engineer",
      "Business Planning Analyst",
      "Software Engineer",
      "Machine Learning Engineer",
      "Front-end Developer",
      "Back-end Developer",
      "Full-stack Developer",
      "Test Engineer",
      "Data Analysis"
    ];

  return (
    <Typewriter
      options={{
        strings,
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default TypeWord;
