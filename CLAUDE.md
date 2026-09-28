# DG32 v4 site

Static Next-compatible site (Vinext) published to GitHub Pages at
https://shekerkamma.github.io/deepgrid-dr-silicon-v4/. Independent repository.

## Build and verify

- `npm run typecheck`, then build with the same base path CI uses:
  `PAGES_BASE=/deepgrid-dr-silicon-v4/ NEXT_PUBLIC_PAGES_BASE=/deepgrid-dr-silicon-v4/ npm run build:pages`
  (runs the content and class checks, then packages `dist/pages`). Without both variables packaging fails
  with `Unprefixed link: /`. Never `npm run build` alone: it clears `dist/` without producing `dist/pages`.
- Read a build's exit code directly (`; echo "exit $?"`); a piped build hides failure.
- Serve the build the way Pages does:
  `python3 ~/.claude/skills/e2e-qa-review/scripts/serve_pages.py dist/pages deepgrid-dr-silicon-v4 8790`
- CI (`.github/workflows/pages.yml`) runs verify-routes and verify-nav before and after deploy.

## Design and content authority

- `DESIGN.md` owns colours, type (Newsreader display, Inter text, JetBrains Mono labels), layout and
  components. Use the CSS tokens in `app/v3.css` and `app/globals.css`; no raw hex, px or font stacks.
- The site is pre-silicon: every figure is a design or simulation value until bring-up. Never state one as
  measured silicon. No em dashes in copy.

## Visual development

### Quick visual check
Right after any front-end change, before saying it is done:
1. **List what changed** and the routes it affects (a shared file affects every route).
2. **Build** with `npm run build:pages` and serve as above.
3. **Open each affected route** with the Playwright MCP (`mcp__playwright__browser_navigate`) at 1440×900
   and again at 390×844 (`browser_resize`); take a screenshot at each width and look at it.
4. **Compare with `DESIGN.md`** and with what was asked for: tokens, type roles, spacing, the Don'ts.
5. **Check the console** (`browser_console_messages`) and failed requests: errors are defects.
6. **Say what you checked**, with the screenshot paths, and anything you could not check.

### Full design review
Run `/design-review` (or the `design-review` subagent) before pushing significant UI work to `main`:
it measures every affected route at 1440/768/390 with axe-core, runs the menu gate when navigation
changed, inspects the live pages and reports Blockers / High / Medium / Nitpicks with evidence.
The review is read-only; fixes happen afterwards, in this session.
