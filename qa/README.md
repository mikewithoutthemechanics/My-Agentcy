# QA Layer

The quality assurance system — the core differentiator of My-Agentcy.

## Architecture

```
Deliverable
    │
    ▼
┌─────────────────┐
│  QA Engine       │  (automated scoring against rubric)
│  engine.py       │
└──────┬──────────┘
       │
       ├── Score ≥ threshold & no critical flags → ✅ Auto-approve
       │
       └── Score < threshold OR flags → 👤 Human review
              │
              ├── Reviewer approves → ✅ Deliver
              └── Reviewer rejects → 🔄 Agent revises → Re-review
```

## Files

- **automated/engine.py** — QA scoring engine, rubrics, tier classification, pipeline
- **review/dashboard.py** — Human review API routes, assignment, diff-based review
- **feedback/loop.py** — Client feedback recording, self-improvement, performance tracking

## QA Tiers

| Tier | Review | Threshold | Use Case |
|------|--------|-----------|----------|
| T0 | Automated only | 80 | Data entry, formatting, summaries |
| T1 | Auto + 20% spot-check | 85 | Reports, analysis, code, content |
| T2 | Auto + full human | 90 | Strategy, design, proposals |
| T3 | Auto + senior + client sign-off | 95 | Legal, financial, compliance |

## Rubrics

Rubrics define what "good" looks like for each task type. See `RUBRICS` in `engine.py`:
- **report** — accuracy, completeness, format, relevance
- **code** — correctness, completeness, quality, relevance
- **analysis** — accuracy, depth, format, relevance
- **content** — accuracy, completeness, quality, SEO/relevance

## Self-Improvement

The feedback loop (`feedback/loop.py`) drives continuous improvement:
1. Client feedback is recorded
2. Patterns are identified (frequent revisions, low ratings)
3. Improvement insights are generated
4. Agent prompts are updated or guardrails are added
5. Review frequency adjusts based on task type performance
