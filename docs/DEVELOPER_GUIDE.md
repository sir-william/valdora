# VALDORA Frontend: Comprehensive Developer Guide

## 1. Introduction

Welcome to the VALDORA Frontend Developer Guide. This document provides a deep dive into the project's architecture, components, and development workflows. The goal is to enable developers to quickly understand the codebase, contribute effectively, and maintain a high standard of quality.

### 1.1. Core Philosophy

The frontend is built on a modular, scalable, and maintainable architecture. It leverages a modern tech stack centered around Next.js and Material-UI, with a strong emphasis on code clarity, reusability, and performance.

### 1.2. Technology Stack

A summary of the key technologies used in this project:

| Category          | Technology                                      |
| ----------------- | ----------------------------------------------- |
| **Framework**     | [Next.js 14](https://nextjs.org/) (App Router)  |
| **UI Library**    | [Material-UI (MUI)](https://mui.com/)           |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com/) & Emotion (via MUI) |
| **State Mgt.**    | [Redux Toolkit](https://redux-toolkit.js.org/)  |
| **Charting**      | [Recharts](https://recharts.org/)               |
| **Form/Schema**   | [Zod](https://zod.dev/)                         |
| **Icons**         | [Iconify](https://iconify.design/)              |
| **Linting**       | ESLint                                          |
| **Package Mgt.**  | npm                                             |

## 2. Project Structure

The project follows a feature-oriented and domain-driven directory structure. This organization keeps related logic, components, and styles together, making the codebase easier to navigate and scale.

```
/home/ubuntu/valdora-frontend/
├── .next/              # Next.js build output (transient)
├── node_modules/       # Project dependencies (transient)
├── out/                # Static export output for deployment
├── public/             # Static assets (images, fonts, etc.)
├── src/
│   ├── @core/          # Core UI Kit, theme, and foundational logic
│   ├── @layouts/       # High-level page layout components
│   ├── @menu/          # Menu and navigation configuration
│   ├── app/            # Next.js App Router: pages and routes
│   ├── assets/         # Global assets (CSS, icons)
│   ├── components/     # Global, shared, feature-specific components
│   ├── configs/        # Application-wide configuration constants
│   ├── data/           # Mock data services and sources
│   ├── redux-store/    # Redux Toolkit store, slices, and hooks
│   ├── utils/          # Utility and helper functions
│   └── views/          # Components that compose a full page view
├── .env.local          # Local environment variables (git-ignored)
├── next.config.js      # Next.js configuration
├── package.json        # Project metadata and dependencies
└── tailwind.config.js  # Tailwind CSS configuration
```

### 2.1. Detailed Directory Breakdown

| Directory         | Purpose                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/@core`       | The heart of the design system. Contains highly reusable, generic components (`@core/components`), hooks, theme definitions, and styles. **Think of this as our internal UI kit.** |
| `src/@layouts`    | Contains components responsible for the overall page structure, such as `VerticalLayout` which includes the sidebar and header.      |
| `src/app`         | **Routing entry point.** Each sub-directory maps to a URL path. `layout.jsx` is the root layout, and `page.jsx` is the homepage. |
| `src/components`  | For shared components that are more feature-specific than `@core` components. E.g., `DashboardUserTable` or `ProductCard`.     |
| `src/views`       | Composable components that represent a whole section or "view" of a page. They assemble smaller components from `@core` and `components`. |
| `src/redux-store` | All Redux-related logic resides here. The `store.js` file configures the store, and feature-based slices manage state.         |
| `src/data`        | Contains the mock data service. This is used for development and testing when a live backend is not available.                  |

## 3. Core Architectural Concepts

### 3.1. Routing

The project uses the **Next.js App Router**. Routing is file-system based, where folders inside `src/app/` define the URL segments. 

- **Root Layout:** `src/app/layout.jsx` wraps all pages. It's responsible for setting up global providers like Redux's `<Provider>` and MUI's `<ThemeProvider>`.
- **Pages:** A `page.jsx` file within a directory makes that path a publicly accessible route.
- **Static Generation:** The `next.config.js` is configured with `output: 'export'`, which means the `npm run build` command generates a fully static site in the `/out` directory. This is optimal for performance and deployment on static hosts.

### 3.2. Styling

VALDORA employs a hybrid styling strategy:

1.  **Material-UI (MUI):** Used for the core component library, layout, and theming. The global theme is defined in `src/app/layout.jsx`, providing consistent colors, typography, and spacing.
2.  **Tailwind CSS:** Used for rapid, utility-first styling, especially for custom components and layout adjustments. It is configured to work seamlessly with MUI.
3.  **Global CSS:** `src/app/globals.css` contains base styles and resets.

This combination provides the structural integrity of a component library with the flexibility and speed of a utility-first framework.

### 3.3. State Management

Global application state is managed by **Redux Toolkit**. 

- **Store:** The single source of truth is configured in `src/redux-store/store.js`.
- **Slices:** State is organized into "slices" (e.g., `userSlice`, `cartSlice`). Each slice contains its reducers and actions, generated using `createSlice`.
- **Hooks:** The `useAppDispatch` and `useAppSelector` typed hooks should be used in components to interact with the store, ensuring type safety.

### 3.4. Data Fetching & Mocking

The application includes a configurable mock data service to facilitate frontend development without a backend dependency.

- **Activation:** The mock service is enabled by setting `NEXT_PUBLIC_ENABLE_MOCKS=true` in `.env.local`.
- **Implementation:** The mock logic resides in `src/data/service.js`. It simulates API calls and returns static data from JSON files.
- **Delay:** `NEXT_PUBLIC_MOCK_DELAY` can be used to simulate network latency.

## 4. How to Add a New Component

This step-by-step guide will walk you through creating and integrating a new component.

### Step 1: Determine the Component's Location

First, decide where the component should live:

- Is it a generic, highly reusable UI element (like a special button, input, or card)?
  - **Place it in `src/@core/components/`**.
- Is it a component shared across a few pages but specific to a certain feature (e.g., a `UserProfileHeader`)?
  - **Place it in `src/components/`**.
- Is it a large component that composes an entire page section?
  - **Place it in `src/views/`**.

### Step 2: Create the Component File

Let's create a new feature-specific component: `OrderStatusChip`.

Create the file: `src/components/OrderStatusChip.jsx`

### Step 3: Write the Component Logic

Use React and MUI components to build your component. Apply styles using the `sx` prop for MUI-based styling or `className` for Tailwind CSS.

```jsx
// src/components/OrderStatusChip.jsx

import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

// Define styles using MUI's styled utility for complex variants
const StyledChip = styled(Chip)(({ theme, ownerState }) => ({
  fontWeight: 500,
  ...(ownerState.status === 'delivered' && {
    color: theme.palette.success.main,
    backgroundColor: theme.palette.success.light,
  }),
  ...(ownerState.status === 'pending' && {
    color: theme.palette.warning.main,
    backgroundColor: theme.palette.warning.light,
  }),
}));

const OrderStatusChip = ({ status }) => {
  const ownerState = { status };

  return <StyledChip label={status} ownerState={ownerState} />;
};

export default OrderStatusChip;
```

### Step 4: Export and Use the Component

To make imports cleaner, export the new component from an `index.js` file in its parent directory.

```javascript
// src/components/index.js
export { default as OrderStatusChip } from './OrderStatusChip';
// ... other exports
```

Now, you can import and use it in any page or view:

```jsx
// src/views/dashboard/RecentOrdersTable.jsx

import { OrderStatusChip } from '@/components';

// ... inside the component
<TableCell>
  <OrderStatusChip status={order.status} />
</TableCell>
```

This structured approach ensures that the project remains organized, maintainable, and easy for new developers to understand.

