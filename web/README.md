# Italian Corner frontend

React and Vite employee portal, with English and Arabic (including right-to-left layout).

## Current milestone

- Clerk sign-in and account menu, using the same Clerk application as the API.
- A signed-in account screen that verifies the session through `GET /api/me`.
- Loading, expired-session, unavailable-service, and retry states.
- Language selection remembered on this browser.
- A locally bundled Arabic font; no external font service.
- Frontend lint, behavior tests, and production build in GitHub Actions.

The order dashboard and department pages will be added alongside their API endpoints.
Department authorization must be enforced by the API before it returns order data.
The Clerk application must use restricted (invite-only) sign-up; hiding sign-up controls
in the frontend is not an authorization policy.

## Local development

Use Node.js 24. Install dependencies with `npm ci`, then run `npm run dev`
from this directory. Start the API separately on port 5000.

The frontend runs at **http://localhost:5173**. It requires that exact port to match
the API's Clerk authorized party. Vite forwards `/api/*` requests to
`http://localhost:5000`. This proxy is for local development only.

Set `VITE_CLERK_PUBLISHABLE_KEY` in an ignored `.env.local` file, using the
publishable key from the API's Clerk application. A template is in `.env.example`.
All `VITE_` values are browser-visible: never add secret keys or Google credentials.

## Checks

- `npm run lint`
- `npm test`
- `npm run build`

Tests mock Clerk session state and network responses; they do not contact Clerk
or Google Sheets and do not need credentials. Browser verification still needs
a real employee sign-in. After signing in, the account screen should say
**Account connected** (or **تم ربط حسابك**) only after the API returns the same user ID.

Production files are generated in `dist/`. The publishable key is embedded at
build time; the CI build is a compilation check and deliberately has no live key.
An actual deployment must supply the intended public key when building and route
`/api` to the API service. Production hosting, containers, and deployment are
separate milestones.

## References

- [Clerk React setup](https://clerk.com/docs/react/getting-started/quickstart)
- [Clerk localization](https://clerk.com/docs/guides/customizing-clerk/localization)
- [Vite development proxy](https://vite.dev/config/server-options#server-proxy)
