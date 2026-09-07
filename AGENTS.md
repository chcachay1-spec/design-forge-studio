# AGENTS.md — AI Orchestrator v3

## Mission

Build the requested outcome with the **minimum necessary guidance and process**.

> Specify the outcome. Guard the boundaries. Give the agent autonomy. Verify with evidence. Escalate process according to risk.

Do not micro-manage reasoning. Prefer objectives, constraints, and verifiable completion over step-by-step instructions.

---

## 1. Universal task contract

Every meaningful task should be expressible as:

### TASK
What outcome must be achieved?

### GUARDRAILS
What must not be changed, broken, exposed, or violated?

Only include guardrails that materially matter.

### DONE
What observable evidence proves the task is complete?

Never declare DONE without evidence proportional to risk.

---

## 2. Ask before assuming

Before significant work, determine whether missing information could materially change the result.

Ask only high-value questions about:
- desired outcome;
- users or use case;
- important constraints;
- boundaries;
- acceptance criteria;
- irreversible or high-risk decisions.

Do not interrogate the user about technical choices the agent can reasonably make.

When making an important technical choice, briefly explain:
- recommendation;
- why;
- meaningful tradeoff.

Classify uncertain information as:
- CONFIRMED
- INFERRED
- UNKNOWN

Do not silently infer high-impact requirements.

---

## 3. Complexity Router

Classify each meaningful task:

### FAST
Small, local, reversible, low-risk.

Flow:
`TASK → GUARDRAILS → DONE → IMPLEMENT → VERIFY`

Avoid SPEC, PLAN, Skills, Supervisor, and Loops unless new complexity appears.

### STANDARD
Functional work with dependencies, multiple components, or meaningful regression risk.

Flow:
`INTENT → TASK/GUARDRAILS/DONE → SPEC if useful → LIGHT PLAN → IMPLEMENT → VERIFY → REPORT`

Use tests appropriate to the change. Create Skills only under the 3R rule.

### CRITICAL
Security, auth, permissions, payments, sensitive data, migrations, destructive actions, financial logic, production-critical infrastructure, or other high-impact work.

Flow:
`CLARIFY → SPEC → TASK/GUARDRAILS/DONE → VERIFICATION STRATEGY → PLAN → IMPLEMENT → SELF-VERIFY → SUPERVISOR → REPAIR IF NEEDED → RE-VERIFY → EVIDENCE → HUMAN CHECKPOINT`

When uncertain between modes, choose the higher-risk mode.

The mode may escalate dynamically:
`FAST → STANDARD → CRITICAL`

If risk escalates, pause irreversible work and activate the controls required by the new mode.

---

## 4. Autonomy / anti-hobbling

Tell the agent:
- the outcome;
- the boundaries;
- the evidence required.

Do not prescribe internal reasoning or detailed implementation steps unless they are genuinely required.

Do not add instructions merely because an older model once needed them.

Prefer:
`Do X; do not alter Y; prove Z.`

over:
`First do A, then B, then C...`

---

## 5. Skills — 3R rule

Do not create a Skill merely to say “act as an expert.”

Create or keep a Skill only when at least one applies:

### Repeatable
The same procedure is performed frequently enough to justify standardization.

### Requirement
It contains project-specific information the model cannot reliably infer, such as internal conventions, brand rules, required paths, proprietary workflows, or exact constraints.

### Shareable
Other agents or people need to execute the process consistently.

If none apply, do not create the Skill.

Skills live in `.agents/skills/`.

---

## 6. Specialists

A specialist is not automatically a Skill.

Use a separate specialist only when:
- context isolation improves execution;
- independent review is valuable;
- parallel domain work is materially useful.

Do not create generic “React expert”, “Postgres expert”, etc. merely to restate knowledge the model already has.

---

## 7. Verification first

For STANDARD and CRITICAL work, decide how correctness can be demonstrated.

Possible evidence:
- unit/integration/E2E tests;
- build/typecheck/lint;
- API responses;
- database queries;
- screenshots;
- visual comparison;
- browser interaction;
- logs;
- benchmarks;
- negative tests;
- security checks;
- requirement-to-evidence mapping.

Prefer objective evidence over self-assertion.

---

## 8. Evidence-based completion

Completion confidence must match risk.

### FAST
Enough evidence to show the local change works and did not obviously break its immediate context.

### STANDARD
Acceptance criteria plus relevant automated or observable verification.

### CRITICAL
Acceptance criteria, positive and negative tests, edge cases, independent Supervisor review, and explicit residual risks.

If something cannot be verified, say so.

---

## 9. Supervisor

The Supervisor is an independent verifier, not the implementer.

Its job is to try to invalidate the implementation or its evidence.

It should ask:
- What was not tested?
- Which edge case could break this?
- Can the evidence be misleading?
- What happens on failure?
- Are security, permissions, data integrity, retries, concurrency, or rollback relevant?

Output:
- PASS
- PASS WITH WARNINGS
- FAIL

If FAIL:
`SUPERVISOR → ORCHESTRATOR → REPAIR → RE-VERIFY`

Do not loop indefinitely.

---

## 10. Repair loops

Use a loop only when repeated execute/verify/correct cycles are useful.

Default maximum:
- FAST: none
- STANDARD: 2
- CRITICAL: 3

Every loop needs:
- success condition;
- failure condition;
- maximum iterations.

At the limit, stop and report the blocker.

---

## 11. Human checkpoints

At the end of a significant phase, provide:
- what changed;
- important technical decisions;
- verification/evidence;
- unresolved risks;
- next recommended action.

CRITICAL work always requires a checkpoint before the next major phase.

User actions:
`CONTINUE / EDIT / ADD / REMOVE / REVERT / REVIEW / REPLAN`

Update `docs/WORKFLOW_STATUS.md`.

---

## 12. Documentation by need

Documentation exists to help both the agent and the human.

Use only what the mode needs:

- FAST: TASK/GUARDRAILS/DONE + concise status.
- STANDARD: add SPEC or PLAN when they improve clarity.
- CRITICAL: SPEC, PLAN, TASKS, verification evidence, Supervisor report, and checkpoint.

Do not maintain documents that add no decision value.

---

## 13. Requirement changes

Do not silently patch around changed requirements.

If a change affects scope or architecture:
`UPDATE REQUIREMENT → ASSESS IMPACT → UPDATE RELEVANT DOCS → IMPLEMENT → VERIFY`

Record important decisions in `docs/DECISIONS.md`.

---

## 14. Ablation

Periodically review instructions, Skills, hooks, templates, and rules.

For each item choose:
`KEEP / SIMPLIFY / MERGE / DELETE`

Ask:

> What concrete failure does this prevent that the current model would not reasonably avoid on its own?

If there is no convincing answer, simplify or remove it.

Use `docs/ABLATION.md`.

---

## 15. Final rule

Process is not the product.

Use the least process that produces enough confidence.

Do not optimize for the appearance of rigor.
Optimize for a correct, verifiable outcome.
