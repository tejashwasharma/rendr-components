# AGENTS.md

Guidance for AI coding agents working in this repository (`rendr-components`).

## What this project is

A universal React component library — one codebase renders on iOS, Android and the web — built on React Native primitives with `styled-components/native` (web via `react-native-web`). Ships glass UI by default (see `docs/GLASS.md`), a fully overridable theme, and a Storybook docs site with a live code editor, deployed at https://rendr-components.web.app.

Full usage docs: [`README.md`](README.md). Design rationale for the glass surfaces and motion system: [`docs/GLASS.md`](docs/GLASS.md).

## Commands

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run lint         # eslint
npm test             # jest + @testing-library/react-native
npm run build         # react-native-builder-bob → lib/{commonjs,module,typescript}
npm run storybook      # dev server with Controls + Live Code panels
npm run storybook:build
npm run deploy          # builds Storybook and deploys to Firebase Hosting
```

Run `typecheck`, `lint`, and `test` before considering any change done. `npm run build` should also succeed before publishing.

## Secrets and environment

Firebase web config (for the Storybook docs site's analytics only — **not** used by the published `rendr-components` package) lives in `.env`, git-ignored. `.env.example` documents the required keys; copy it to `.env` and fill in from the Firebase console. These are public web SDK keys (Firebase restricts access via security rules, not secrecy) but are still kept out of git as ordinary environment config, not hard-coded. **Never commit `.env`, and never hard-code API keys, tokens, or credentials directly in source** — if a task seems to need that, stop and ask first.

## Conventions

- **Theme tokens only.** Components never hard-code colors, spacing, or other visual values — everything comes from `theme.*` (see `src/theme/tokens.ts`). An ESLint rule enforces no literal hex colors in `*.styles.ts` files.
- **The `Surface` primitive** (`src/components/Surface/Surface.tsx`) is the *only* place the glass recipe (fill, blur, rim, shadow) lives. Every surface-bearing component (Card, Modal, Menu, Select, Popover, Toast, Tabs, Table, Accordion) renders through it — don't reimplement glass styling elsewhere.
- **Every component** forwards `ref` and accepts a polymorphic `as` prop (see `src/utils/polymorphic.ts`).
- **Motion**: three durations only — `fast` (hover/press), `normal` (open/close, sliding selection pills), `theme` (glass/mode switch) — from `theme.durations`. No hover lifts/translates; state changes use color/shadow transitions or the sliding-pill pattern (`useSlidingIndicator`).
- New components get: `.tsx`, `.styles.ts` (if needed), `.types.ts`, `.test.tsx`, `.stories.tsx` (with a Controls-friendly `argTypes` and at least one `parameters.code` Live Code example — see `.storybook/argTypes.ts` for the shared helpers).
- Before deploying Storybook, verify the **production build** in an actual browser (`npm run storybook:build` then serve `storybook-static`, e.g. `firebase serve --only hosting` or any static server) — `npm run storybook` (Vite dev server) can hide bundling-only bugs that only surface in the production bundle (see the `require is not defined` note in `docs/GLASS.md`).

## Git practice

*(Inherited from this project's original home under `~/Documents/Projects/AGENTS.md`; restated here since this repo now stands alone on GitHub.)*

**Never commit, create a branch, push, or rewrite history without explicit approval.**

- Do not run `git commit`, `git branch` / `git checkout -b` / `git switch -c` (creating a new branch), `git push`, `git rebase`, `git reset --hard`, `git commit --amend`, or force-push unless the user has asked for that specific action in the current conversation. Committing and creating a branch are separate approvals — approval for one is not approval for the other.
- Making code changes, running builds, and running tests are fine without asking. Stop at a clean working tree and report what changed; let the user review the diff.
- When approval is given, it covers that one action. A "yes" to committing is not a "yes" to pushing, and approval in one turn does not carry to later changes.
- Never force-push or merge without explicit approval, regardless of identity below.
- Write commits as the repo's configured author. Do not add extra trailers or co-authors unless the user asks.

### Branch naming

Once branch creation is approved, name it `<type>/short-name`: `feat/` (new feature), `fix/` (bug fix), `chore/` (maintenance/tooling, no behavior change), `bump/` (dependency or version bump) — pick whichever prefix matches the work. Other conventional types (`docs/`, `refactor/`, `test/`) are fine when they fit better.

### Push destination depends on the GitHub identity behind the commit

- If the commit's GitHub identity is **tejashwasharma**, a push can go directly to `main`/`master` once the user has approved the push — no feature branch or PR required.
- If the commit's GitHub identity is anyone else, never push to `main`/`master` directly. Starting a new task means starting a new branch first (named per the convention above), then push and open a PR from that branch.

## Deploys and other outward-facing actions

Treat `firebase deploy`, `npm publish`, GitHub releases, and anything that changes a live/hosted target the same way as git actions above: get explicit approval first, and confirm the change worked (open the deployed URL / check the published version) rather than assuming success from a clean command exit.
