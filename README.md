# VALDORA - SaaS E-commerce Platform Frontend

![VALDORA Banner](https://user-images.githubusercontent.com/835954/233832011-8e77369e-1f3a-4f8a-9e8a-133249a37e9b.png)

Welcome to the frontend repository for VALDORA, a next-generation SaaS platform for building and managing AI-powered e-commerce stores. This project is built with Next.js, Material-UI, and Redux Toolkit, featuring a modern, scalable, and developer-friendly architecture.

## ✨ Key Features

- **Modern Tech Stack**: Next.js 14 (App Router) for a high-performance, server-first frontend.
- **Rich UI Components**: A comprehensive UI library built with Material-UI and styled with Tailwind CSS.
- **State Management**: Centralized and predictable state management using Redux Toolkit.
- **Responsive Design**: Fully responsive layouts that work on any device, from mobile to desktop.
- **Mock Data Service**: Develop and test features without a backend dependency using a configurable mock service.
- **Feature Flags**: Easily enable or disable features using environment variables.
- **Analytics Dashboard**: Visualize key metrics with a beautiful dashboard powered by Recharts.
- **Hierarchical Sidebar**: Intuitive navigation with a multi-level sidebar menu.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (v9.x or later)

### 1. Clone the Repository

```bash
gh repo clone sir-william/valdora valdora-frontend
cd valdora-frontend
```

### 2. Install Dependencies

This project uses `npm`. Install the required dependencies:

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
# This project does not have an example file, create it manually
cat > .env.local << 'EOF'
# Enable the mock data service for development
NEXT_PUBLIC_ENABLE_MOCKS=true

# Simulate network latency (in milliseconds)
NEXT_PUBLIC_MOCK_DELAY=500

# Base URL for the API (used when mocks are disabled)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SIDEBAR=true
NEXT_PUBLIC_DEBUG_MODE=true
EOF
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm start`: Starts a production server (requires `npm run build` first).
- `npm run lint`: Lints the codebase using ESLint.

## 🏗️ Build for Production

To create a production-ready build, run:

```bash
npm run build
```

This command generates a static export of the application in the `/out` directory, which can be deployed to any static hosting service.

## 📚 Developer Guide

For a deep dive into the project architecture, component structure, and contribution guidelines, please refer to the **[Comprehensive Developer Guide](DEVELOPER_GUIDE.md)**.

This guide covers:
- The full technology stack.
- A detailed breakdown of the project structure.
- Core architectural concepts (routing, styling, state management).
- A step-by-step tutorial on how to add new components.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feat/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

