# MVP architecture decisions

- Keep the only input as a user-provided fictional premise; use server-side configuration and validation before model access.
- Persist the public case and private canonical solution in separate collections. Public DTO construction is explicit.
- Use a high-entropy bearer capability for private case access. Return it only during creation, persist only its SHA-256 keyed hash, and keep it in browser session storage.
- Make mock generation the default so local development and automated checks do not require provider credentials. Gemini is an interchangeable backend adapter.
- Use the current Google Gen AI Interactions API and structured JSON response format for Gemini; keep Zod validation as the publication gate.
- Use asynchronous generation records and status polling; publish `ready` only after schema and reference checks succeed.
- Keep investigator notes local to the browser and label simulated evidence instead of implying real integrations or media.

## Known MVP limitations

- Semantic fair-play validation is structural and cross-reference based; generated cases still require product review before broad release.
- Without MongoDB available, the API intentionally fails at startup rather than silently switching to volatile storage.
- No production hosting, account system, or generated image/video service is configured.
