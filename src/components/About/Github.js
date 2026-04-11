import React, { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Row } from "react-bootstrap";
import { useLanguage } from "../../context/LanguageContext";

const CALENDAR_LABELS = {
  zh: {
    months: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    totalCount: "去年累计提交了 {{count}} 次贡献",
    legend: {
      less: "较少",
      more: "较多",
    },
  },
};

function Github({ theme }) {
  const { locale } = useLanguage();
  const colorScheme = theme === "light" ? "light" : "dark";
  const [calendarRoot, setCalendarRoot] = useState(null);
  const labels = CALENDAR_LABELS[locale];

  useEffect(() => {
    if (!calendarRoot) {
      return undefined;
    }

    const scrollContainer = calendarRoot.querySelector(
      ".react-activity-calendar__scroll-container"
    );

    if (!scrollContainer) {
      return undefined;
    }

    let frameId = 0;

    const scrollToLatest = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        scrollContainer.scrollLeft = Math.max(
          scrollContainer.scrollWidth - scrollContainer.clientWidth,
          0
        );
      });
    };

    scrollToLatest();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            scrollToLatest();
          });

    resizeObserver?.observe(scrollContainer);

    const calendarSvg = scrollContainer.querySelector(
      ".react-activity-calendar__calendar"
    );
    if (calendarSvg) {
      resizeObserver?.observe(calendarSvg);
    }

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [calendarRoot, locale, theme]);

  return (
    <Row className="github__row">
      <h1 className="project-heading github__title">
        {locale === "zh"
          ? <>我的 <strong className="text-accent">代码活跃度</strong></>
          : <>Days I <strong className="text-accent">Code</strong></>}
      </h1>
      <GitHubCalendar
        ref={setCalendarRoot}
        username="magicherry"
        blockSize={18}
        blockMargin={5}
        colorScheme={colorScheme}
        fontSize={16}
        labels={labels}
        theme={{
          light: ["#e5e7eb", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490"],
          dark: ["#21262d", "#0e7490", "#0891b2", "#06b6d4", "#22d3ee"],
        }}
      />
    </Row>
  );
}

export default Github;
