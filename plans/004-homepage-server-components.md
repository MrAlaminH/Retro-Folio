# Plan 004: Convert homepage sections from client to server components

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 843d2c8..HEAD -- components/Hero.tsx components/hero/ components/skills-section.tsx components/work-experience-section.tsx components/github-contributions.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED — touches the component hierarchy of the homepage; must preserve all interactive behavior
- **Depends on**: none (but composes with Plan 005 for DecodeText)
- **Category**: perf
- **Planned at**: commit `843d2c8`, 2026-07-28

## Why this matters

The entire homepage (`Hero.tsx` and all its children) is marked `"use client"`, including components that are almost entirely static — AboutMe (text, one toggle), SkillsSection (grid of links), WorkExperienceSection (expandable list), MyProjects (project list), and Contact (social links + image). These components don't need client-side JavaScript for their initial render. By splitting them into server component shells with minimal client islands, the initial HTML payload shrinks, the JS bundle is smaller, and First Contentful Paint (FCP) improves. The interactive pieces (Expand/Collapse buttons, hover effects, DecodeText) remain client components but are smaller isolated islands instead of dragging the entire page tree into client rendering.

## Current state

Component dependency chain:
```
app/page.tsx (server, fine)
  └─ components/Hero.tsx ("use client") ← ROOT OF THE PROBLEM
       ├─ AboutMe.tsx ("use client") — mostly static text, one toggle button
       ├─ MyProjects.tsx ("use client") — static project list, router.push on button
       ├─ WorkExperienceSection.tsx ("use client") — expandable list
       ├─ SkillsSection.tsx ("use client") — static grid of skill links
       ├─ GitHubContributions.tsx ("use client") — fetches + renders calendar
       └─ Contact.tsx ("use client") — static social links + image
```

Because `Hero.tsx` is `"use client"`, all children also execute on the client even though most of their content is static text and links. The `"use client"` directive makes the component and its entire subtree client-side.

Key interactive parts that truly need client JS:
1. `AboutMe.tsx` — the "Learn more/Learn less" toggle (simple useState)
2. `MyProjects.tsx` — the "Check More Projects" button uses router.push
3. `WorkExperienceSection.tsx` — expand/collapse each experience
4. `GitHubContributions.tsx` — fetches from API, renders calendar interactively
5. `DecodeText` usage in section headings — hover decode effect (covered by Plan 005)
6. `Contact.tsx` — actually no interactivity at all (pure static)

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `components/Hero.tsx` — remove `"use client"`, make it a server component
- `components/hero/AboutMe.tsx` — split into server wrapper + small client toggle
- `components/hero/MyProjects.tsx` — split into server wrapper + client button
- `components/hero/Contact.tsx` — remove `"use client"` (no interactivity)
- `components/skills-section.tsx` — remove `"use client"` (no interactivity)
- `components/work-experience-section.tsx` — split into server wrapper + client expand

**Out of scope** (do NOT touch):
- `components/github-contributions.tsx` — needs client (API fetch, react-github-calendar, framer-motion). Leave as-is.
- `components/github-pull-requests.tsx` — same, leave as-is.
- `components/NavBar.tsx`, `components/Footer.tsx` — they are client for good reasons (theme, music, clock, visitor counter)
- `components/MatrixCursor/DecodeText.tsx` — handled by Plan 005
- `app/page.tsx` — already server component, fine
- `app/layout.tsx` — fine

## Git workflow

- Branch: `advisor/004-homepage-server-components`
- Commit per step (or per logical group)
- Do NOT push or open a PR unless instructed

## Steps

### Step 1: Convert Contact.tsx to a server component

This is the easiest — no interactivity at all.

Read the file: `cat -n components/hero/Contact.tsx`

Remove the `"use client";` directive from line 1. That's it. The component uses `Image` (which works in server components), `DecodeText` (client component — fine, server can render client children), `react-icons`, and static `RetroButton` with a `Link` wrapping. None of these need `"use client"`.

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0.

### Step 2: Convert SkillsSection.tsx to a server component

Read the file: `cat -n components/skills-section.tsx`

This component renders a static grid of skill links. The only client-side feature is `DecodeText` on the heading. Since a server component can import and render a client component (`DecodeText`), we just remove `"use client"`.

Remove `"use client";` from line 1.

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0.

### Step 3: Split AboutMe.tsx into server + client

Read the file: `cat -n components/hero/AboutMe.tsx`

This component has:
- Static text content (`paragraphTextParts`, the list items)
- One interactive toggle button (Learn more/Learn less)

The approach:
1. Rename current file to `AboutMeContent.tsx` (the interactive part)
2. Create a new `AboutMe.tsx` as a server component that renders the static content and imports `AboutMeContent` for the interactive part

Actually, a simpler approach: just isolate the toggle into a tiny client sub-component within the same file. But the cleanest way is:

Create a new file `components/hero/AboutMeToggle.tsx` as a client component with just the toggle:

```tsx
"use client";
import React, { useState } from "react";

interface AboutMeToggleProps {
  children: React.ReactNode;
  collapsedChildren: React.ReactNode;
}

export default function AboutMeToggle({ children, collapsedChildren }: AboutMeToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <p className="mt-4 whitespace-pre-wrap text-black dark:text-gray-100 ">
        <span className="mr-2 text-green-500 dark:text-green-500">{">"}</span>
        {isExpanded ? (
          children
        ) : (
          collapsedChildren
        )}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline"
      >
        {isExpanded ? "Learn less >" : "Learn more>"}
      </button>
    </>
  );
}
```

Then update `components/hero/AboutMe.tsx`:
- Remove `"use client";` directive
- Remove `useState` import
- Keep all the static content
- Replace the dynamic paragraph section with `AboutMeToggle`

The content that is currently conditionally rendered:
- Expanded: `paragraphTextParts[0] + [1] + [2] + <Link>nature</Link> + [3]`
- Collapsed: `paragraphTextParts[0].substring(0, 240) + "..."`

These can be passed as props to the toggle component.

**Edits:**

1. Create `components/hero/AboutMeToggle.tsx` with the content above.

2. Modify `components/hero/AboutMe.tsx`:
   - Remove line 1: `"use client";`
   - Remove line 2: `import React, { useState } from "react";` (change to just `import React from "react";`)
   - Add import: `import AboutMeToggle from "./AboutMeToggle";`
   - Remove the `isExpanded` state and `handleToggle` function
   - Replace the paragraph + button block (lines 45-94) with:

```tsx
      <AboutMeToggle
        collapsedChildren={
          <span
            dangerouslySetInnerHTML={{
              __html: `${paragraphTextParts[0].substring(0, 240)}...`,
            }}
          />
        }
      >
        <span
          dangerouslySetInnerHTML={{
            __html: paragraphTextParts[0],
          }}
        />
        <br />
        <br />
        <span
          dangerouslySetInnerHTML={{
            __html: paragraphTextParts[1],
          }}
        />
        <br />
        <br />
        <span
          dangerouslySetInnerHTML={{
            __html: paragraphTextParts[2],
          }}
        />
        <Link
          href="/gallery?category=nature"
          className="text-green-500 dark:text-green-500 underline group relative inline hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          nature
          <FaExternalLinkAlt className="w-3 h-3 ml-1 inline" />
        </Link>
        <span
          dangerouslySetInnerHTML={{
            __html: paragraphTextParts[3],
          }}
        />
      </AboutMeToggle>
```

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0.

### Step 4: Split WorkExperienceSection.tsx into server + client

Read the file: `cat -n components/work-experience-section.tsx`

This component has:
- Static work experience data
- Expand/collapse buttons per item

Approach: create a client wrapper for just the expandable section.

Create `components/WorkExperienceExpandable.tsx`:

```tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkExperience } from "@/data/experience-data";

interface WorkExperienceExpandableProps {
  experience: WorkExperience;
  isLast: boolean;
}

export default function WorkExperienceExpandable({
  experience,
  isLast,
}: WorkExperienceExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li key={experience.id}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-2 sm:gap-3 text-left focus:outline-none group py-1 sm:py-2 hover:opacity-80 transition-opacity duration-200"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-${experience.id}`}
      >
        {/* Company Logo/Icon */}
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
          {experience.logo ? (
            <Image
              src={experience.logo}
              alt={`${experience.company} logo`}
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
              unoptimized={experience.logo.startsWith("http")}
            />
          ) : (
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-green-500 dark:text-green-500 mb-0.5 sm:mb-1 break-words">
                {experience.company}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 break-words">
                {experience.role}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <span className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                {experience.startDate} - {experience.endDate}
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 dark:text-green-500 transition-transform duration-200 flex-shrink-0",
                  isExpanded && "transform rotate-180"
                )}
              />
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div
          id={`experience-details-${experience.id}`}
          className="mt-2 sm:mt-3 pl-[44px] sm:pl-[60px] pt-2"
        >
          {experience.description && (
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 mb-2 sm:mb-3 break-words">
              {experience.description}
            </p>
          )}
          {experience.achievements && experience.achievements.length > 0 && (
            <ul className="list-none space-y-1.5 sm:space-y-2">
              {experience.achievements.map((achievement, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 flex items-start gap-1.5 sm:gap-2"
                >
                  <span className="text-green-500 dark:text-green-500 mt-0.5 flex-shrink-0">•</span>
                  <span className="break-words">{achievement}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!isLast && (
        <hr className="border-neutral-200 dark:border-neutral-800 mt-4 sm:mt-6" />
      )}
    </li>
  );
}
```

Then modify `components/work-experience-section.tsx`:
- Remove `"use client";` from line 1
- Remove `useState` import
- Add import: `import WorkExperienceExpandable from "./WorkExperienceExpandable";`
- Remove the `expandedId` state and `toggleExpand` function
- Replace the list rendering:

From:
```tsx
{workExperienceData.map((experience, index) => {
  const isExpanded = expandedId === experience.id;
  const isLast = index === workExperienceData.length - 1;
  return (
    <li key={experience.id}>
      <button ...>
        ...
      </button>
      ...
    </li>
  );
})}
```

To:
```tsx
{workExperienceData.map((experience, index) => (
  <WorkExperienceExpandable
    key={experience.id}
    experience={experience}
    isLast={index === workExperienceData.length - 1}
  />
))}
```

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0.

### Step 5: Convert MyProjects.tsx to server + client split

Read the file: `cat -n components/hero/MyProjects.tsx`

This component has:
- Static project list rendering (the map + JSX)
- `router.push` on the "Check More Projects" button
- Hover state tracking (`hoveredProjectIndex`)

The hover state is purely visual (CSS transform on `>` chevron). This can be done with CSS `:hover` instead.

Approach:
1. Remove `"use client"` 
2. Remove `useState`, `useRouter` imports
3. Replace router.push with a simple `<Link>` (import from `next/link` which is already imported)
4. Replace hover state with CSS `:hover` selectors

Since this repo already uses `group` hover utilities in Tailwind (visible elsewhere), we can replace the hover logic:

For the chevron rotation, instead of:
```tsx
className={`mr-2 text-green-500 ... transition-transform duration-300 ${
  hoveredProjectIndex === index ? "transform rotate-90" : ""
}`}
```

Use Tailwind's group-hover on the `<li>`:
```tsx
className="group p-2 ..."
// In the chevron span:
className="mr-2 text-green-500 ... transition-transform duration-300 group-hover:rotate-90"
```

Replace the `router.push("/projects")` call on the button with `<Link href="/projects">`.

**Edits:**

In `components/hero/MyProjects.tsx`:
1. Remove `"use client"` (line 1)
2. Remove `useState` import from line 2
3. Remove `useRouter` import from line 5
4. Add `Link` to the existing import from `next/link` — it's already imported but unused; keep it.
5. Remove the `hoveredProjectIndex` state (line 61)
6. Remove `router` declaration (line 64)
7. Remove the `onMouseEnter`/`onMouseLeave` handlers from the `<li>` elements
8. Replace `router.push("/projects")` with `<Link href="/projects">` wrapping the button
9. Replace the conditional `hoveredProjectIndex === index` checks with `group-hover:rotate-90`:

   In the `<li>` for mobile (around line 83): change `onMouseEnter`/`onMouseLeave` and update the className.

   For the chevron spans, change:
   ```
   ${hoveredProjectIndex === index ? "transform rotate-90" : ""}
   ```
   to just: `group-hover:rotate-90`

10. The `<li>` needs `group` class — it already has it (line 80: `className="group p-2..."`)

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0.

### Step 6: Remove "use client" from Hero.tsx

Read the file: `cat -n components/Hero.tsx`

Remove `"use client";` from line 1. This is the final step that makes the entire homepage server-rendered.

Remove the `React` import if lint warns about it (Next.js server components don't need explicit React imports). In Next.js App Router, `import React from "react"` is fine and works in both server and client components. Leave it as-is.

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0.

### Step 7: Full build and visual verification

```bash
npm run build
```
Expected: exit 0.

Then start the dev server:
```bash
npm run dev
```

Open `http://localhost:3000` and verify all sections render correctly:
- About Me section renders with text and "Learn more" button
- Click "Learn more" — expands text with nature link
- My Projects — all 4 projects listed, chevron rotates on hover, "Check More Projects" navigates
- Work Experience — all entries visible, expand/collapse works
- Skills — grid of skills renders
- GitHub Contributions — section loads (this is still client, fine)
- Contact — social links and image render
- All heading DecodeText effects work (these are client components in server context)

Check the Network tab to confirm the page doesn't load large JS bundles for the homepage sections.

Kill the dev server when done.

## Test plan

No automated tests exist. Manual verification covers the interactive behaviors:
- About Me toggle works
- Work Experience expand/collapse works
- "Check More Projects" navigates to /projects
- All hover effects (chevron rotation, link underlines) work
- The page renders correctly on first load without JavaScript (try `npm run build && npm run start`, then disable JS in DevTools — the full page content should render)

## Done criteria

ALL must hold:

- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] `grep -rn '"use client"' components/Hero.tsx` returns no matches
- [ ] `grep -rn '"use client"' components/hero/Contact.tsx` returns no matches
- [ ] `grep -rn '"use client"' components/skills-section.tsx` returns no matches
- [ ] `grep -rn '"use client"' components/hero/AboutMe.tsx` returns no matches
- [ ] `grep -rn '"use client"' components/work-experience-section.tsx` returns no matches
- [ ] `grep -rn '"use client"' components/hero/MyProjects.tsx` returns no matches
- [ ] On `npm run dev`, About Me toggle, Work Experience expand, and Check More Projects all work
- [ ] All section headings render with DecodeText effect
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any component in the in-scope list has been significantly modified since plan creation
- `npm run build` fails — especially with errors like "You're importing a component that needs useState but it's not a client component"
- A component needs `useState`, `useEffect`, or `useRef` after removing `"use client"` — that means you missed something interactive; undo and re-check
- The "Check More Projects" navigation doesn't work after changes
- Images in Contact or Work Experience stop rendering
- Any error about `router.push` — replace with `<Link>` instead
- DecodeText headings stop working (shouldn't happen since DecodeText is a client component imported by server components)

## Maintenance notes

- When adding new interactive elements to these sections, always create a small client component wrapper rather than converting the whole file back to `"use client"`.
- The rule of thumb: if a component doesn't use `useState`, `useEffect`, `useRef`, `useContext`, `useReducer`, event handlers, or browser APIs, it should be a server component.
- `GitHubContributions.tsx` was intentionally left as client because it uses `fetch`, `useEffect`, `useState`, `framer-motion`, and `react-github-calendar`.
