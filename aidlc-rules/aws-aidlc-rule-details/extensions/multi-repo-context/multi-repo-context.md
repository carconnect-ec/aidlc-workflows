# Multi-Repo Context Rules

## Overview

These rules activate during INCEPTION when an epic involves more than one repository. Their purpose is to ensure the agent understands the integration contracts of every involved repo — inputs, outputs, events, and technology — before generating any plan.

**Enforcement**: This extension is **blocking**. INCEPTION MUST NOT proceed to CONSTRUCTION until the agent can answer, for every involved repo: what does it consume, what does it emit, and what is its technology stack.

---

## Rule MRC-01: Repo Identification

**Rule**: When the epic scope is `Cross-system`, the agent MUST ask the user to explicitly name every repository involved before reading anything.

**How to ask**:

```markdown
This epic touches multiple repositories. Please list each one:
- Repository name or URL
- Its role in this epic (e.g., emits events, exposes API, consumes queue, renders UI)
```

The agent MUST NOT assume repos based on the epic description alone. The user confirms the list.

**Verification**:
- At least two repos are confirmed by the user
- Each repo has a stated role in the epic

---

## Rule MRC-02: Context Resolution per Repo (Tiered)

**Rule**: For each repo confirmed in MRC-01, the agent MUST resolve its integration contract using the following tier sequence. Each tier is attempted in order. A tier is considered sufficient when the agent can answer: *what does this repo consume, what does it emit, and what technology does it use*. If a tier is sufficient, do NOT proceed to the next tier for that repo.

### Step 0 — Check for Cached Context (always before tiers)

Before executing any tier, check if `aidlc-docs/inception/multi-repo-context.md` exists from a previous epic.

**If the file does not exist**: proceed directly to Tier 1 for all repos.

**If the file exists**:
1. Load the cached contracts for any repo that already appears in the file
2. For each cached repo, execute **Tier 1 only** as a drift check — read `docs/context.md` and `docs/integrations.md` and compare against the cached contract
3. Classify the result:

| Result | What to do |
|---|---|
| Tier 1 matches cache | Mark repo as **verified** — skip remaining tiers |
| Tier 1 finds differences | Mark repo as **drifted** — flag to user (see below), then re-execute full tier sequence |
| Tier 1 files missing | Mark repo as **unverifiable** — proceed with cached contract but warn user |

**If drift is detected**, present this alert before continuing:

```markdown
⚠️ **Contract Drift Detected**

The following repos have changes since the last epic:
- [repo-name]: [what changed — e.g., new field in docs/integrations.md, removed event]

The cached contract will be replaced with the updated version. Review the diff before approving the plan.
```

**If a repo in the current epic does not appear in the cached file** (new repo for this combination): proceed to Tier 1 normally for that repo.

**Verification**:
- Step 0 executes before any tier for every repo
- Cached repos are re-verified via Tier 1 before being trusted
- Drift is always surfaced to the user, never silently accepted

---

### Tier 1 — Standard Docs (always first)

Read via MCP GitHub:
- `docs/context.md`
- `docs/integrations.md`

If both files exist and contain enough information to answer the three contract questions → **Tier 1 sufficient. Stop here for this repo.**

If only one file exists, or the files exist but leave contract questions unanswered → proceed to Tier 2.

If neither file exists → proceed to Tier 2.

### Tier 2 — Full Docs Folder

If `docs/` exists in the repo root but Tier 1 was insufficient, read all remaining files in `docs/`. Do not read subdirectories beyond `docs/` at this tier.

If `docs/` does not exist → skip directly to Tier 3.

If after reading all `docs/` files the contract questions are answered → **Tier 2 sufficient. Stop here for this repo.**

If questions remain unanswered → proceed to Tier 3.

### Tier 3 — Repo Tree Inference

List the repo file tree. From the tree, identify files whose names suggest they define contracts, regardless of technology stack. Look for names that signal:

- **Inputs**: handlers, consumers, listeners, queues, subscribers, receivers, webhooks
- **Outputs**: events, publishers, producers, emitters, dispatchers, notifications
- **Contracts**: schemas, models, interfaces, types, DTOs, contracts, payloads, definitions
- **API surface**: routes, controllers, endpoints, resolvers, resources
- **Infrastructure**: template.yaml, serverless.yml, docker-compose, manifests, cdk stacks

Do not read every file. Select only those files whose names clearly match the above signals. Read the minimum set needed to answer the three contract questions.

If after reading targeted files the contract questions are answered → **Tier 3 sufficient. Stop here for this repo.**

If questions still remain → proceed to Tier 4.

### Tier 4 — Targeted Code Read

Read only the specific file(s) that contain the relevant logic. This tier is for cases where a contract is implied by internal behavior rather than declared in a schema or config file. Read the narrowest scope possible — a single function or handler is preferable to an entire module.

**Verification (per repo, all tiers)**:
- Agent can state: what this repo consumes (inputs, event types, queue names, API calls)
- Agent can state: what this repo emits (events, API responses, side effects, persisted data)
- Agent can state: what technology stack this repo uses

---

## Rule MRC-03: Cross-Repo Contract Summary

**Rule**: Before proceeding to CONSTRUCTION, the agent MUST produce a cross-repo contract summary and present it to the user for approval.

Create `aidlc-docs/inception/multi-repo-context.md` with this structure:

```markdown
# Multi-Repo Context

## Repos Involved
| Repo | Role in Epic | Technology |
|---|---|---|
| [repo-name] | [role] | [stack] |

## Integration Contracts

### [repo-name]
**Consumes**: [events, queues, APIs, or data this repo receives]
**Emits**: [events, APIs, side effects, or data this repo produces]
**Contract source**: [Tier used — e.g., Tier 1: docs/context.md + docs/integrations.md]

[Repeat for each repo]

## Integration Map
[Describe the data/event flow between repos as it relates to this epic. Use plain text or a simple list — no diagrams required.]

## Unresolved Questions
[List any contract details that could not be determined from available sources. These MUST be resolved before CONSTRUCTION.]
```

**Verification**:
- File exists at `aidlc-docs/inception/multi-repo-context.md`
- Every repo from MRC-01 has an entry
- "Unresolved Questions" section is either empty or contains a list that the user has explicitly acknowledged

---

## Rule MRC-04: INCEPTION Gate

**Rule**: The INCEPTION phase MUST NOT present the "Approve & Continue to CONSTRUCTION" option until:

1. All repos confirmed in MRC-01 have passed MRC-02 (contract resolved at any tier)
2. `aidlc-docs/inception/multi-repo-context.md` exists (MRC-03 complete)
3. User has reviewed and approved the cross-repo contract summary

If any repo has unresolved contract questions, the gate MUST remain closed. Present only:

```markdown
⛔ **Multi-Repo Context Incomplete**

The following repos have unresolved contract questions:
- [repo-name]: [what is unknown]

Resolve these before proceeding to CONSTRUCTION. Options:
- Provide the missing information directly
- Point to a file or document where it can be found
- Confirm that the unknown is an acceptable assumption and state it explicitly
```

---

## Rule MRC-05: CONSTRUCTION Contract Drift Check

**Rule**: At the close of CONSTRUCTION (before the final completion message), the agent MUST remind the developer to update integration documentation in any repo whose contracts changed during this epic.

Present the following reminder if any contract was modified, extended, or introduced:

```markdown
📋 **Integration Docs Reminder**

The following repos had contract changes in this epic:
- [repo-name]: [what changed — e.g., new event emitted, new field in payload, new queue consumed]

Update `docs/context.md` and/or `docs/integrations.md` in each affected repo before closing this epic. This keeps the Multi-Repo Context extension accurate for future epics.
```

This is a reminder, not a blocker. CONSTRUCTION can complete without it being acted on, but it MUST be shown.

**Verification**:
- Reminder appears in the CONSTRUCTION completion message whenever at least one cross-repo contract was modified

---

## Rule MRC-06: Docs Bootstrap After Tier Resolution

**Rule**: When the agent resolves a repo's contract via Tier 2, 3, or 4 (meaning `docs/context.md` and `docs/integrations.md` were missing or insufficient), it MUST offer to generate those files for that repo using what it learned during resolution.

This offer is presented immediately after MRC-03 (cross-repo contract summary), before the INCEPTION gate in MRC-04.

**How to offer**:

```markdown
📄 **Docs Bootstrap Available**

The following repos were resolved via Tier [2/3/4] — their `docs/` files are missing or incomplete:
- [repo-name]: resolved via [tier used]

Would you like me to generate `docs/context.md` and `docs/integrations.md` for each? You review and merge them via PR. Future epics will resolve these repos at Tier 1.

A) Yes — generate docs files for all listed repos
B) Yes — generate docs files for selected repos only (specify which)
C) No — skip for now
```

**If the user says A or B**, generate the files using the following templates populated with what the agent learned during resolution:

`docs/context.md`:
```markdown
## What it does
[One paragraph description of the service's purpose]

## Inputs
[List each: protocol (SQS/HTTP/EventBridge/etc.), resource name, event or request type]

## Outputs
[List each: protocol, resource name, event or data type emitted]

## Technology
[Stack: language, framework, infrastructure tool]
```

`docs/integrations.md`:
```markdown
## Depends on
[List each repo this service consumes from: repo name, what it receives, how]

## Exposes to
[List each repo that consumes from this service: repo name, what it receives, how]
```

The agent produces these files as artifacts for the developer to review. They are NOT committed automatically — the developer opens a PR in the target repo.

**If the user says C**, log the skipped repos in `aidlc-docs/inception/multi-repo-context.md` under a `## Docs Bootstrap Pending` section so future epics know which repos still lack standard docs.

**Verification**:
- Offer is presented for every repo resolved via Tier 2, 3, or 4
- If accepted, generated files follow the templates above
- If declined, skipped repos are logged in `multi-repo-context.md`
