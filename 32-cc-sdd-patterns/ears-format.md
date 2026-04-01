# EARS Format — Acceptance Criteria Syntax

EARS (Easy Approach to Requirements Syntax) makes requirements testable and unambiguous.

## Patterns

### 1. Event-Driven
```
WHEN [event], THE [system] SHALL [response]
```
Use for: Responses to specific triggers.
```
WHEN a user clicks checkout, THE Checkout Service SHALL validate cart contents.
WHEN a file upload completes, THE Storage Service SHALL generate a thumbnail.
```

### 2. State-Driven
```
WHILE [precondition], THE [system] SHALL [response]
```
Use for: Behavior dependent on system state.
```
WHILE payment is processing, THE Checkout Service SHALL display a loading indicator.
WHILE a user is offline, THE App SHALL queue mutations locally.
```

### 3. Unwanted Behavior (Errors/Failures)
```
IF [trigger], THEN THE [system] SHALL [response]
```
Use for: Error handling and invalid states.
```
IF an invalid credit card is entered, THEN THE site SHALL display an error message.
IF a request times out after 30s, THEN THE API SHALL return a 504 with retry-after header.
```

### 4. Optional Feature
```
WHERE [feature is included], THE [system] SHALL [response]
```
Use for: Conditional or optional capabilities.
```
WHERE the plan includes SSO, THE Auth Service SHALL accept SAML assertions.
WHERE dark mode is enabled, THE UI SHALL apply the dark color token set.
```

### 5. Ubiquitous (Always Active)
```
THE [system] SHALL [response]
```
Use for: Fundamental properties, non-functional requirements.
```
THE API SHALL respond within 200ms at p99 under normal load.
THE system SHALL encrypt all PII at rest using AES-256.
```

### 6. Combined
```
WHILE [precondition], WHEN [event], THE [system] SHALL [response]
```
```
WHILE authenticated, WHEN a user requests /admin, THE Auth Middleware SHALL verify admin role.
```

## Quality Rules

- One behavior per statement — split if "and" appears in the action
- Use `SHALL` for mandatory, `SHOULD` for recommended
- Name the concrete system/service, not "the system" generically
- Must be independently testable/verifiable
- No implementation details in requirements (WHAT not HOW)

## In REQUIREMENTS.md

Replace plain checkboxes with EARS criteria:

```markdown
### Requirement 1: User Authentication

**Objective:** Users can sign in securely.

#### Acceptance Criteria

1. WHEN a user submits valid credentials, THE Auth Service SHALL issue a JWT with 1h expiry.
2. IF invalid credentials are submitted 5 times, THEN THE Auth Service SHALL lock the account for 15 minutes.
3. WHILE a session is active, THE Auth Service SHALL refresh the token 5 minutes before expiry.
4. THE Auth Service SHALL hash passwords with bcrypt (cost ≥ 12).
```
