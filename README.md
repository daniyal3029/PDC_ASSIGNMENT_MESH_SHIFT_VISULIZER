# Mesh Circular Shift Visualizer

Interactive web application to simulate and visualize circular q-shift operations on 2D mesh topologies in parallel computing.

## Live Demo

**Deployed URL:** [https://mesh-shift-visualizer.netlify.app](https://mesh-shift-visualizer.netlify.app)

## Overview

In parallel computing, a **circular q-shift** is a permutation where node `i` sends its data to node `(i + q) mod p`. On a 2D mesh topology, this is efficiently implemented in two stages:

1. **Stage 1 — Row Shift**: Each node shifts within its row by `(q mod √p)` positions
2. **Stage 2 — Column Shift**: Each node shifts within its column by `⌊q / √p⌋` positions

This application provides an interactive visualization of this algorithm, including step-by-step animation with directional arrows and a real-time complexity analysis panel.

## Features

- **Interactive Controls**: Configure `p` (4–64, perfect squares only) and `q` (1 to p−1) with validation
- **Animated Visualization**: Step-by-step animation — Initial → Row Shift → Column Shift → Final
- **Directional Arrows**: Color-coded SVG arrows showing data movement direction with wrap-around detection
- **Before/After Comparison**: Three-way comparison showing Initial → After Row Shift → Final State
- **Complexity Analysis Panel**: Real-time formula computation, bar charts, and efficiency comparison
- **Comparison Table**: Pre-computed results for p=16,64 and q=3,5,7
- **Responsive Design**: Full 3-column desktop layout + mobile-friendly single-column

## Tech Stack

- **Framework**: React 19 (via Vite)
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS with custom properties (dark glassmorphism theme)
- **Fonts**: Inter + JetBrains Mono (Google Fonts)
- **Deployment**: Netlify / Vercel / GitHub Pages

## Project Structure

```
mesh-shift-visualizer/
│── public/
│── src/
│   ├── components/
│   │   ├── MeshGrid.jsx        ← grid rendering + animation
│   │   ├── MeshGrid.css
│   │   ├── ControlPanel.jsx    ← user inputs + validation
│   │   ├── ControlPanel.css
│   │   ├── ComplexityPanel.jsx  ← analysis panel
│   │   └── ComplexityPanel.css
│   ├── utils/
│   │   └── shiftLogic.js       ← pure shift algorithm (testable)
│   ├── App.jsx
│   ├── App.css
│   ├── index.css               ← global design tokens
│   ├── main.jsx
│   └── index.js
│── index.html
│── README.md
│── package.json
│── vite.config.js
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9

### Install & Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mesh-shift-visualizer.git
cd mesh-shift-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```
Then open `http://localhost:5173/` in your browser.

### Build for Production

```bash
npm run build
```
Output will be in the `dist/` folder, ready for static hosting.

### Preview Production Build

```bash
npm run preview
```

## Contributing

To contribute to this project, please follow these steps:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with a clear and descriptive message.
4. Open a pull request and wait for review.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
