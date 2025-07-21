# Allmaxed Mentor Web

A responsive UI, seamless navigation, and optimized data fetching.

## 🚀 Overview

Allmaxed Mentor Web is a mentorship platform designed to streamline the discovery and interaction with educational programs and workshops. It offers a clean, responsive interface with a 3-column grid layout for large screens and a single-column layout for mobile, ensuring accessibility and a consistent user experience. Key features include dynamic card displays, state-managed navigation, and enhanced UX with visual feedbacks.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript for robust development.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS for responsive and customizable UI.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Accessible, customizable components (e.g., `DropdownMenu`, `Tooltip`, `Button`).
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight, centralized state management for navigation and session data.
- **Data Fetching**: [React Query](https://tanstack.com/query/) - Efficient data fetching, caching, and error handling.
- **Icons**: [Lucide React](https://lucide.dev/) - Lightweight icon library for UI elements (e.g., `Users`, `MapPin`, `Calendar`).

## ✨ Key Features

- **Responsive Card Layout**: Uniform card heights with `min-h-[2.5rem]` for location text, ensuring consistent 3-column grids on large screens and 1-column on mobile.
- **Seamless Navigation**: Zustand-powered `selectCardAndNavigate` for atomic state updates, with `setTimeout` fixing double-click issues in card navigation.
- **Enhanced UX**:
  - Subtle `text-shadow` glow on active navbar links for visual feedback.
  - `DropdownMenu` with `modal={false}` to maintain active scrollbar, preventing layout shifts.
- **Optimized Data Fetching**: React Query for caching, retries, and loading states, with plans to migrate remaining queries.
- **Accessible Design**: ARIA attributes (e.g., `aria-current`) and tooltips for improved usability.

## 📂 Project Structure

- `src/app/` - Next.js pages (e.g., `home/page.tsx`, `programs/[programId]/page.tsx`).
- `src/components/` - Reusable components (e.g., `AllmaxedCard.tsx`, `SkillstormCard.tsx`, `Navbar.tsx`, `Sidebar.tsx`).
- `src/components/ui/` - `shadcn/ui` components (e.g., `select.tsx`, `dropdown-menu.tsx`).
- `src/context/` - State management (e.g., `useSessionStore.ts` for navigation).
- `app/globals.css` - Global styles, including scrollbar stability (`html { overflow-y: scroll; }`).

## 🚧 Work in Progress

- Applied page data fetching implementation.
- Profile page design and development.
- Migrating remaining queries to React Query for consistent data handling.

📜 Changelog
See the CHANGELOG.md for detailed updates, including recent enhancements to card UX and navigation.

📬 Contact
For questions or feedback, reach out via GitHub Issues.
