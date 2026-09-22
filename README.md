# QRFlex — Professional QR Code Generator & Designer Studio

[![Live Demo](https://img.shields.io/badge/demo-live%20on%20vercel-blueviolet?style=for-the-badge&logo=vercel)](https://qr-code-designer.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> A state-of-the-art, privacy-respecting, real-time QR Code Generator and Designer built with React, Vite, TypeScript, and Tailwind CSS. Craft pixel-perfect vector (SVG) and raster (PNG) QR codes with live scannability contrast verification and instant persistence.

---

## 🚀 Live Demo & Visual Showcase

- **Live Deployment URL**: https://qrflex-hazel.vercel.app/

```
+---------------------------------------------------------------------------------------+
|  [QRFlex Pro Studio]                                [Recent (4)]  [Dark / Light Mode] |
+---------------------------------------------------------------------------------------+
|                                                           |                           |
|  1. SELECT TYPE                                           |   REAL-TIME PREVIEW       |
|  [ URL ] [ Plain Text ] [ Email ] [ Phone ] [ Wi-Fi ]     |   +-------------------+   |
|                                                           |   | █▀▀▀█ █ █ █ █▀▀▀█ |   |
|  2. FORM DATA & REAL-TIME VALIDATION                      |   | █   █ ▄ ▄▀▄ █   █ |   |
|  Target URL / SSID / Key with instant error badges        |   | ▀▀▀▀▀ ▀ ▀ ▀ ▀▀▀▀▀ |   |
|                                                           |   +-------------------+   |
|  3. STYLE PRESETS                                         |                           |
|  [Classic Mono] [Emerald Mint] [Neon Cyber] [Indigo]     |   ✓ High Scan Reliability |
|                                                           |     Contrast 15.2:1       |
|  4. CUSTOMIZATION CONTROLS                                |                           |
|  - Dimension Slider (160px - 420px)                       |   [ Download PNG ]        |
|  - Foreground & Background Hex Pickers                    |   [ Download SVG ]        |
|  - Margin / Quiet Zone (0 - 6 blocks)                     |   [ Copy Image ]          |
|  - Error Correction Level (L, M, Q, H)                    |   [ Copy Payload ]        |
+---------------------------------------------------------------------------------------+
```

---

## ✨ Features Checklist

### Phase 1: Project Initialization & UI Shell
- [x] **Modern Aesthetic**: Sleek glassmorphic dark mode default with subtle vibrant purple (`#8b5cf6`) and emerald green (`#10b981`) accents.
- [x] **Responsive Grid**: Ergonomic two-column layout on desktop (Configuration left, Live Preview right) that fluidly stacks vertically on mobile screens.
- [x] **Clean Navigation**: Brand header with live status badge, quick drawer trigger, and smooth animations.
- [x] **Icons**: High-clarity iconography powered by `lucide-react`.

### Phase 2: Form Handling & Validation Engine
- [x] **Multiple Input Types**:
  - 🌐 **Website URL**: Automatic protocol handling and hostname validation.
  - 📝 **Plain Text**: Character counters and multi-line formatting up to 2,500 chars.
  - ✉️ **Email**: RFC-compliant recipient validation with optional Subject and Body encoding (`mailto:`).
  - 📞 **Phone Number**: International phone format / E.164 compliance (`tel:`).
  - 📶 **Wi-Fi Network**: SSID, Authentication type (`WPA/WPA2`, `WEP`, `nopass`), Password toggle visibility, and Hidden SSID flag (`WIFI:T:...;S:...;P:...;H:...;;`).
- [x] **Strict Inline Validation**: Real-time feedback with distinct inline alert badges and automated payload string serialization.

### Phase 3: The QR Engine & Customization
- [x] **Real-Time Rendering**: Zero-latency live updates powered by `qrcode.react`.
- [x] **Precise Sizing**: Continuous slider control ranging from 160px to 420px.
- [x] **Color Customization**: Dual color pickers (foreground modules & background canvas) with hex code inputs and quick resets.
- [x] **Quiet Zone / Margin Control**: Configurable padding slider (0 to 6 blocks) ensuring compliance with ISO/IEC 18004.
- [x] **Error Correction Levels**: Instant toggles across `L` (7%), `M` (15%), `Q` (25%), and `H` (30%).

### Phase 4: Presets, Scannability & UX Polish
- [x] **Visual Style Presets**: 4 curated design templates:
  1. *Classic Mono*: Timeless 100% scannable black and white.
  2. *Emerald Mint*: Fresh, contemporary corporate branding.
  3. *Neon Cyber*: Futuristic dark slate with electric purple modules.
  4. *Electric Indigo*: Tech executive aesthetic with deep indigo modules.
- [x] **Scan Reliability Analyzer**:
  - Algorithmic WCAG 2.1 relative luminance calculation.
  - Real-time contrast ratio evaluation ($Ratio = (L_1 + 0.05) / (L_2 + 0.05)$).
  - Inverted polarity detection: displays warning banner when background is darker than foreground modules to avoid scanner decoder failures.
- [x] **Full Dark / Light Theme**: Complete app-wide theme toggle with persistent user preference storage.

### Phase 5: Local Storage & Exporting
- [x] **Local Storage History**:
  - Automatically records generated codes with payload, type, title, and design parameters.
  - Interactive sliding drawer displaying miniature live QR previews and timestamp.
  - Single-click restore that reloads the exact configuration and inputs.
  - Delete individual records or one-click "Clear All".
- [x] **High-Fidelity Exports**:
  - 📥 **Download PNG**: Razor-sharp raster image matching selected canvas dimensions and margins.
  - 📐 **Download SVG**: Infinitely scalable vector markup for commercial print and vector editing.
  - 📋 **Copy to Clipboard**: Instant PNG image clipboard copy for fast pasting into Figma, Slack, or Docs.
  - 🔗 **Copy Payload**: Instant clipboard copying of the raw encoded string.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) with [TypeScript 5](https://www.typescriptlang.org/) |
| **Bundler** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) with Custom CSS Variables |
| **QR Engine** | [qrcode.react](https://github.com/zpao/qrcode.react) (Canvas & SVG renderers) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Storage** | Browser `localStorage` API |

---

## 📦 Local Setup Instructions

Follow these steps to run the application locally on your machine:

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm, yarn, or pnpm

### 1. Clone or navigate to the repository
```bash
git clone https://github.com/your-username/qr-code-designer.git
cd qr-code-designer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser and navigate to the local URL shown in terminal (typically `http://localhost:5173`).

### 4. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

### 5. Preview production build locally
```bash
npm run preview
```

---

## 🧪 Testing & Verification

### Wi-Fi QR Code Verification
1. Select the **Wi-Fi** tab.
2. Enter your network SSID and WPA password.
3. Aim your iOS or Android camera at the QR code; the device automatically detects the `WIFI:` payload and prompts: *"Join Network [SSID]"*.

### Contrast & Scannability Reliability
1. Set the background to dark `#0f172a` and foreground to `#ffffff`.
2. Notice the **Scan Reliability Notice** alerting about inverted polarity.
3. Lower contrast to `#444444` and `#555555`; observe the high-priority warning banner preventing unreadable code generation.

---

## 📄 License
Released under the [MIT License](LICENSE). Free for personal and commercial use.
