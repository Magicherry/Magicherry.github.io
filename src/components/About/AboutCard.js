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
      "Reading tech blogs",
      "Playing games",
      "Watching movies & TV",
      "Photography & videography"
    ];
  const copy = locale === "zh"
    ? {
      highlights: [
        <>Hello，我是<span className="text-accent">周昱廷</span>，目前在 <span className="text-accent">Rutgers University</span> 攻读计算机科学硕士，将自己的研究和工程实践向着更扎实广阔的方向推进。</>,
        <>我目前在 <span className="text-accent">CAIT Lab</span> 担任研究助理，主要参与了<span className="text-accent">轨道交通事件建模</span>、<span className="text-accent">大规模数据处理</span>，以及面向真实业务场景的 <span className="text-accent">NLP / LLM 自动化应用</span>。</>,
        <>我正在积极寻找<span className="text-accent">2026年夏季起</span>的<span className="text-accent">软件工程</span>相关机会，希望继续深入<span className="text-accent">机器学习系统</span>、<span className="text-accent">前后端全栈工程</span>、<span className="text-accent">数据驱动产品</span>和更有落地价值的工程问题。</>,
        <>除此之外，我也很享受这些能让我保持敏锐和灵感的事情：</>
      ],
      quote: "无论你的梦想是什么，你都必须全身心投入其中。",
      quoteAuthor: "艾尔顿 · 塞纳"
    }
    : {
      highlights: [
        <>Hello, I am <span className="text-accent">Yuting Zhou</span>, a Computer Science master’s student at <span className="text-accent">Rutgers University</span>.</>,
        <>I currently work as a Research Assistant at the <span className="text-accent">CAIT Lab</span>, focusing on <span className="text-accent">rail incident modeling</span>, <span className="text-accent">large-scale data engineering</span>, and <span className="text-accent">NLP/LLM-based automation</span> for transportation systems.</>,
        <>I am actively seeking <span className="text-accent">Software Engineering</span> opportunities starting <span className="text-accent">Summer 2026</span>, with interests in <span className="text-accent">ML systems</span>, <span className="text-accent">Frontend &amp; Backend Engineering</span>, and <span className="text-accent">data-driven products</span>.</>,
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
          <ul>
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
