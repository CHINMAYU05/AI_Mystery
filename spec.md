# AI MYSTERY ROOM
## Product Requirements & Technical Specification

**Document Version:** 1.0.0  
**Status:** Initial Development Specification  
**Project Type:** AI-Powered Interactive Mystery Investigation Platform  
**Architecture:** MERN Stack  
**AI Provider:** Google Gemini  
**Primary Purpose:** Single source of truth for Codex and all development activities.

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is a web application that allows users to create and solve interactive mystery investigations using artificial intelligence.

Users provide a short scenario, premise, or story. The backend uses Google Gemini to transform that input into a complete fictional mystery investigation.

Each investigation contains:
- A case briefing.
- Multiple suspects.
- Suspect profiles and possible motives.
- Fictional chat conversations.
- Images and image descriptions.
- CCTV-style recordings, transcripts, or storyboards.
- Witness statements.
- Documents and other evidence.
- A chronological timeline.
- Red herrings and misleading clues.
- One canonical culprit.
- A final explanation connecting the evidence to the culprit.

The user investigates the case by reviewing the available evidence and comparing the suspects.

Once the investigation is complete, the user selects one suspect as the culprit.

The application evaluates the accusation and reveals the actual culprit, explains the motive, and shows how the evidence supports the solution.

## 1.2 Product Vision

Create an immersive, AI-powered detective experience in which every mystery is generated dynamically from the user's imagination.

The application should make users feel like detectives investigating a case rather than simply reading an AI-generated story.

## 1.3 Primary Objective

Build a reliable web application that generates fictional mysteries that are:
- Engaging.
- Internally consistent.
- Logically solvable.
- Supported by evidence.
- Interactive.
- Secure.
- Responsive across devices.

## 1.4 Target Users

The application is designed for:
- Mystery and detective-story enthusiasts.
- Casual gamers.
- Users interested in interactive storytelling.
- Users who enjoy logic puzzles and deduction games.
- Users who want to create personalized mystery scenarios.

## 1.5 MVP Scope

The first release must support:

1. Creating a mystery from a user-provided premise.
2. Generating a complete investigation using Gemini.
3. Presenting suspects and evidence.
4. Filtering and inspecting evidence.
5. Reviewing a case timeline.
6. Selecting a culprit.
7. Revealing the correct answer and explanation.
8. Handling generation failures gracefully.
9. Persisting cases in MongoDB.
10. Protecting the solution from being exposed before an accusation.

Authentication, multiplayer, subscriptions, and public leaderboards are outside the initial scope.

---

# 2. TECHNOLOGY STACK

The application MUST use the following technologies.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React | User interface and interaction |
| Frontend tooling | Vite | Development server and production builds |
| Styling | CSS Modules or an established project styling system | Component styling |
| Backend | Node.js | Server runtime |
| API framework | Express.js | REST API |
| Database | MongoDB | Persistent case storage |
| ODM | Mongoose | Database models and validation |
| AI | Google Gemini | Mystery and evidence generation |
| AI SDK | Official Google Gen AI SDK for Node.js | Backend model integration |
| Validation | Zod | Request and AI-output validation |
| Testing | Vitest and Supertest | Automated tests |
| Version control | Git | Source control |

### Technical Rules

1. The application MUST follow a client-server architecture.
2. Gemini MUST be accessed exclusively through the backend.
3. API credentials MUST never be exposed to the frontend.
4. All API inputs MUST be validated.
5. All AI-generated case data MUST be validated before publication.
6. The frontend MUST NOT contain database connection credentials.
7. The application MUST support mock AI generation for local development and automated testing.
8. Package versions MUST be pinned in the lockfile.
9. Existing repository conventions SHOULD be preserved when they are sound.

---

# 3. USER EXPERIENCE AND APPLICATION FLOW

## 3.1 Overall User Journey

The application follows this workflow:

**Step 1: Create a Mystery**

The user opens the home page and enters a short scenario.

Example:

"A priceless diamond disappears from a locked museum room during a private exhibition."

The user may configure the difficulty, tone, and preferred evidence types.

**Step 2: Generate the Investigation**

The frontend sends the premise and configuration to the backend.

The backend validates the request and asks Gemini to generate a complete investigation.

**Step 3: Validate the Case**

The backend validates the generated investigation for:
- Structural correctness.
- Suspect consistency.
- Evidence consistency.
- Timeline consistency.
- Uniqueness of the culprit.
- Logical solvability.

Invalid cases MUST NOT become playable.

**Step 4: Enter the Investigation Room**

The user sees the case briefing, suspect profiles, evidence board, and timeline.

**Step 5: Investigate**

The user examines evidence, compares statements, identifies contradictions, and forms a theory.

**Step 6: Make an Accusation**

The user selects one suspect and confirms the accusation.

**Step 7: Reveal the Solution**

The application displays whether the accusation was correct.

It then reveals the actual culprit and explains the evidence supporting the conclusion.

---

# 4. MYSTERY CREATION REQUIREMENTS

## 4.1 User Input

The mystery creation form MUST contain a required premise field.

### Required Field

**Premise**
- Minimum length: 30 characters after trimming.
- Maximum length: 2,000 characters.
- Empty or whitespace-only input MUST be rejected.
- The character limit MUST be enforced on both frontend and backend.

### Optional Configuration

| Field | Allowed Values | Default |
|---|---|---|
| Difficulty | Easy, Medium, Hard | Medium |
| Case Length | Short, Standard | Standard |
| Tone | Cozy, Noir, Thriller, Lighthearted | Noir |
| Language | English | English |
| Evidence Preferences | Chat, Image, CCTV, Document, Witness, Forensic | All |
| Content Preferences | Non-graphic and other supported restrictions | Non-graphic |

The interface MUST clearly display which settings are optional.

## 4.2 Difficulty Levels

### Easy
- Clear clues.
- Straightforward alibis.
- Fewer misleading interpretations.
- Direct connections between evidence and the culprit.

### Medium
- Multiple plausible suspects.
- Clues distributed across different evidence types.
- Some red herrings.
- Contradictions that require comparing evidence.

### Hard
- More subtle connections.
- Complex timelines.
- Interdependent clues.
- More convincing red herrings.

Hard difficulty MUST remain logically solvable.

## 4.3 Case Length

### Short
- 3 suspects.
- 5 evidence items.
- At least 4 timeline events.

### Standard
- 4–6 suspects.
- 7–10 evidence items.
- At least 5 timeline events.

These counts are generation targets and MUST be validated by the backend.

---

# 5. MYSTERY CASE STRUCTURE

Every playable mystery MUST contain the following components.

## 5.1 Case Briefing

The briefing introduces:
- The incident.
- The location.
- The relevant background.
- The circumstances surrounding the incident.
- The initial reason for the investigation.

The briefing MUST NOT reveal the culprit.

## 5.2 Suspects

Every case MUST have 3–6 suspects.

Each suspect MUST include:

| Field | Description |
|---|---|
| ID | Unique suspect identifier |
| Name | Fictional full name |
| Role | Relationship to the incident |
| Bio | Short background |
| Public Motive Hint | Reason the suspect may be investigated |
| Public Alibi | What the suspect claims to have been doing |
| Avatar Description | Optional description for an avatar |

The culprit MUST be one of the listed suspects.

Every suspect should have a plausible reason to be investigated.

The culprit's profile MUST NOT explicitly identify them as the culprit.

## 5.3 Evidence

Every case MUST contain 5–10 evidence items.

Supported evidence types:

1. Chat conversations.
2. Images.
3. CCTV-style evidence.
4. Documents.
5. Witness statements.
6. Forensic evidence.

Every evidence item MUST contain:

| Field | Description |
|---|---|
| ID | Unique evidence identifier |
| Type | Evidence category |
| Title | Short display title |
| Summary | Short description |
| Content | Full evidence content |
| Story Timestamp | Optional in-world timestamp |
| Source Label | Fictional source of evidence |
| Media Status | Actual media or simulation status |
| Linked Suspects | Suspects referenced by the evidence |

The backend MAY maintain additional private metadata, including clue classifications.

### Evidence Authenticity

All evidence is fictional.

A WhatsApp-style artifact is a simulated conversation, not a real WhatsApp integration.

A CCTV artifact may be a text transcript or storyboard.

The application MUST distinguish actual generated media from text simulations and media prompts.

The UI MUST NOT claim that an image or video exists when only a description has been generated.

## 5.4 Timeline

Every case MUST contain at least four chronological events.

Each event MUST contain:
- A unique identifier.
- A time label.
- An event description.
- References to related evidence items.

All timestamps and alibis MUST be consistent with the canonical solution.

## 5.5 Culprit and Solution

Every case MUST have exactly one canonical culprit.

The private solution MUST include:
- Culprit suspect ID.
- Motive.
- Method.
- Opportunity.
- Explanation of the incident.
- Evidence chain.
- Red-herring explanations.

The solution MUST be generated and validated before the case becomes playable.

The backend MUST NOT generate a new solution after the user submits an accusation.

## 5.6 Fair-Play Requirements

The backend MUST verify that:
- The culprit exists in the suspect list.
- Every referenced evidence item exists.
- The evidence chain supports the solution.
- The solution does not depend on undisclosed facts.
- Red herrings have plausible explanations.
- The timeline does not contradict the culprit's opportunity.
- Suspect identities and relationships remain consistent.
- There is one clearly best-supported culprit.

If a case fails validation, the backend MUST attempt bounded repair or regeneration.

Invalid cases MUST NOT be published.

---

# 6. APPLICATION SCREENS

## 6.1 Home Page

Route: `/`

The home page MUST include:
- Product name and introduction.
- Premise input.
- Character counter.
- Difficulty selector.
- Case length selector.
- Tone selector.
- Evidence preference controls.
- Example premise suggestions.
- Create Case button.
- Input validation messages.

The page MUST be responsive.

## 6.2 Generation Screen

The generation screen MUST display:
- A loading indicator.
- A status message.
- The current generation state.
- A retry option when generation fails.

The UI MUST remain usable while the backend generates the case.

Generation status MUST be polled with a reasonable interval and backoff.

## 6.3 Investigation Room

Route: `/cases/:caseId`

The investigation room MUST include:

### Case Header
- Case title.
- Summary.
- Location or setting.
- Difficulty.
- Investigation status.

### Case Briefing
Displays the initial scenario without revealing the culprit.

### Suspect Board
Displays suspect cards with:
- Name.
- Role.
- Bio.
- Motive hint.
- Alibi.

### Evidence Board
Displays evidence cards with:
- Evidence type.
- Title.
- Summary.
- Timestamp, when applicable.
- Source label.

Evidence MUST be filterable by type.

### Evidence Detail
Clicking an evidence card MUST open a modal, drawer, or dedicated detail view.

The detail view displays the complete evidence content and relevant metadata.

### Timeline
Displays case events in chronological order.

### Investigator Notes
Users MAY write private notes.

For the MVP, notes SHOULD be stored in browser local storage and MUST NOT be treated as authoritative case evidence.

### Accusation Action
A persistent action allows the user to begin the final accusation flow.

## 6.4 Accusation Dialog

The accusation dialog MUST:
- Display the suspects.
- Allow exactly one selection.
- Explain that submission is final.
- Provide confirm and cancel actions.
- Prevent duplicate submissions while the request is pending.

The backend MUST validate the selected suspect ID.

## 6.5 Reveal Screen

Route: `/cases/:caseId/reveal`

The reveal screen MUST display:
- Correct or incorrect result.
- The selected suspect.
- The actual culprit.
- Motive.
- Method.
- Opportunity.
- Full solution explanation.
- Evidence chain.
- Red-herring explanations.
- Create Another Mystery action.

Every evidence reference in the solution MUST link to an existing evidence item.

## 6.6 Error and Not Found Screens

The application MUST handle:
- Invalid case IDs.
- Unauthorized case access.
- Failed generation.
- Network failures.
- Database failures.
- AI provider errors.
- Missing evidence.
- Invalid state transitions.

Error screens MUST display understandable messages and appropriate recovery actions.

---

# 7. VISUAL DESIGN REQUIREMENTS

The UI SHOULD resemble an immersive detective case file.

## 7.1 Visual Direction

Recommended palette:
- Dark charcoal or navy backgrounds.
- Warm paper-colored panels.
- Muted amber highlights.
- Restrained red for danger and incorrect accusations.
- Neutral colors for evidence categories.

The interface MUST prioritize readability over visual effects.

## 7.2 Interaction Requirements

- Smooth, restrained transitions.
- Clear hover and focus states.
- Responsive cards and panels.
- Accessible modal behavior.
- Visible loading indicators.
- Useful empty states.
- Clear success and failure states.

## 7.3 Responsive Requirements

The application MUST support:
- Mobile screens.
- Tablets.
- Desktop screens.

At a viewport width of 320 pixels, the interface MUST NOT require horizontal scrolling for normal navigation or primary interactions.

## 7.4 Accessibility

The application SHOULD target WCAG 2.2 AA.

Requirements:
- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus indicators.
- Associated input labels.
- Accessible error messages.
- Appropriate image alt text.
- Sufficient contrast.
- No reliance on color alone.
- Respect for reduced-motion preferences.

---

# 8. SYSTEM ARCHITECTURE

## 8.1 Frontend

React with Vite.

Responsibilities:
- Form handling.
- Input validation.
- API communication.
- Case status polling.
- Suspect display.
- Evidence browsing.
- Timeline display.
- Accusation submission.
- Reveal presentation.
- Investigator notes.

The frontend MUST NOT determine whether an accusation is correct.

## 8.2 Backend

Node.js with Express.

Responsibilities:
- Request validation.
- Case creation.
- Access control.
- Gemini integration.
- AI output validation.
- Database persistence.
- Case state management.
- Accusation evaluation.
- Reveal generation from stored canonical data.
- Rate limiting.
- Error handling.

## 8.3 Database

MongoDB with Mongoose.

Responsibilities:
- Persisting cases.
- Storing public investigation data.
- Storing private solutions.
- Tracking generation status.
- Recording accusations.
- Maintaining timestamps.

## 8.4 AI Layer

Google Gemini.

Responsibilities:
- Generating the case narrative.
- Generating suspects.
- Generating evidence.
- Generating the timeline.
- Defining the canonical culprit.
- Producing the solution and evidence chain.

Gemini MUST be accessed through a dedicated backend service or provider adapter.

Controllers MUST NOT contain direct provider-specific generation logic.

---

# 9. AI GENERATION PIPELINE

The backend MUST follow this sequence.

### Step 1: Validate Input

Validate the premise and all configuration options.

Reject invalid requests before making an AI call.

### Step 2: Create a Generation Record

Create a case with state `generating`.

Associate it with an unguessable access capability.

### Step 3: Construct the Prompt

Use a server-controlled prompt.

The user's premise MUST be treated as untrusted story content rather than instructions capable of overriding system requirements.

### Step 4: Generate Structured Output

Ask Gemini for structured JSON matching the generated-case schema.

### Step 5: Parse and Validate

Validate the generated data using Zod or an equivalent runtime validator.

### Step 6: Validate Cross-References

Check:
- Suspect count.
- Evidence count.
- Timeline count.
- Unique IDs.
- Culprit membership.
- Evidence references.
- Timeline consistency.
- Solution consistency.

### Step 7: Repair Invalid Output

Allow at most two repair attempts after the initial generation.

Repair attempts MUST use bounded time and token budgets.

### Step 8: Persist the Validated Case

Store the public investigation separately from the private solution, preferably in separate documents or collections.

### Step 9: Mark the Case Ready

Only a successfully validated case can enter the `ready` state.

### Step 10: Return Public Data

Return the public case DTO without the canonical culprit or private solution.

If generation fails after the retry limit, set the case state to `failed`.

---

# 10. AI OUTPUT SCHEMA

The internal generated-case object MUST follow a versioned schema.

Recommended TypeScript contract:

```ts
type Difficulty = "easy" | "medium" | "hard";

type CaseLength = "short" | "standard";

type Tone =
  | "cozy"
  | "noir"
  | "thriller"
  | "lighthearted";

type EvidenceType =
  | "chat"
  | "image"
  | "cctv"
  | "document"
  | "witness"
  | "forensic";

type MediaStatus =
  | "text_simulation"
  | "prompt_only"
  | "generated";

type ClueRole =
  | "supporting"
  | "contradicting"
  | "red_herring"
  | "context";

interface GeneratedCase {
  schemaVersion: "1.0";

  title: string;
  summary: string;
  setting: string;
  briefing: string;

  difficulty: Difficulty;
  tone: Tone;

  suspects: Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
    publicMotiveHint: string;
    alibi: string;
    avatarDescription?: string;
  }>;

  evidence: Array<{
    id: string;
    type: EvidenceType;
    title: string;
    summary: string;
    content: string;
    createdAtInStory?: string;
    sourceLabel: string;
    mediaStatus: MediaStatus;
    mediaPrompt?: string;
    mediaUrl?: string;
    clueRole: ClueRole;
    linkedSuspectIds: string[];
  }>;

  timeline: Array<{
    id: string;
    timeLabel: string;
    description: string;
    linkedEvidenceIds: string[];
  }>;

  solution: {
    culpritSuspectId: string;
    motive: string;
    method: string;
    opportunity: string;
    summary: string;

    evidenceChain: Array<{
      evidenceId: string;
      explanation: string;
    }>;

    redHerringExplanations: Array<{
      evidenceId: string;
      explanation: string;
    }>;
  };

  contentNotes: string[];
}
```

### Schema Rules

1. The server SHOULD assign IDs after parsing the AI response.
2. Unknown fields SHOULD be rejected or explicitly stripped according to the schema policy.
3. All required strings MUST have reasonable length limits.
4. Arrays MUST have minimum and maximum lengths.
5. All referenced IDs MUST exist.
6. `mediaUrl` MUST NOT be trusted merely because Gemini supplied it.
7. `clueRole` and `solution` MUST remain private until reveal.
8. The schema MUST be versioned when breaking changes occur.

---

# 11. SOLUTION SECRECY

Solution secrecy is a critical requirement.

Before accusation, the frontend MUST NOT receive:
- Culprit suspect ID.
- Canonical solution.
- Private motive or method details that reveal the answer.
- Private clue classifications.
- Hidden validation notes.
- Internal AI prompts.
- Raw AI responses.
- Provider diagnostics.
- Access token hashes.
- API credentials.

The backend MUST use explicit public DTOs rather than serializing MongoDB documents directly.

The frontend MUST never contain logic that decides the canonical culprit.

The backend is the sole authority for accusation evaluation.

Automated tests MUST inspect pre-accusation responses to ensure these fields are absent.

---

# 12. DATABASE DESIGN

## 12.1 MysteryCase

Recommended MongoDB structure:

```ts
{
  _id: ObjectId,

  schemaVersion: "1.0",

  state:
    | "generating"
    | "ready"
    | "completed"
    | "failed",

  accessTokenHash: string,

  request: {
    premise: string,
    difficulty: string,
    caseLength: string,
    evidencePreferences: string[],
    tone: string,
    language: "en"
  },

  publicCase: {
    title: string,
    summary: string,
    setting: string,
    briefing: string,
    difficulty: string,
    tone: string,
    suspects: object[],
    evidence: object[],
    timeline: object[]
  },

  accusation: {
    suspectId: string,
    isCorrect: boolean,
    submittedAt: Date
  } | null,

  generation: {
    attemptCount: number,
    promptVersion: string,
    model: string,
    durationMs?: number,
    lastErrorCategory?: string
  },

  createdAt: Date,
  updatedAt: Date,
  expiresAt?: Date
}
```

## 12.2 PrivateSolution

Store the solution separately from public case data.

```ts
{
  _id: ObjectId,
  caseId: ObjectId,

  culpritSuspectId: string,

  motive: string,
  method: string,
  opportunity: string,
  summary: string,

  evidenceChain: [
    {
      evidenceId: string,
      explanation: string
    }
  ],

  redHerringExplanations: [
    {
      evidenceId: string,
      explanation: string
    }
  ],

  privateClueRoles: object[],

  createdAt: Date,
  updatedAt: Date
}
```

The private solution MUST only be accessible through trusted backend services.

## 12.3 Data Integrity

- Enforce valid state values.
- Use strict Mongoose schemas.
- Add indexes for operational queries.
- Use an atomic operation to record the first accusation.
- Prevent repeated accusations from overwriting the original result.
- Never store raw access tokens.
- Avoid storing unnecessary personal information.

---

# 13. CASE STATE MANAGEMENT

A case MUST use one of these states:

| State | Meaning |
|---|---|
| `generating` | AI generation or validation is in progress |
| `ready` | The case is validated and playable |
| `completed` | An accusation has been submitted and the reveal is available |
| `failed` | Generation failed after bounded attempts |

Allowed transitions:

```text
generating -> ready
generating -> failed
failed -> generating  [explicit retry only]
ready -> completed
```

No other state transitions are permitted.

A completed case MUST retain its original accusation and canonical solution.

---

# 14. REST API SPECIFICATION

Base path:

`/api/v1`

All requests and responses MUST use JSON unless explicitly documented otherwise.

Every error response MUST use a consistent structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check your input and try again.",
    "requestId": "request-id"
  }
}
```

## 14.1 Create Case

### Endpoint

`POST /api/v1/cases`

### Request

```json
{
  "premise": "A priceless diamond disappears during a private exhibition.",
  "difficulty": "medium",
  "caseLength": "standard",
  "evidencePreferences": [
    "chat",
    "cctv",
    "document",
    "witness"
  ],
  "tone": "noir",
  "language": "en"
}
```

### Behavior

1. Validate the request.
2. Apply rate limiting.
3. Create the generation record.
4. Generate and validate the case.
5. Persist the public case and private solution.
6. Return the appropriate generation state.

### Success Responses

- `201 Created`: generation completed and the case is ready.
- `202 Accepted`: generation is still in progress.

The response MUST contain only public case data.

Case access MUST be established through a secure cookie or a high-entropy access capability.

## 14.2 Get Case

### Endpoint

`GET /api/v1/cases/:caseId`

Returns the case's current state and, when ready, its public investigation content.

Requires valid case access.

Must never return the private solution before completion.

## 14.3 Get Case Status

### Endpoint

`GET /api/v1/cases/:caseId/status`

Returns:
- Case ID.
- Current state.
- Safe progress message.
- Whether retry is available.

The endpoint MUST NOT expose provider diagnostics.

## 14.4 Submit Accusation

### Endpoint

`POST /api/v1/cases/:caseId/accusation`

### Request

```json
{
  "suspectId": "suspect-id"
}
```

### Behavior

1. Verify access.
2. Verify that the case is ready.
3. Verify that the suspect belongs to the case.
4. Atomically record the accusation.
5. Compare the selected suspect with the private culprit ID.
6. Set the case to completed.
7. Return the reveal DTO.

A duplicate accusation MUST NOT overwrite the original accusation.

## 14.5 Get Reveal

### Endpoint

`GET /api/v1/cases/:caseId/reveal`

Returns the canonical reveal only after the case is completed.

Before completion, return:

`409 CASE_NOT_COMPLETED`

## 14.6 Retry Generation

### Endpoint

`POST /api/v1/cases/:caseId/retry`

This endpoint is optional for the MVP.

If implemented:
- Only failed cases may be retried.
- Access must be verified.
- Retry attempts must be bounded.
- Rate limits must apply.

## 14.7 Health Check

### Endpoint

`GET /api/v1/health`

Returns basic service health.

Must not expose secrets or detailed internal configuration.

## 14.8 HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Case created and ready |
| 202 | Case generation accepted or ongoing |
| 400 | Invalid request |
| 401 | Invalid or missing case access |
| 404 | Case not found |
| 409 | Invalid state transition or duplicate accusation |
| 429 | Rate limit exceeded |
| 502 | AI generation failure |
| 503 | Service unavailable |
| 500 | Unexpected internal error |

---

# 15. SECURITY REQUIREMENTS

The application MUST implement the following safeguards:

1. Store Gemini credentials only on the backend.
2. Store database credentials only in environment configuration.
3. Validate all request bodies.
4. Enforce premise length limits on the server.
5. Configure CORS to the expected frontend origin.
6. Use Helmet or equivalent security headers.
7. Apply rate limits to case creation and retries.
8. Use request-size limits and model timeouts.
9. Generate cryptographically secure case access capabilities.
10. Store access-token hashes rather than raw tokens.
11. Prevent unauthorized access to private cases.
12. Prevent access to solutions before accusation.
13. Escape untrusted content and never render AI output as raw HTML.
14. Never execute model-generated content as code.
15. Avoid logging API keys, access tokens, full premises, prompts, or private solutions.
16. Validate media assets and never trust arbitrary model-supplied URLs.
17. Use safe error messages without stack traces.
18. Keep fictional cases clearly distinguished from real investigations.
19. Do not generate defamatory allegations about identifiable real people.
20. Keep violent content non-graphic.

The application MUST NOT claim to investigate real crimes or provide authoritative criminal-investigation findings.

---

# 16. ENVIRONMENT VARIABLES

The repository MUST include `.env.example`.

```dotenv
NODE_ENV=development
PORT=5000

CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/ai-mystery-room

GEMINI_API_KEY=
GEMINI_MODEL=

CASE_ACCESS_SECRET=

AI_REQUEST_TIMEOUT_MS=60000
AI_MAX_REPAIR_ATTEMPTS=2

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_CASES=5

CASE_TTL_DAYS=
```

### Rules

- Never commit a real `.env` file.
- Validate required environment variables at startup.
- Fail with a clear error when required configuration is missing.
- Never print secret values.
- If TTL is unset, cases MUST NOT expire automatically.
- Tests MUST be able to run using a mocked AI provider.

---

# 17. ERROR HANDLING

The application MUST gracefully handle:

- Invalid user input.
- Gemini timeouts.
- Gemini quota errors.
- Gemini service errors.
- Invalid AI JSON.
- Schema validation failures.
- Inconsistent generated evidence.
- MongoDB connection failures.
- Unauthorized case access.
- Missing cases.
- Duplicate accusations.
- Network failures.
- Invalid state transitions.

The frontend MUST display helpful messages and recovery actions.

The backend MUST use centralized error handling and stable error codes.

Logs SHOULD include:
- Timestamp.
- Request ID.
- Route.
- Operation.
- Duration.
- Status.
- Error category.

Logs MUST NOT include secrets or complete private solutions.

---

# 18. TESTING REQUIREMENTS

## 18.1 Unit Tests

Test:
- Request validation.
- Generated-case validation.
- Unique identifiers.
- Suspect count.
- Evidence count.
- Timeline references.
- Culprit membership.
- Evidence-chain integrity.
- Public DTO secrecy.
- Reveal DTO correctness.
- State transitions.
- Access capability verification.
- Provider error handling.

## 18.2 API Integration Tests

Test:
- Successful case creation.
- Invalid premise rejection.
- Generation status polling.
- Unauthorized case access.
- Public case response secrecy.
- Invalid suspect rejection.
- Correct accusation.
- Incorrect accusation.
- Duplicate accusation rejection.
- Reveal before completion.
- Rate limiting.
- AI generation failure.

## 18.3 Frontend Tests

Test:
- Form validation.
- Loading states.
- Generation failure states.
- Evidence filters.
- Evidence detail views.
- Accusation confirmation.
- Reveal screen.
- Keyboard accessibility.
- Responsive behavior.

## 18.4 End-to-End Test

A complete test MUST cover:

1. Enter a premise.
2. Generate a case using deterministic mock data.
3. Inspect suspects and evidence.
4. Submit an accusation.
5. Verify the result.
6. Inspect the final evidence explanation.

Regular CI tests MUST NOT depend on live Gemini calls.

---

# 19. PERFORMANCE REQUIREMENTS

- Non-AI API responses SHOULD achieve p95 latency below 500 ms in normal staging conditions.
- AI generation SHOULD aim to finish within 60 seconds.
- The UI MUST handle longer generation times.
- Generation status SHOULD be polled every 1.5–2.5 seconds with backoff.
- Polling MUST stop when a terminal state is reached or the page is unmounted.
- Duplicate requests SHOULD NOT trigger unnecessary duplicate AI generation.
- Video or large media assets MUST NOT autoplay.
- Heavy components SHOULD be lazy-loaded where appropriate.

These are targets, not guarantees of external provider availability.

---

# 20. RECOMMENDED PROJECT STRUCTURE

```text
ai-mystery-room/
│
├── SPEC.md
├── README.md
├── .env.example
├── .gitignore
├── package.json
│
├── client/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       │   ├── case-creation/
│       │   ├── investigation/
│       │   ├── accusation/
│       │   └── reveal/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── styles/
│       └── main.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       │   ├── ai/
│       │   ├── case-generation/
│       │   └── case-validation/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── shared/
│   ├── schemas/
│   └── types/
│
├── docs/
│   └── decisions/
│
└── tests/
```

This is a recommended structure. If the repository already has an appropriate structure, preserve it unless a change is necessary.

---

# 21. IMPLEMENTATION MILESTONES

Codex MUST implement the application incrementally.

## Milestone 0 — Repository Audit

- Inspect existing files.
- Identify the package manager and dependencies.
- Review the existing architecture.
- Identify gaps against this specification.
- Preserve existing work.
- Document the implementation plan.

## Milestone 1 — Project Foundation

- Configure the React and Express applications.
- Set up environment validation.
- Configure MongoDB.
- Add health checks.
- Add security middleware.
- Add centralized error handling.
- Configure testing and linting.
- Create `.env.example`.

## Milestone 2 — Schemas and Mock Data

- Implement request schemas.
- Implement generated-case schemas.
- Implement public and reveal DTOs.
- Implement semantic validation.
- Create a deterministic mock case.
- Add tests for solution secrecy.

## Milestone 3 — Backend API

- Implement case creation.
- Implement case retrieval.
- Implement status polling.
- Implement accusation submission.
- Implement reveal retrieval.
- Add access control.
- Add atomic state transitions.
- Add integration tests.

## Milestone 4 — Gemini Integration

- Verify the current official Google Gen AI SDK.
- Implement the AI provider adapter.
- Implement structured generation.
- Add prompt versioning.
- Add output validation.
- Add bounded repair attempts.
- Handle provider errors.
- Keep live AI tests optional.

## Milestone 5 — Case Creation UI

- Build the home page.
- Implement premise validation.
- Add configuration controls.
- Integrate the case creation API.
- Implement loading and error states.

## Milestone 6 — Investigation Room

- Build the case briefing.
- Build suspect cards.
- Build the evidence board.
- Implement evidence filtering.
- Implement evidence detail views.
- Build the timeline.
- Implement local investigator notes.

## Milestone 7 — Accusation and Reveal

- Build the accusation dialog.
- Integrate accusation submission.
- Implement the reveal screen.
- Display the evidence chain.
- Test correct and incorrect accusations.
- Test duplicate submissions.

## Milestone 8 — Hardening and Release

- Run all tests.
- Run linting.
- Run the production build.
- Review access control.
- Check for solution leakage.
- Review rate limiting.
- Review logging and error handling.
- Complete the README.
- Document known limitations.

Each milestone MUST be tested before moving to the next.

---

# 22. CODEX DEVELOPMENT RULES

Codex MUST follow these rules throughout development.

1. Read this entire document before modifying the repository.
2. Inspect the existing repository before writing code.
3. Implement one milestone at a time.
4. Keep changes small and reviewable.
5. Do not overwrite existing working code without a reason.
6. Do not invent credentials or hardcode secrets.
7. Do not claim tests passed unless they were executed.
8. Use a mock AI provider when Gemini credentials are unavailable.
9. Keep API schemas and implementation synchronized.
10. Do not expose private solutions to the frontend.
11. Do not present simulated media as actual generated media.
12. Add tests for new functionality.
13. Document deviations and architectural decisions.
14. Update this specification when approved product requirements change.
15. Report files changed, commands executed, test results, and outstanding issues after each milestone.

If a requirement cannot be implemented as written, Codex MUST explain the limitation and propose an alternative rather than silently omitting it.

---

# 23. DEFINITION OF DONE

A feature is complete only when:

- It satisfies the requirements in this specification.
- Inputs are validated.
- AI output is validated where applicable.
- Loading, success, empty, and error states are implemented.
- Access control is enforced.
- Private solution data remains private until reveal.
- Tests are added and pass.
- Linting and relevant build checks pass.
- Responsive behavior is verified.
- Accessibility is considered.
- Documentation is updated.
- No secrets are committed.
- Known limitations are documented.

---

# 24. RELEASE ACCEPTANCE CHECKLIST

Before considering the MVP complete, verify:

- [ ] A user can submit a premise.
- [ ] A user can configure difficulty and other supported options.
- [ ] Gemini can generate a structured fictional investigation.
- [ ] The backend validates generated cases.
- [ ] Each playable case has 3–6 suspects.
- [ ] Each playable case has 5–10 evidence items.
- [ ] Each playable case has a chronological timeline.
- [ ] Each playable case has exactly one canonical culprit.
- [ ] The evidence supports the canonical solution.
- [ ] Users can inspect and filter evidence.
- [ ] Users can submit one accusation.
- [ ] The backend determines whether the accusation is correct.
- [ ] The reveal explains the solution.
- [ ] Private solution data is not exposed before accusation.
- [ ] Case access is protected.
- [ ] Rate limits and timeouts are implemented.
- [ ] AI failures are handled gracefully.
- [ ] Mock-backed tests pass.
- [ ] The production build succeeds.
- [ ] The interface is responsive and keyboard accessible.
- [ ] Simulated media is labeled accurately.
- [ ] README and environment documentation are complete.

---

# 25. FUTURE ENHANCEMENTS

The following features are outside the MVP unless explicitly approved:

- Actual AI image generation.
- Actual video generation.
- User accounts and saved case libraries.
- Multiplayer investigations.
- Shareable cases.
- Hint systems.
- AI detective assistants.
- Leaderboards.
- Localization.
- User-generated media uploads.
- Subscription plans.
- Advanced case analytics.

Future enhancements MUST be documented and MUST update the relevant API, schema, security, and testing requirements.

---

# FINAL IMPLEMENTATION PRINCIPLE

AI Mystery Room is not simply a website that asks AI to write a detective story.

It is a structured investigation system with a canonical solution, validated evidence, controlled case states, and a secure reveal mechanism.

The central engineering requirement is:

**Every playable mystery must be internally consistent, uniquely solvable from the available evidence, and evaluated against a canonical solution stored securely on the backend.**

All implementation decisions MUST preserve this principle.