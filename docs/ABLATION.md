# ABLATION.md

## Purpose

Prevent accumulated instructions from hobbling newer, more capable models.

Review cadence is configurable. Run when:
- the model/tooling changes materially;
- instructions feel bloated;
- agents repeatedly ignore or fight rules;
- token/context cost grows;
- old Skills or hooks may be obsolete.

## Method

Review:
- `AGENTS.md`
- Skills
- Supervisors
- hooks
- templates
- recurring rules

For every item ask:

> What concrete failure does this prevent that the current model would not reasonably avoid on its own?

Classify:

| Item | Decision | Evidence / reason |
|---|---|---|
| [Rule/Skill] | KEEP / SIMPLIFY / MERGE / DELETE | [Why] |

## Ablation test

When safe:
1. remove or simplify the instruction;
2. run representative tasks;
3. compare outcome and verification;
4. restore only if measurable quality or reliability decreases.

Do not keep rules merely because they existed before.

## Result

**Removed:**  
- [ ]

**Simplified:**  
- [ ]

**Merged:**  
- [ ]

**Kept because:**  
- [ ]

**Observed impact:**  
[Summary]
