# Contagent — AI Content Engine

> Multi-model AI content generation dashboard with automatic failover across Gemini, Grok, and OpenRouter.

🚀 **Live Demo:** [contagent.vercel.app](https://contagent.vercel.app)

---

## What is Contagent?

Contagent is a React-based AI content generation dashboard that lets you generate content using multiple AI providers simultaneously. It features **automatic failover** — if one provider fails or is unavailable, the app seamlessly falls back to the next available model, so you're never left without a response.

---

## Features

- **Multi-model support** — integrates with Gemini, Grok, and OpenRouter in a single interface
- **Automatic failover** — if a provider is down or rate-limited, requests are rerouted automatically
- **Content dashboard** — clean UI for managing and reviewing generated outputs
- **Data visualization** — charts and analytics powered by Recharts
- **Routing** — multi-page navigation via React Router
- **State management** — Redux for predictable app state
- **Dark theme** — FOUC-free dark UI out of the box

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| State | Redux + React-Redux |
| Routing | React Router v7 |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for the AI providers you want to use (Gemini, Grok, OpenRouter)

### Installation

```bash
# Clone the repo
git clone https://github.com/Mad-iii/Contagent.git
cd Contagent

# Install dependencies
npm install
```

### Configuration

Copy or create a `.env` file in the root directory and add your API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_GROK_API_KEY=your_grok_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_key_here
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Project Structure
Contagent/
├── src/               # Application source code
├── index.html         # App entry point
├── handshake.js       # Provider connection / API handshake logic
├── vite.config.js     # Vite configuration
├── package.json       # Dependencies and scripts
└── .gitignore

---

## Deployment

The project is deployed on **Vercel**. Any push to `main` triggers an automatic redeploy.

To deploy your own fork:

1. Import the repo into [Vercel](https://vercel.com)
2. Add your environment variables in the Vercel project settings
3. Deploy

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## License

This project is open source. Feel free to use and modify it.
