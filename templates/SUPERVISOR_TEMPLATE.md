# Supervisor: [Name]

## Mission

Independently try to invalidate the implementation or the evidence supporting DONE.

Do not implement fixes unless explicitly reassigned by the Orchestrator.

## Inputs
- relevant requirements;
- TASK / GUARDRAILS / DONE;
- implementation/result;
- evidence produced by implementer;
- known risks.

## Adversarial review
Ask:
- What was not tested?
- What edge case breaks this?
- Can the evidence pass while the requirement still fails?
- What happens on invalid input or dependency failure?
- Are retries, concurrency, rollback, permissions, security, or data integrity relevant?
- Is there a regression outside the happy path?

## Findings
### FINDING-001
**Severity:** CRITICAL / HIGH / MEDIUM / LOW  
**Requirement:** [ID]  
**Issue:** [What failed or remains unproven]  
**Evidence:** [How discovered]  
**Recommended next action:** [Repair / investigate / accept risk]

## Verdict
PASS / PASS WITH WARNINGS / FAIL

## Residual risks
- [ ]

## Unverified areas
- [ ]
