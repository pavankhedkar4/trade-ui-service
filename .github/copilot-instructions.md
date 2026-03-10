# Trade App UI Service - Copilot Instructions

## Architecture Overview

**Trade App** is a React + Vite frontend service for a trading platform with Java backend integration. It features page-based routing for authentication (login/signup) and user management workflows.

### Key Structure

- **Entry**: [src/main.jsx](src/main.jsx) → [src/App.jsx](src/App.jsx) (React Router setup)
- **Pages**: [src/pages/](src/pages/) contains route components - Homepage, Login, Signup, UpstockUser
- **Styling**: Per-page CSS files in pages/ directory (not shared components)
- **Build**: Vite with React Fast Refresh, ES modules

## Critical Development Workflows

### Local Development

```bash
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # Production build to dist/
npm run lint         # ESLint check (current: no fixes)
npm run preview      # Preview production build
```

**Key**: Dev server must be running while working on components. Backend API expected on `http://localhost:8080`.

### Backend Integration Points

- **Login**: POST `http://localhost:8080/api/login/login-user` (expects username/password)
- **Signup**: POST `http://localhost:8080/api/login/save-user` (expects formData: name, emailId, upstockId, username, password)
- **Auth Storage**: authCode saved to localStorage after signup/login
- **Post-Signup Flow**: Redirects to `/upstock-user` route

## Component & Data Patterns

### State Management

- **Local state only** - no Redux/Context API currently
- Use `useState` for form data (e.g., Signup uses single formData object with spread operator)
- Form validation minimal - backend handles errors, return `alert()` for user feedback

### Form Handling Pattern (from Signup)

```jsx
const [formData, setFormData] = useState({ name: "", emailId: "", ... });
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

**Key**: Input `name` attributes must match formData keys for this pattern to work.

### API Communication

- **HTTP Client**: axios (v1.13.6)
- **Error Handling**: try/catch with `alert()` for user messages, `console.error()` for logging
- **No interceptors** - direct axios calls in components

### Routing (React Router v7)

- **Router Container**: [src/App.jsx](src/App.jsx) defines all routes using `<Routes>`
- **Paths**: `/` (Homepage), `/login`, `/signup`, `/upstock-user`
- **Navigation**: Use `<Link>` for nav, `window.location.href` for post-action redirects (see Signup)

## Project Conventions

### File Naming

- Components: `.jsx` extension, CamelCase (Homepage.jsx, Login.jsx)
- Styles: Matching `.css` file in same directory (Login.jsx + Login.css)
- No shared component library or utilities folder currently

### Styling Strategy

- **Global styles**: [src/index.css](src/index.css)
- **Per-page styles**: Imported in component (e.g., `import "./Login.css"`)
- **Inline styles minimal** - prefer CSS classes

### Dependencies (Key Versions)

- React 19.2.0, React Router 7.13.1, axios 1.13.6
- Vite 8.0.0-beta.13 (recent beta)
- ESLint with react-hooks and react-refresh plugins (see [eslint.config.js](eslint.config.js))

## When Adding Features

1. **New Pages**: Create [.jsx](src/pages/YourPage.jsx) + [.css](src/pages/YourPage.css), add route to [App.jsx](src/App.jsx)
2. **API Calls**: Use axios in component, store responses in state or localStorage
3. **Form Fields**: Follow Signup pattern - add to useState, set name attributes, use handleChange
4. **Errors**: Alert for UX feedback, console for debugging
5. **Auth Redirects**: Use `window.location.href` for post-auth navigation

## ESLint Configuration

Current setup: [eslint.config.js](eslint.config.js) enables react-refresh and react-hooks rules. No TypeScript - JS only.
