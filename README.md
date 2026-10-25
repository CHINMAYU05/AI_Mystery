# AI Mystery Room

Casefile is a fictional detective experience built from the requirements in `spec.md`. Players create an investigation, compare suspect statements and evidence, reconstruct the timeline, and submit one final accusation. The canonical answer stays on the server until that accusation is recorded.

## Stack

- React 19 and Vite
- Node.js and Express 5
- MongoDB with Mongoose
- Zod request and generated-case validation
- Google Gen AI SDK (Interactions API) for optional Gemini generation
- Vitest and Supertest dependencies for automated checks

## Local setup

Requirements: Node.js 20+ and MongoDB 7+ (local or hosted).

1. Copy `.env.example` to `.env`.
2. Keep `AI_PROVIDER=mock` for deterministic local cases, or set `AI_PROVIDER=gemini` and add a Gemini API key.
3. Set a random `CASE_ACCESS_SECRET` of at least 32 characters for any shared deployment.
4. Install pinned dependencies and start the client and API:

```sh
npm install
npm run dev
```

The Vite client is at `http://localhost:5173`; Express listens on port `5000`. MongoDB must be available at `MONGODB_URI`. For a production client bundle, run `npm run build`; serve `dist/` from a static host and run `npm start` for the API. Configure `CLIENT_ORIGIN` to the exact client origin.

## API

All endpoints use `/api/v1`. Creating a case returns a high-entropy bearer access capability once; the browser keeps it in session storage and sends it in the `Authorization` header. The database stores only its hash.

- `GET /health` — service check (`/api/v1/health`)
- `POST /cases` — validate a premise and start generation
- `GET /cases/:caseId/status` — safe generation status
- `GET /cases/:caseId` — public case data only
- `POST /cases/:caseId/accusation` — record the first accusation and return the reveal
- `GET /cases/:caseId/reveal` — retrieve the reveal after completion

## Generation and solution privacy

Mock generation is the default and requires no AI credentials. Gemini is isolated behind a provider adapter; output must pass the versioned Zod contract and cross-reference checks, with no more than two bounded repair attempts. Generated remote media URLs are rejected, and the interface labels text simulations and image descriptions accurately.

Public investigation data and private solution data use separate MongoDB collections. Explicit response DTOs keep the culprit ID, solution, clue roles, raw model output, and access-token hash out of pre-accusation responses. An atomic state-conditional Mongo update preserves the first accusation.

## Checks

```sh
npm test
npm run lint
npm run build
```

Automated tests use deterministic mock data; the test suite does not call Gemini. The server integration currently requires a running MongoDB instance. This MVP stores investigator notes in browser local storage and intentionally does not include accounts, retry-generation, actual image/video creation, or multiplayer.
