---
name: gitnexus-debugging
description: "Use when the user is debugging a bug, tracing an error, or asking why something fails. Examples: \"Why is X failing?\", \"Where does this error come from?\", \"Trace this bug\""
---

# Debugging with GitNexus

## When to Use

- "Why is this function failing?"
- "Trace where this error comes from"
- "Who calls this method?"
- "This endpoint returns 500"
- Investigating bugs, errors, or unexpected behavior

## Workflow

```
1. gitnexus_query({query: "<error or symptom>"})            → Find related execution flows
2. gitnexus_context({name: "<suspect>"})                    → See callers/callees/processes
3. READ gitnexus://repo/{name}/process/{name}                → Trace execution flow
4. gitnexus_cypher({query: "MATCH path..."})                 → Custom traces if needed
```

> If "Index is stale" → run `npx gitnexus analyze` in terminal.

## Checklist

```
- [ ] gitnexus_query for the error symptom / failing concept
- [ ] Identify suspect symbols from returned processes
- [ ] gitnexus_context on each suspect — check callers for the bug source
- [ ] READ the relevant process for full execution trace
- [ ] Read source files for the actual bug
- [ ] gitnexus_impact to confirm blast radius before fixing
```

## Tools

**gitnexus_query** — find flows related to the symptom:

```
gitnexus_query({query: "payment timeout error"})
→ Processes: CheckoutFlow, WebhookRetry
→ Suspects: processPayment, retryHandler, timeoutManager
```

**gitnexus_context** — trace callers to the bug source:

```
gitnexus_context({name: "processPayment"})
→ Incoming: checkoutHandler (line 42), webhookHandler (line 15)
→ Bug likely introduced at one of these call sites
```

**gitnexus_cypher** — custom path query:

```cypher
MATCH path = (entry)-[:CodeRelation*1..5 {type: 'CALLS'}]->(suspect:Function {name: "processPayment"})
RETURN path LIMIT 10
```

## Example: "This endpoint returns 500"

```
1. gitnexus_query({query: "POST /payments endpoint 500"})
   → CheckoutFlow: validateRequest → processPayment → chargeStripe
2. gitnexus_context({name: "validateRequest"})
   → Callers: checkoutController (line 28)
   → Callees: checkSchema, sanitizeInput, lookupUser
3. READ gitnexus://repo/my-app/process/CheckoutFlow
   → Step 2: validateRequest → crashes if user not found (no null check)
4. Read src/controllers/checkout.ts:28 for the actual bug
```
