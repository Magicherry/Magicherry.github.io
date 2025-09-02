import { FaFlask, FaBriefcase, FaUsers } from 'react-icons/fa';

export const timelines = [
    {
        title: 'Research',
        subtitle: "Here are a few research projects I've worked on.",
        icon: FaFlask, // 注意是组件名，不是JSX
        data: [
            {
                title: "Research Assistant",
                department: "Rail Network Modelling Project",
                company: "RUTGERS Center for Advanced Infrastructure and Transportation (CAIT)",
                duration: "06/2025 - Present",
                description: [
                    "Assisted with the preparation of data for the rail network modelling project.",
                    "Enhanced the NJT Graph script and developed a cross-platform Qt interface.",
                    "Integrated LLM APIs and deployed local LLMs to automate data processing and consistency checks."
                ]
            }
        ]
    },
    {
        title: 'Internship',
        subtitle: "Here are a few internships I've had.",
        icon: FaBriefcase,
        data: [
            {
                title: "Front-end Engineer",
                department: "Product Technology Department",
                company: "Shanghai Tenchii Digital Tech Co., Ltd. (Tencent x Shentong Metro Group)",
                duration: "06/2023 - 08/2023",
                description: [
                    "Optimized UX performance for the official Shanghai Transit App.",
                    "Restructured website features to align with evolving business objectives.",
                    "Assisted in developing a real-time lottery barrage system using Vue and WebSocket.",
                    "Developed internal interface prototypes for cross-team implementation.",
                    "Collaborated closely with back-end developers."
                ]
            },
            {
                title: "Software Test Engineer",
                department: "Quality Assurance Department",
                company: "Shanghai Spacecraft Electromechanical Equipment Co., Ltd.",
                duration: "06/2022 - 09/2022",
                description: [
                    "Established a comprehensive testing environment, executed test cases, provided technical guidance on configurations and hardware requirements.",
                    "Identified and analyzed system defects and performance issues, delivering in-depth testing reports."
                ]
            }
        ]
    },
    {
        title: 'Extracurricular',
        subtitle: "Here are some extracurriculars I've joined.",
        icon: FaUsers,
        data: [
            {
                title: "Member",
                department: "Algorithm Competition Club",
                company: "Shanghai Institute of Technology",
                duration: "09/2022 - 05/2023",
                description: [
                    "Organized club activities and assisted the president in writing course plans."
                ]
            },
            {
                title: "Member",
                department: "P.L Software Engineering Club",
                company: "Shanghai Institute of Technology",
                duration: "03/2021 - 05/2023",
                description: [
                    "Responsible for answering questions and resolving doubts for other club members."
                ]
            },
            {
                title: "Member",
                department: "Robot Enthusiasts Association",
                company: "Shanghai Institute of Technology",
                duration: "02/2021 - 05/2023",
                description: [
                    "Managed daily club administrative work, prepared equipment and coordinated activity planning"
                ]
            }
        ]
    }
];
