# 🟣 QueueFlow Pro

![Build Status](https://github.com/Akarshhegde99/QueueFlow-Pro/actions/workflows/verify.yml/badge.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)
![License](https://img.shields.io/badge/license-MIT-green)

**QueueFlow Pro** is an ultra-modern, secure digital entry management system designed for institutional campus access. It replaces manual logs with time-limited, encrypted QR tokens and dual-factor administrative approval.

---

## ✨ Key Features

-   **💎 Premium Aesthetics**: A minimalist, high-end light theme with glassmorphism, HSL color palettes, and fluid animations.
-   **🔐 Strict Role Isolation**: Completely separate portals for Students (User) and Staff (Admin).
-   **⏱️ Time-Sensitive Tokens**: Digital passes are strictly valid for 3 hours, ensuring maximum campus security.
-   **📱 QR LifeCycle**: Integrated QR code generator (students) and high-speed scanner (admins) with image upload support.
-   **⚡ Real-time Sync**: Powered by Socket.IO for instant pass status updates without manual refreshing.
-   **📜 Privacy-First**: Dedicated privacy compliance portal and minimal data collection protocols.
-   **🧪 CI/CD Ready**: Automated health check pipeline via GitHub Actions.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Lighting fast UI development.
- **Framer Motion**: Smooth, premium micro-animations.
- **Tailwind CSS**: Modern utility-first styling.
- **Lucide React**: High-quality SVG iconography.
- **html5-qrcode**: Robust browser-based QR scanning.

### Backend
- **Node.js & Express**: High-performance server logic.
- **Socket.IO**: Real-time bidirectional communication.
- **JWT & BCrypt**: Industry-standard authentication and password hashing.
- **JSON Persistence**: Lightweight, file-based data management for rapid deployment.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akarshhegde99/QueueFlow-Pro.git
   cd QueueFlow-Pro
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update your .env variables (JWT_SECRET, ADMIN_EMAIL, etc.)
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Set VITE_API_URL=http://localhost:5000
   npm run dev
   ```

---

## 🩺 CI/CD Health Checks

This project uses **GitHub Actions** to ensure code quality. Our `verify.yml` pipeline automatically performs:
- **Build Verification**: Ensures the React app is production-ready.
- **Security Audit**: Scans for vulnerabilities in backend packages.
- **Linting**: Maintains clean code standards.
- **Dependency Check**: Verifies that all modules install correctly.

---

## 🛡️ Security Architecture

QueueFlow Pro implements a **"Zero-Mistrust"** role policy:
- **Admin Gateway**: Accessible only through the discrete Staff Portal at `/admin/login`.
- **User Gateway**: Main entry point for students. 
- **Backend Guard**: Each API request is validated against the user's true role stored in the database, preventing role-escalation attacks.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ for secure campus management.**
