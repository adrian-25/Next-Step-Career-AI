# Next Step Career AI — Claude Instructions

Read this file at the start of every session. These rules are permanent and non-negotiable.

---

## Project

Full-stack AI career platform. React + TypeScript + Vite frontend, Supabase backend (Postgres, Auth, Edge Functions). Deployed on Lovable. See `.claude/` memory files for full context.

---

## DESIGN

- **Palette:** Indigo/blue SaaS palette — consistent with the existing app. No off-palette colors.
- **Typography:** `DM Sans` for all headings and display text. `IBM Plex Sans` for body/paragraph text.
- **Quality bar:** Every component must be production-ready. Clean, modern SaaS aesthetic — think Linear, Vercel, Notion. No raw, unstyled, or placeholder UI ever ships.
- **Consistency:** New components must match the existing visual language (dark glass cards, subtle borders, white/opacity text hierarchy).

---

## ANIMATION (Framer Motion — mandatory on every new component)

Apply these patterns automatically — never skip:

| Trigger | Pattern |
|---|---|
| Page / section entry | `fadeInUp` + `staggerChildren` on container |
| Cards / list items | Staggered fade-in on mount (`variants` + `staggerChildren`) |
| Buttons | `whileHover={{ scale: 1.02, opacity: 0.9 }}` + `whileTap={{ scale: 0.97 }}` |
| Modals / drawers / dialogs | Slide + fade (`y: 10 → 0`, `opacity: 0 → 1`) |
| Loading states | Skeleton shimmer or pulse (`animate={{ opacity: [0.4, 0.8, 0.4] }}`) |

Never ship a static component when motion is appropriate. If a component has cards, a list, or a page entry — it gets animation.

---

## SKILLS (compare all installed skills, pick the best fit — do not skip)

Before building any UI component:
1. **Scan the full list of available skills** shown in the system-reminder at the start of each session
2. **Compare them** — don't just reach for the first familiar one
3. **Invoke the best match(es)** for the current task

Key skills mapped to common tasks in this project:

| Task type | Best skills to compare & pick from |
|---|---|
| Layout, spacing, color, visual hierarchy | `frontend-design`, `refactoring-ui`, `web-design`, `web-design-guidelines` |
| Interaction design, user flows, UX patterns | `ui-ux-pro-max`, `microinteractions`, `design-everyday-things` |
| Animation & motion | `animation-libraries` (compare patterns before coding) |
| Component polish / cleanup | `refactoring-ui`, `top-design` |
| Supabase queries, auth, RLS | `supabase`, `supabase-postgres-best-practices` |
| Code quality / architecture | `clean-code`, `clean-architecture`, `refactoring-patterns` |
| New feature strategy | `brainstorm-ideas-existing`, `user-stories`, `jobs-to-be-done` |

**Rule:** Never default to a familiar skill when a more specific one is installed. Always compare first.

---

## ORDER OF WORK

For **every** new feature or component, follow this order strictly:

1. **Design first** — palette, typography, spacing, layout
2. **Add motion** — Framer Motion animations
3. **Check consistency** — does it match existing app style?
4. **Write logic** — data fetching, state, Supabase calls

Do not start with logic and add design later.

---

## NEVER

- Ship unstyled or placeholder UI
- Skip Framer Motion animations on new components
- Use colors outside the established indigo/blue palette
- Ignore available skills when building UI
- Add unnecessary comments that explain what the code does (only comment non-obvious WHY)
- Add features beyond what the task requires

---

## TECH STACK QUICK REFERENCE

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- **Backend:** Supabase (Postgres, Auth, Edge Functions via Deno)
- **Auth:** `useAuth()` from `@/contexts/AuthContext` — `{ user, profile, signOut, userRole, isEmployer }`
- **Supabase client:** `import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client"`
- **Demo mode:** When `!isSupabaseConfigured || !user` → fall back to localStorage + hardcoded demo data
- **Routing:** React Router v6, all app pages wrapped in `<Layout />` in `src/App.tsx`
- **Navigation:** Add new pages to `NAV_GROUPS` in `src/components/Sidebar.tsx`
- **Toast:** `useToast()` from `@/hooks/use-toast`
- **UI components:** `@/components/ui/*` (shadcn — dialog, select, card, button, badge, input, textarea, etc.)
