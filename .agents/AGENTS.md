# Build and Process Rules

1. Never run `npm run build` or `next build` unless explicitly asked.
2. Never start another `npm run dev`.
3. Assume the development server is already running.
4. Never verify changes by running a build automatically.
5. Only modify source code.
6. For verification, simply tell the user: "Code changes are complete. Please refresh your browser."
7. If production verification is explicitly requested, only run `npm run build` after confirming the dev server is stopped.
8. Never leave build tasks running in the background.
9. Never launch parallel Node.js processes.
10. Never create concurrent writes inside the `.next` directory.
11. Never perform automatic environment cleanup unless requested.
12. If another Node process is detected, stop and ask the user before killing it.
