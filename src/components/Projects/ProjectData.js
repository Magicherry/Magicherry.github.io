export const projects = [
    {
        imgPath: require("../../Assets/projects/StreamX.png"),
        title: {
            en: "StreamX: Movie Recommender",
            zh: "StreamX：电影推荐系统"
        },
        description: {
            en: "A personalized recommender system with Matrix Factorization (SGD, ALS), SVD, and TextCNN, featuring end-to-end preprocessing, evaluation (MAE, RMSE, NDCG), and a full-stack web app.",
            zh: "一个面向电影推荐场景的个性化推荐系统，整合了矩阵分解（SGD、ALS）、SVD 与 TextCNN 等多种方法，覆盖从数据清洗、特征处理、模型训练到效果评估的完整流程，并最终落地为可交互的全栈 Web 应用。"
        },
        ghLink: "https://github.com/Magicherry/Movies-Recommendation",
        demoLink: "https://github.com/Magicherry/Movies-Recommendation",
        tags: ["Python", "Machine Learning", "Matrix Factorization", "Next.js", "Django", "Text CNN", "Recommender"],
        type: {
            en: "Personal",
            zh: "个人项目"
        },
        date: "2026"
    },
    {
        imgPath: require("../../Assets/projects/Railway.png"),
        title: {
            en: "Intelligent Rail Incident Classifier",
            zh: "智能铁路事故分类系统"
        },
        description: {
            en: "A hierarchical NLP system built on DeBERTa pre-trained language models for automatic classification of real-world railway incident logs across multiple structured label levels, supported by an end-to-end training and evaluation pipeline.",
            zh: "一个基于 DeBERTa 预训练语言模型构建的分层 NLP 系统，用于对真实轨道交通事件日志进行多层级自动分类。项目不仅包含模型训练与微调，还覆盖数据预处理、标签体系组织、评估流程设计等关键环节，更贴近真实业务中的文本理解需求。"
        },
        tags: ["Python", "Hierarchical Learning", "Preprocessing", "Fine-tuning", "DeBERTa-v3", "NLP"],
        type: {
            en: "Company Internal",
            zh: "企业内部项目"
        },
        date: "2025"
    },
    {
        imgPath: require("../../Assets/projects/train_multi.png"),
        title: {
            en: "Rail Time-Space Diagram Generator",
            zh: "列车时空图生成器"
        },
        description: {
            en: "A Qt native application converting raw train data into intuitive and visual graphs. Helps researcher easily understand and analyze train activity for a specific day and location.",
            zh: "一个基于 Qt 的原生桌面应用，可将原始列车运行数据转换为更直观的时空图与可视化结果，帮助研究人员围绕特定日期、区段和地点快速理解列车活动情况，并提升后续分析工作的效率。"
        },
        tags: ["Python", "PyQt", "NumPy", "Pandas", "Matplotlib"],
        type: {
            en: "Company Internal",
            zh: "企业内部项目"
        },
        date: "2025"
    },
    {
        imgPath: require("../../Assets/projects/Fitness.png"),
        title: {
            en: "Real-time Pose Estimation",
            zh: "实时人体姿态估计系统"
        },
        description: {
            en: "A application that uses Google Movenet model to perform real-time pose estimation from a webcam feed, providing instant feedback on movement accuracy.",
            zh: "一个使用 Google MoveNet 模型进行实时姿态估计的应用，能够直接从摄像头画面中识别人体关键点，并对动作完成度与准确性给出即时反馈，适合运动训练、姿态识别等实时交互场景。"
        },
        ghLink: "https://github.com/Magicherry/Pose_Estimation",
        demoLink: "https://github.com/Magicherry/Pose_Estimation",
        tags: ["Python", "MoveNet", "OpenCV", "PyTorch", "TensorFlow"],
        type: {
            en: "Personal",
            zh: "个人项目"
        },
        date: "2024"
    },
    {
        imgPath: require("../../Assets/projects/AyeNote.png"),
        title: {
            en: "AyeNote Cloud Notes",
            zh: "AyeNote 云笔记"
        },
        description: {
            en: "A full-stack note-taking application featuring a Vue3 front-end and a Django back-end. Includes web scraping and data mining capabilities to analyze user data.",
            zh: "一个全栈云笔记应用，前端基于 Vue3，后端基于 Django，支持日常笔记管理与内容组织。同时项目还结合了网页抓取与数据挖掘能力，用于分析用户数据与内容行为，让产品不只是“记录工具”，也具备进一步处理信息的能力。"
        },
        ghLink: "https://github.com/Magicherry/AyeNote",
        demoLink: "https://github.com/Magicherry/AyeNote",
        tags: ["Python", "Django", "Vue 3", "MySQL", "Beautiful Soup", "AJAX"],
        type: {
            en: "Personal",
            zh: "个人项目"
        },
        date: "2023"
    },
    {
        imgPath: require("../../Assets/projects/KOB.png"),
        title: {
            en: "King of Bots: Real-time Battle Platform",
            zh: "King of Bots：实时对战平台"
        },
        description: {
            en: "A real-time strategy game with a SpringBoot back-end and a Vue3 front-end. Features a MySQL database and a Bootstrap 4 interface for a dynamic gaming experience.",
            zh: "一个实时策略游戏项目，后端基于 Spring Boot，前端基于 Vue3，并结合 MySQL 与 Bootstrap 4 构建完整的交互链路。项目涵盖用户对战、实时同步、状态管理等核心能力，是一次比较完整的前后端联动实践。"
        },
        ghLink: "https://github.com/Magicherry/King-of-Bots",
        demoLink: "https://github.com/Magicherry/King-of-Bots",
        tags: ["Java", "Spring Boot", "Vue 3", "MySQL", "WebSocket", "JWT"],
        type: {
            en: "Personal",
            zh: "个人项目"
        },
        date: "2023"
    },
    {
        imgPath: require("../../Assets/projects/Managements.png"),
        title: {
            en: "Management Dashboard",
            zh: "后台管理系统"
        },
        description: {
            en: "A comprehensive management system built with SpringBoot and MyBatis. Features a secure database with MD5 encryption and a clear separation of front-end and back-end concerns.",
            zh: "一个基于 Spring Boot 与 MyBatis 的综合管理后台系统，具备较清晰的前后端分层结构，并结合 MySQL 与 MD5 加密实现数据管理与权限相关功能。这个项目更多体现了传统业务系统中模块划分、接口设计与后台管理能力的完整实现。"
        },
        ghLink: "https://github.com/Magicherry/Management_Web_System",
        demoLink: "https://github.com/Magicherry/Management_Web_System",
        tags: ["Java", "Spring Boot", "Vue 3", "MyBatis Plus", "MySQL", "MD5"],
        type: {
            en: "Personal",
            zh: "个人项目"
        },
        date: "2022"
    },
    {
        imgPath: require("../../Assets/projects/CiderMusic.png"),
        title: {
            en: "Music App UX Design",
            zh: "Music App 交互设计"
        },
        description: {
            en: "A high-fidelity UX prototype for a third-party music streaming application, designed in Axure RP 9 and inspired by Apple Music's clean and intuitive interface.",
            zh: "一个第三方音乐流媒体应用的高保真 UX 原型，使用 Axure RP 9 完成设计与交互演示。整体视觉和操作逻辑参考了 Apple Music 的简洁风格，重点关注信息层级、播放流程与核心页面之间的用户体验衔接。"
        },
        ghLink: "https://github.com/Magicherry/Music-App-Ui-Design",
        demoLink: "https://github.com/Magicherry/Music-App-Ui-Design",
        tags: ["Axure RP", "UX", "Prototyping"],
        type: {
            en: "Personal",
            zh: "个人项目"
        },
        date: "2022"
    },
    {
        imgPath: require("../../Assets/projects/Fighters.png"),
        title: {
            en: "King of Fighters",
            zh: "经典拳皇"
        },
        description: {
            en: "A classic fighting game clone built with HTML and JavaScript. Features a microservice-based architecture and allows for two-player keyboard-controlled gameplay.",
            zh: "一个使用 HTML、JavaScript 与 CSS 开发的经典格斗游戏复刻版本，支持双人键盘对战，并尝试引入更模块化的结构来组织游戏逻辑、角色状态和交互流程，是一次偏前端交互与游戏机制实现的练习。"
        },
        ghLink: "https://github.com/Magicherry/King-of-Fighters",
        demoLink: "https://github.com/Magicherry/King-of-Fighters",
        tags: ["HTML", "JavaScript", "CSS"],
        type: {
            en: "Personal",
            zh: "个人项目"
        },
        date: "2021"
    },
];
