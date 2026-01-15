import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiPostgresql,
  SiFigma,
  SiVercel,
  SiLinux,
  SiPostman,
  SiSupabase,
  SiPython,
  SiExpo,
  SiDocker,
  SiGit,
  SiPosthog,
  SiShadcnui,
  SiCloudflare,
} from "react-icons/si";

export interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url?: string;
}

export const skillsData: Skill[] = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    url: "https://nextjs.org",
  },
  {
    name: "Tailwind",
    icon: SiTailwindcss,
    url: "https://tailwindcss.com",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    url: "https://www.typescriptlang.org",
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    url: "https://www.postgresql.org",
  },
  {
    name: "Python",
    icon: SiPython,
    url: "https://www.python.org",
  },
  {
    name: "Figma",
    icon: SiFigma,
    url: "https://www.figma.com",
  },
  {
    name: "Vercel",
    icon: SiVercel,
    url: "https://vercel.com",
  },
  {
    name: "Linux",
    icon: SiLinux,
    url: "https://www.linux.org",
  },
  {
    name: "Postman",
    icon: SiPostman,
    url: "https://www.postman.com",
  },
  {
    name: "Supabase",
    icon: SiSupabase,
    url: "https://supabase.com",
  },
  {
    name: "Expo",
    icon: SiExpo,
    url: "https://expo.dev",
  },
  {
    name: "Docker",
    icon: SiDocker,
    url: "https://www.docker.com",
  },
  {
    name: "Git",
    icon: SiGit,
    url: "https://git-scm.com",
  },
  {
    name: "PostHog",
    icon: SiPosthog,
    url: "https://posthog.com",
  },
  {
    name: "shadcn/ui",
    icon: SiShadcnui,
    url: "https://ui.shadcn.com",
  },
  {
    name: "Cloudflare",
    icon: SiCloudflare,
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
];
