# Environment and tools

- Session: Windows desktop, not the managed Linux Cloud environment described in the supplied prompt. OS API returned Microsoft Windows 10.0.26200, X64; PowerShell; Node v24.20.0; npm/npx 11.19.0; Git 2.56.0.windows.2.
- Initial chat directory contained only outputs/ and work/; git status and rev-parse failed because there was no checkout. No pre-existing application was changed. The user supplied KennyPVTHax/landingpage. It was inspected via the GitHub connector and cloned into work/repository. main initially contained only README.md at 48968034045f953df13beb9955ed47c89f5e2ef4; clean status; no AGENTS.md. Project is transferred to its dedicated repository root.
- npm registry connectivity verified via npm view and actual installation. GitHub verified via connector, README access, git ls-remote and clone. Google Play returned HTTP 200 in actual Chromium. Image/font downloads succeeded with ordinary public access.
- npx playwright install chromium succeeded. A real launch, DOM inspection and screenshots succeeded using Chromium 156.0.8078.4. Linux dependency installation did not apply. Browser cache is outside the source distribution in the normal per-user Playwright cache.
- Agent Browser 0.39.2 installed locally. Initial auto-launch failed (Chrome not found); retry with --executable-path pointing to the newly downloaded Chrome for Testing succeeded. It opened the real listing and saved artifacts/reference/agent-browser-reference.png, then was closed. No unrelated browser profile was used.
- npm 11 reported that Agent Browser's postinstall was not allowlisted. Its native CLI still ran successfully; no installation success was inferred from package metadata alone.
- Project-local skills installed with the bundled skill-installer helper using --dest .agents/skills: vercel-labs/agent-browser skills/agent-browser, vercel-labs/agent-skills skills/web-design-guidelines and skills/react-best-practices. Their SKILL.md instructions were read, and Agent Browser core instructions obtained from its installed CLI. React and accessibility guidance informed the implementation. Vercel's current web interface guidelines were fetched from its official GitHub source. No global skills or Codex configuration were changed. Local installed skills are excluded from distribution; installation sources are recorded here.
- Chrome DevTools MCP and Playwright MCP READMEs were inspected at their official GitHub repositories. They are not active tools in this session. Optional MCP configuration was not added because it would modify user-wide settings and duplicate direct Playwright/CDP. Direct computed-style/geometry inspection and CDP touch input were the verified fallbacks.
- Web-reader access to the locale-specific Play URL failed; direct Chromium succeeded. No bypass, credentials, cookies or private API access was used.
- Preview is loopback only. No externally reachable preview, cloud tunnel, merge or deployment was created.

## Exact direct package versions

| Package | Version |
| --- | --- |
| @axe-core/playwright | 4.14.0 |
| @playwright/test | 1.64.1 |
| @types/pngjs | 6.0.5 |
| @types/react | 19.3.0 |
| @types/react-dom | 19.3.0 |
| @vitejs/plugin-react | 6.1.2 |
| agent-browser | 0.39.2 |
| pixelmatch | 8.0.0 |
| pngjs | 7.0.0 |
| prettier | 3.9.10 |
| react | 19.3.1 |
| react-dom | 19.3.1 |
| typescript | 7.0.2 |
| vite | 8.3.5 |

The lockfile pins transitive dependencies. npm install reported zero vulnerabilities. Browser automation and GitHub connector were available; no Linux/cloud runtime was inferred from the document's wording.
