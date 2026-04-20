import { FaFlask, FaBriefcase, FaUsers, FaSubway } from 'react-icons/fa';

export const timelines = [
    {
        title: {
            en: "Research",
            zh: "科研"
        },
        subtitle: {
            en: "Academic and applied research endeavors.",
            zh: "围绕真实场景展开的数据分析、模型训练与应用研究实践。"
        },
        icon: FaFlask,
        data: [
            {
                title: {
                    en: "Research Assistant",
                    zh: "研究助理"
                },
                icon: FaSubway,
                department: {
                    en: "Hierarchical Classification, Data Engineering, LLM Applications",
                    zh: "层级文本分类、数据工程、LLM 应用"
                },
                company: {
                    en: "RUTGERS Center for Advanced Infrastructure and Transportation (CAIT)",
                    zh: "罗格斯大学先进基础设施与交通中心（CAIT）"
                },
                duration: "06/2025 - Present",
                description: {
                    en: [
                        "Architected scalable data engineering pipelines to merge and reconcile 100k+ multi-source railway incident and delay records, implementing automated deduplication, hierarchical label dictionary construction, and cross-dataset consistency validation.",
                        "Developed analytical and visualization tools to convert raw operational logs into structured daily, route-level, and location-based performance metrics, supporting delay pattern analysis and anomaly detection.",
                        "Designed and fine-tuned hierarchical multi-label classifiers based on pretrained transformer models (e.g., DeBERTa), modeling structured dependencies with supervised fine-tuning, encoder freezing strategies, and dependency-aware evaluation."
                    ],
                    zh: [
                        "搭建可扩展数据工程流程，整合清洗 10 万 + 多源铁路事故与延误记录，完成自动去重与跨数据集一致性校验，显著提升训练数据质量与复用效率。",
                        "开发面向运营日志的分析与可视化工具链，将原始日志转化为按天、线路、站点聚合的结构化指标，支撑延误模式挖掘、异常定位与业务复盘。",
                        "构建基于预训练模型（DeBERTa）的层次化多标签分类体系，结合监督微调、编码器冻结策略与依赖约束评估，提高跨层标签预测的一致性与稳健性。"
                    ]
                }
            }
        ]
    },
    {
        title: {
            en: "Internship",
            zh: "实习"
        },
        subtitle: {
            en: "Professional industry experience.",
            zh: "在真实业务环境中参与产品迭代、工程协作与功能交付的实践经历。"
        },
        icon: FaBriefcase,
        data: [
            {
                title: {
                    en: "Front-end Engineer",
                    zh: "前端工程师实习生"
                },
                department: {
                    en: "Frontend Performance, Real-time Systems, Vue/React",
                    zh: "前端性能优化、实时通信、Vue/React"
                },
                company: {
                    en: "Shanghai Tenchii Digital Tech Co., Ltd. (Tencent and Shanghai Metro Joint Venture)",
                    zh: "上海通驰数字科技有限公司（腾讯与上海地铁合资）"
                },
                duration: "06/2023 - 08/2023",
                description: {
                    en: [
                        "Refactored rendering and request pipelines in the Shanghai Transit App, reducing page latency by 30% and improving key retention.",
                        "Built a high-concurrency real-time lottery module with WebSocket and MongoDB, ensuring low-latency updates and stable peak-hour performance.",
                        "Delivered 3 cross-team prototypes from Axure to Vue components with product, design, and backend teams, shortening validation cycles."
                    ],
                    zh: [
                        "围绕地铁出行核心链路重构组件渲染策略与请求并发控制，页面加载时延降低 30%，并带动关键页面留存指标正向提升。",
                        "参与高并发实时抽奖系统建设，基于 WebSocket 与 MongoDB 设计消息分发和状态持久化方案，保障峰值流量下低延迟推送与数据一致性。",
                        "与产品、设计及后端协作完成 3 个跨部门原型从 Axure 到 Vue 组件的工程化落地，并补充埋点与验收清单，缩短原型验证与迭代周期。"
                    ]
                }
            },
            {
                title: {
                    en: "Software Test Engineer",
                    zh: "软件测试工程师实习生"
                },
                department: {
                    en: "Test Automation, CI Integration, Quality Assurance",
                    zh: "自动化测试、CI 集成、质量保障"
                },
                company: {
                    en: "Shanghai Spacecraft Electromechanical Equipment Co., Ltd.",
                    zh: "上海航天机电设备有限公司"
                },
                duration: "06/2022 - 09/2022",
                description: {
                    en: [
                        "Built a cross-hardware automation framework and integrated Pytest/JUnit into CI, improving regression coverage and run stability.",
                        "Developed Selenium UI suites and regression workflows to surface high-priority defects earlier, reducing release risk and manual testing cost.",
                        "Standardized defect severity and test reporting, helping engineers triage faster and improving release review efficiency."
                    ],
                    zh: [
                        "搭建跨硬件环境自动化测试框架，联通 Pytest/JUnit 与 CI 流程，提升回归测试覆盖率与执行稳定性。",
                        "基于 Selenium 建立 UI 自动化脚本与缺陷回归机制，提前暴露高优先级问题，降低上线风险并减少人工回归成本。",
                        "建立缺陷分级与回归闭环，沉淀测试报告和风险清单，支持研发快速定位问题并提升版本评审与发布效率。"
                    ]
                }
            }
        ]
    },
    {
        title: {
            en: "Extracurricular",
            zh: "校园活动"
        },
        subtitle: {
            en: "Leadership and community involvement.",
            zh: "课堂之外的组织协作、社团参与与持续性的团队活动经历。"
        },
        icon: FaUsers,
        data: [
            {
                title: {
                    en: "Algorithm Competition Club",
                    zh: "算法竞赛协会"
                },
                department: {
                    en: "Member",
                    zh: "成员"
                },
                company: {
                    en: "Shanghai Institute of Technology",
                    zh: "上海应用技术大学"
                },
                duration: "09/2022 - 05/2023",
                description: {
                    en: [
                        "Organized club activities and assisted the president in writing course plans."
                    ],
                    zh: [
                        "组织社团活动，并协助社长完善课程规划、活动节奏与整体安排。"
                    ]
                }
            },
            {
                title: {
                    en: "P.L Software Engineering Club",
                    zh: "P.L 软件工程俱乐部"
                },
                department: {
                    en: "Member",
                    zh: "成员"
                },
                company: {
                    en: "Shanghai Institute of Technology",
                    zh: "上海应用技术大学"
                },
                duration: "03/2021 - 05/2023",
                description: {
                    en: [
                        "Responsible for answering questions and resolving doubts for other club members."
                    ],
                    zh: [
                        "负责解答社团成员在学习和练习中的问题，并提供基础的技术支持与经验分享。"
                    ]
                }
            },
            {
                title: {
                    en: "Robot Enthusiasts Association",
                    zh: "机器人爱好者协会"
                },
                department: {
                    en: "Member",
                    zh: "成员"
                },
                company: {
                    en: "Shanghai Institute of Technology",
                    zh: "上海应用技术大学"
                },
                duration: "02/2021 - 05/2023",
                description: {
                    en: [
                        "Managed daily club administrative work, prepared equipment and coordinated activity planning"
                    ],
                    zh: [
                        "负责社团日常行政工作、设备准备以及活动协调安排，保证活动可以顺利开展。"
                    ]
                }
            }
        ]
    }
];
