export interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string | "Present";
  description?: string;
  achievements?: string[];
  logo?: string; // URL or path to company logo image
}

export const workExperienceData: WorkExperience[] = [
  {
    id: 1,
    company: "Fusion Calling Lab",
    role: "Founder and Marketer",
    startDate: "Jan 2025",
    endDate: "Present",
    logo: "/fusion-calling-lab.webp",
    description:
      "We help businesses automate their phone calls with AI voice assistants. Scale support, sales, and follow-ups without hiring more people.",
    achievements: [
      "Inbound & outbound AI phone call automation",
      "Custom AI voice agents trained for your business",
      "Seamless integration with CRMs and third-party tools",
      "Real-time dashboards and conversation tracking",
      "Scalable, reliable, and always on",
    ],
  },
  {
    id: 2,
    company: "Fiverr",
    role: "Web & Automation Engineer",
    startDate: "Jan 2024",
    endDate: "Present",
    logo: "/fiverr.webp",
    description:
      "As a freelance AI automation & SaaS developer, I partner with founders, startups, and businesses to design and build modern web applications, automation systems, and custom AI solutions. My work focuses on delivering clean, scalable, and production-ready products — fast. From concept to deployment, I handle the full stack and integrate AI wherever it adds real value.",
    achievements: [
      "Build full-stack web platforms and SaaS products",
      "Develop and integrate AI chatbots, voice agents, and automation tools",
      "Design and ship responsive frontends with smooth UX",
      "Automate business processes using APIs, workflows, and custom logic",
      "Consult on tech architecture, infrastructure, and performance",
    ],
  },
  {
    id: 3,
    company: "Jan AI",
    role: "Software Engineering Intern",
    startDate: "Aug 2023",
    endDate: "Oct 2023",
    logo: "/jan-ai.webp",
    description:
      "Worked as a software engineering intern, contributing to web platform development, analytics integration, and community management initiatives.",
    achievements: [
      "Integrated PostHog analytics into websites and platforms for improved user tracking and insights",
      "Maintained and enhanced Discord server integration and automation",
      "Contributed to blog writing and content creation",
      "Assisted with social media management and community engagement",
    ],
  },
];
