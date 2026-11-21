# dor2500.github.io

Portfolio site for [github.com/dor2500](https://github.com/dor2500): the two flagship projects (Israel TV+ and Pulse) and an explorer for every other public repo. English and Hebrew (RTL).

Live: https://dor2500.github.io/

## Stack
Vite, React, TypeScript, Tailwind CSS v4 and Motion. Project data and screenshots are snapshotted from the GitHub API at build time, so the site makes no API calls at runtime.

## Commands
```sh
npm install
npm run data     # refresh src/data/github.json and public/shots from GitHub (uses gh auth or $GITHUB_TOKEN)
npm run dev      # http://localhost:5180
sh scripts/deploy.sh   # build and push dist/ to the gh-pages branch
```

Taglines, categories, platforms and stack tags for each repo live in `src/data/curated.ts`. New repos only appear once they have an entry there.
