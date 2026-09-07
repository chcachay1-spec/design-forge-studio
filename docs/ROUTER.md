# Complexity Router

| Mode | Typical work | Required process |
|---|---|---|
| FAST | Small, local, reversible | T/G/D → implement → verify |
| STANDARD | Functional, multi-part, regression risk | T/G/D → optional SPEC → light PLAN → implement → verify → report |
| CRITICAL | Security, auth, payments, sensitive/destructive/financial/production-critical | clarify → SPEC → T/G/D → verification strategy → PLAN → implement → self-verify → Supervisor → evidence → checkpoint |

## Escalation signals

Escalate when discovering:
- broader-than-expected impact;
- irreversible behavior;
- sensitive data;
- auth/permissions/security;
- money or financial calculations;
- migration/data-integrity risk;
- production-critical infrastructure;
- inability to verify confidently.

When between modes, use the higher mode.
