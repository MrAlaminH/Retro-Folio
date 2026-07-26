# 👨‍💻 MrAlaminH — Portfolio

> **Code, Create, Innovate.** A retro-cyberpunk personal portfolio built with Next.js and Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/demo-uralamin.is--a.dev-00ff41?style=for-the-badge&logo=vercel&logoColor=white)](https://uralamin.is-a.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

---

## ✨ Overview

The personal portfolio of **Alamin** — an engineer, builder, and creative technologist who transitioned from Web3 into full-stack and AI engineering. The site showcases my projects, technical skills, and photography through a **retro-futuristic / cyberpunk** lens — with glitch effects, monospace typography, scanline overlays, and a green-on-black color scheme inspired by vintage terminals.

---

## 🚀 Features

### 🖥️ Interactive Terminal
A fully simulated **HedaOS v3.1337** terminal at `/Terminal` with custom commands (`help`, `hack`, `matrix`, `ask`, `scan`, `encrypt`), AI-powered Q&A via OpenAI, Matrix rain canvas animation, and a hacker leveling system.

### 🎵 Built-in Music Player
Ambient retro-wave music player in the navbar with playlist support, audio equalizer visualization, and autoplay with graceful fallback.

### 🤖 AI Chat Widget
Floating chatbot bubble powered by **n8n** webhook — visitors can ask questions about me or the site in real time.

### 📸 Photography Gallery
Browse categorized photo galleries (Nature, My Setup, Random Clicks) with lightbox viewer and pagination.

### 📊 GitHub Integration
Interactive contribution calendar and PR activity feed pulled live from GitHub.

### 📝 Project Showcase
Curated project cards with detailed markdown-driven case study pages for each project.

### 🌓 Theme Switcher
Dark/light mode toggle with **three font options** (Departure Mono, Kalam, Inter) — users can customize the reading experience.

### 📬 Contact & Socials
Contact form (server-side proxied) with social links: LinkedIn, GitHub, Twitter/X, Discord, and a Cal.com booking link.

### 📈 Analytics & Visitor Counter
Privacy-conscious analytics via **PostHog** (self-hosted) + **Vercel Analytics**, Redis-backed visitor counter in the footer.

---

## 🛠️ Tech Stack

| Category            | Technologies                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| **Framework**       | Next.js 14 (App Router)                                                      |
| **Language**        | TypeScript (strict)                                                          |
| **Styling**         | Tailwind CSS 3, CSS animations (glitch, typewriter, scanlines, equalizer)    |
| **UI Components**   | shadcn/ui (Radix primitives)                                                 |
| **Animation**       | CSS transitions, keyframe animations                                        |
| **Icons**           | lucide-react, react-icons (SiNextdotjs, SiTailwindcss, etc.)                 |
| **AI / Chat**       | OpenAI SDK (GPT-4o-mini), n8n webhook                                        |
| **Analytics**       | PostHog (self-hosted), Vercel Analytics                                      |
| **Database**        | Redis (visitor counter)                                                      |
| **Deployment**      | Vercel                                                                       |
| **Domain**          | [uralamin.is-a.dev](https://uralamin.is-a.dev) (is-a.dev subdomain)          |


---

## 🏗️ Getting Started

```bash
# Clone the repository
git clone https://github.com/MrAlaminH/Retro-Folio.git
cd Retro-Folio

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example (or add the following):
#   NEXT_PUBLIC_POSTHOG_KEY=
#   NEXT_PUBLIC_POSTHOG_HOST=
#   OPENAI_API_KEY=
#   OPENAI_API_BASE=
#   GITHUB_TOKEN=
#   REDIS_URL=

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Available Scripts

| Script         | Description                |
| -------------- | -------------------------- |
| `npm run dev`  | Start development server   |
| `npm run build`| Production build           |
| `npm run start`| Start production server    |
| `npm run lint` | Run ESLint                 |
| `npm run typecheck` | Run TypeScript checks |

---

## 🧭 Pages & Routes

| Route              | Description                                |
| ------------------ | ------------------------------------------ |
| `/`                | Home — hero, projects, skills, contact     |
| `/projects`        | Project listing grid                       |
| `/projects/[slug]` | Individual project case study              |
| `/gallery`         | Photography gallery with categories        |
| `/contact`         | Contact form + social links                |
| `/Terminal`        | Interactive HedaOS terminal simulator      |

---

## ☁️ Deployment

The site is deployed on **Vercel**. The easiest way to deploy your own copy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MrAlaminH/Retro-Folio)

---

## 📬 Connect

| Platform  | Handle               |
| --------- | -------------------- |
| **GitHub**  | [@MrAlaminH](https://github.com/MrAlaminH) |
| **LinkedIn**| [itsalamin](https://linkedin.com/in/itsalamin) |
| **Twitter/X**| [@MrAlaminH](https://twitter.com/MrAlaminH) |
| **Discord** | alaminhosainn        |

---

## 📄 License

[MIT](LICENSE) © 2024-2025 Alamin (MrAlaminH)
