# MindShift AI

A personalized AI recovery coach for phone, social media, gaming, smoking, alcohol, and other habits you're ready to change — one that actually knows your triggers, not a generic chatbot.

## Features

- **Personalized Assessment**: Custom habit evaluation with AI-powered insights
- **AI Coach**: Private, on-device conversations that adapt to your history and triggers
- **Emergency Support**: Instant, personalized plans for cravings and high-risk moments
- **Progress Tracking**: Visual streaks, recovery scores, and monthly trends
- **Journaling**: Analyze entries to identify patterns, triggers, and lessons
- **Recovery Blueprint**: Personalized daily routines and weekly goals based on your assessment
- **100% Private**: All data stored locally on your device - nothing leaves your browser

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. **Update repository name** (if needed):
   Open `vite.config.ts` and update the `REPO_NAME` constant to match your GitHub repository name:
   ```typescript
   const REPO_NAME = 'your-repo-name' // e.g., 'mindshift-ai'
   ```

2. **Build and deploy**:
   ```bash
   # Build the project
   npm run build

   # Deploy to GitHub Pages (requires gh-pages package)
   # Install gh-pages first if needed: npm install --save-dev gh-pages
   ngh --dir dist
   ```

   Alternatively, you can manually push the contents of the `dist` folder to the `gh-pages` branch.

3. **GitHub Actions** (optional):
   You can set up automatic deployment using GitHub Actions with a workflow like:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
├── constants/        # Application constants (habits, assessment schema, etc.)
├── hooks/            # Custom React hooks
├── pages/            # Page components (Landing, Dashboard, Coach, etc.)
├── prompts/          # AI prompt templates
├── services/         # Business logic (AI, recovery planner, storage, etc.)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Technologies

- **React 19** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** with **Zod** for form validation
- **Lucide Icons** for beautiful SVG icons
- **Sonner** for toast notifications
- **Oxlint** for code quality

## Privacy First

MindShift AI is designed with privacy as a core principle:
- All data is stored locally in your browser's localStorage
- No data is ever sent to external servers
- Your habit tracking, journal entries, and conversations remain completely private
- The AI runs entirely on-device using deterministic templates (no API calls)

## License

This project is open source and available under the MIT License.