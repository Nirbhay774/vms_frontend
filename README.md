# Payout Management Frontend

A modern, responsive dashboard for managing payouts, built with Next.js.

## 🚀 Quick Start (Under 5 Minutes)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- Payout Management Backend (Running at http://localhost:5000)

### 2. Setup
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
touch .env.local
```
Update the `.env.local` file with the backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 4. Run the Application
#### Development Mode (with hot-reload):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Mode:
```bash
npm run build
npm start
```

## 🛠 Tech Stack
- **Next.js 16**: React framework for production
- **TypeScript**: Static typing for robust code
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Compiler**: Optimized rendering performance

## 📂 Project Structure
- `src/app`: Next.js App Router (pages and layouts)
- `src/components`: Reusable UI components
- `src/services`: API client and data fetching logic
- `src/types`: TypeScript interfaces and types
- `src/utils`: Utility functions and formatting helpers

## 🎨 Design System
The project uses a clean, professional design system with:
- Dark mode support
- Responsive layouts
- Shared UI components (Button, Input, Table, etc.)
- Consistent spacing and typography
