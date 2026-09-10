import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { useLanguage } from "../../context/LanguageContext";

const AboutCard = () => {
  const { locale } = useLanguage();
  const activities = locale === "zh"
    ? [
      "阅读技术博客和产品评测",
      "体验游戏与交互设计",
      "看电影、剧集和纪录片",
      "摄影和视频创作"
    ]
    : [
      "Read tech blogs & reviews",
      "Explore games & UX design",
      "Watching movies & TV",
      "Photography & videography"
    ];
  const copy = locale === "zh"
    ? {
      highlights: [
        <>Hello，我是<span className="text-accent">周昱廷</span>，目前在<span className="text-emphasis">蔚来汽车</span>担任 <span className="text-emphasis">AI Agent 工程师</span>兼<span className="text-emphasis">业务规划助理分析师</span>，此前于 <span className="text-emphasis">Rutgers University</span> 取得计算机科学硕士学位。</>,
        <>我主要面向制造运营场景设计并落地<span className="text-accent">企业级 AI Agent 系统</span>，围绕 <span className="text-emphasis">LLM / RAG</span>、<span className="text-emphasis">流程自动化</span>与<span className="text-emphasis">数据驱动的决策支持</span>，把复杂业务需求变成真正可用的智能化工具。</>,
        <>在此之前，我在 <span className="text-emphasis">Rutgers CAIT Lab</span> 从事 <span className="text-emphasis">NLP / LLM</span> 相关研究，并在<span className="text-emphasis">上海通驰数字科技</span>（腾讯 × 上海地铁合资）参与大规模 Web 应用的工程建设。</>,
        <>除此之外，我也很享受这些能让我保持敏锐和灵感的事情：</>
      ],
      quote: "无论你的梦想是什么，你都必须全身心投入其中。",
      quoteAuthor: "艾尔顿 · 塞纳"
    }
    : {
      highlights: [
        <>Hello, I am <span className="text-accent">Yuting Zhou</span>, an <span className="text-emphasis">AI Agent Engineer</span> and <span className="text-emphasis">Business Planning Assistant Analyst</span> at <a className="nio-link" href="https://www.nio.com/" target="_blank" rel="noopener noreferrer">NIO</a>, holding an M.S. in Computer Science from <span className="text-emphasis">Rutgers University</span>.</>,
        <>I design and build <span className="text-accent">enterprise AI agent systems</span> for manufacturing operations, working across <span className="text-emphasis">LLMs &amp; RAG</span>, <span className="text-emphasis">workflow automation</span>, and <span className="text-emphasis">AI-driven decision support</span>.</>,
        <>Previously, I researched <span className="text-emphasis">NLP and LLMs</span> at the <span className="text-emphasis">Rutgers CAIT Lab</span>, and built <span className="text-emphasis">large-scale web applications</span> at Tenchii Digital Tech (a Tencent &times; Shanghai Metro joint venture).</>,
        <>Apart from coding, here are some activities I enjoy:</>
      ],
      quote: "No matter what your dream is, you have to dedicate yourself entirely to it.",
      quoteAuthor: "AYRTON SENNA"
    };

  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <ul className="about-card__highlights">
            {copy.highlights.map((item, index) => (
              <li className="about-card__highlight" key={index}>
                {item}
              </li>
            ))}
          </ul>
          <ul className="about-card__activities">
            {activities.map((activity, index) => (
              <li className="about-activity" key={index}>
                <ImPointRight /> {activity}
              </li>
            ))}
          </ul>

          <p className="text-accent about-card__quote">
            <em>"{copy.quote}"</em>
          </p>
          <footer className="blockquote-footer">{copy.quoteAuthor}</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
};

export default AboutCard;
