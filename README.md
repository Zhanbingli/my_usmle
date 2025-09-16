# Medical AI Platform

A modern web application that brings together literature research, case-based training, and multi-model medical agents. The project combines a React/TypeScript front end with Firebase Cloud Functions and integrates external APIs such as Google Gemini, OpenAI, Claude, and PubMed.

## Highlights

- **Unified Agent Workspace** – configurable provider, model, and reasoning mode with conversation history, structured responses, and tool-trace visibility.
- **PubMed Integration** – advanced search filters, article detail views, and saved-article support.
- **Interactive Case Training** – step-by-step diagnosis workflow with feedback and statistics.
- **User Dashboard** – authentication, profile management, and learning analytics.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm (or yarn/pnpm)
- Firebase CLI (for deploying functions)

### Installation

```bash
git clone <repository-url>
cd usmle_test
npm install
```

### Environment Variables

Copy the template and supply your keys:

```bash
cp env.example .env.local
```

`.env.local` must contain the API keys you plan to use. At minimum:

```bash
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key   # optional, enables GPT-4o agent mode
CLAUDE_API_KEY=your_claude_key   # optional, enables Claude agent mode
FIREBASE_PROJECT_ID=your_project
```

If a provider key is missing, the agent workspace gracefully falls back to mocks or returns a configuration warning.

### Run in Development

```bash
# start React and local Firebase functions
npm run dev

# alternatively, start front end only
npm start

# run only the local functions server
npm run server:dev
```

The front end is served at `http://localhost:3000`; the local API runs on `http://localhost:3001`.

## Project Structure

```
src/
├── features/
│   └── agent/          # provider configuration, hooks, and UI components
├── pages/              # route-level screens
├── components/         # shared UI (layout, charts, forms)
├── api/                # HTTP clients and endpoint wrappers
├── hooks/              # reusable data/query hooks
└── utils/              # helpers (auth, storage, formatting)

functions/              # Firebase Cloud Functions (Express app + controllers)
public/                 # static assets
```

## Key Scripts

```bash
npm run dev          # front end + local functions
npm run build        # production build
npm run type-check   # TypeScript diagnostics
npm test             # CRA test runner
```

## Backend Notes

- Functions are written in TypeScript-friendly JavaScript and bundled by Firebase.
- `functions/controllers/agentController.js` routes agent calls to Gemini/OpenAI/Claude; tool calls (PubMed search, case queries) are available to all providers.
- Firestore stores sessions, case attempts, and analytics; ensure you configure security rules before production use.

## Deployment

1. Build the front end: `npm run build`.
2. Deploy Firebase functions/hosting (example):
   ```bash
   firebase deploy --only functions,hosting
   ```
3. Configure environment variables for each provider in your hosting platform (or via Firebase secrets).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-update`)
3. Commit changes (`git commit -m "feat: add my update"`)
4. Push and open a Pull Request

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.

---

Maintained by the Medical AI Platform team. Contributions and issue reports are welcome.
