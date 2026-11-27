# Davetkart Project Guidelines

## Architecture & Tech Stack
- **Framework:** React 19 (with TypeScript)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animations & Transitions:** Motion (`motion` library)
- **Icons:** Lucide React (`lucide-react`)
- **AI Assistant:** through the backend (`POST /api/assistant/chat`); the frontend has no AI SDK and no AI key

## Design & UI/UX Principles (Core Focus)
- **Modern & Premium Aesthetics:** The UI must look highly professional and state-of-the-art. Avoid generic designs. Use modern typography, well-curated color palettes, and sleek layouts.
- **Dynamic Transitions:** Always implement smooth micro-animations, hover states, and page transitions using the `motion` library. The interface should feel alive and responsive.
- **High-Quality Components:** Build reusable, encapsulated components leveraging Tailwind CSS utilities.

## Setup & Commands
- **Node:** 24, from `.nvmrc` (`package.json` `engines`)
- **Install dependencies:** `npm ci` with the Vite dev server stopped (`npm install` if it is running)
- **Development Server:** `npm run dev` (Runs on `http://localhost:3000`)
- **Build:** `npm run build`
- **Type Checking:** `npm run lint` (`tsc --noEmit`, `strict`)
- **Quality gate:** `npm run check` (lint + build + the 15 `verify:*` scripts); `npm run e2e` for end-to-end tests. Details: `README.md`


## Enterprise & Professional Architectural Guidelines
To maintain a high-quality, production-ready SaaS application, all new development MUST adhere to the following enterprise-level standards. Unprofessional or prototype-level methods (like heavy prop drilling) are strictly prohibited.

### 1. State Management (Enterprise Level)
- **No Prop Drilling:** Do not pass state deeply through multiple components (e.g., passing `invitation` or `handleInputChange` down 3-4 levels).
- **Global State Libraries:** For complex, application-wide states (like Invitation Data, RSVP lists), use professional state management libraries such as **Zustand**, **Redux Toolkit**, or **Jotai**. (Migrate away from monolithic hooks).
- **Context API:** For simpler scoped states, use React Context.
- **Hook Modularity:** Do not create monolithic hooks (e.g., a massive `useAppState` handling everything). Break hooks down by feature domain (e.g., `useInvitationStore`, `useRSVPStore`, `useUIStore`).

### 2. Data Handling & API Integration
- **API Client:** Use robust API clients like **Axios** (with interceptors) or **TanStack Query (React Query)** to handle server state, caching, loading/error states, and automatic token injection. Do not rely solely on raw `fetch`.
- **Authentication State:** Manage authentication state securely using a dedicated Zustand store (e.g., `useAuthStore`). Protect private routes (like `/dashboard`) and handle seamless login/logout flows.
- **Environment Variables:** The Frontend must NEVER hold or expose Secret API Keys (e.g. AI keys, database credentials) in its code or `.env` file that is shipped to the client.

### 3. Component Architecture
- **Separation of Concerns:** Keep business logic outside of UI components. UI components should only concern themselves with rendering data and emitting events.
- **Atomic Design:** Build UI using small, reusable, and testable components (e.g., under `src/components/ui`).
- **Routing Strategy:** Use a professional router (e.g., `react-router-dom`) to manage separated pages: `/login`, `/register`, `/dashboard`, `/create`, `/invite/:id`.

### 4. General Coding Standards
- **Strict TypeScript:** Write strict, strongly typed TypeScript code (`tsconfig.json` has `"strict": true`). Define explicit interfaces/types for all data structures and API responses. Avoid `any`.
- **Code Splitting:** Continue utilizing `React.lazy` and `React.Suspense` for heavy components to optimize First Contentful Paint (FCP).
- **Documentation:** Use Github-style Markdown when creating documentation and include clear comments for complex business logic.

## Git (İsmail, 2026-11-27)
- **Commit, dal oluşturma ve push varsayılan olarak engellidir; her biri soruya tabidir.** İsmail açıkça istemedikçe
  `git commit`, `git push`, `git branch`, `git checkout -b` / `git switch -c` çalıştırma; değişikliği çalışma ağacında bırak
  ve İsmail'e sor. `.claude/settings.json` bu komutlarda onay ister.
- Dosyalar tek tek eklenir (CRLF tuzağı: `git add -A` yok).
