# Agent Roles

Each agent has a specific role, set of tools, and quality criteria.

## Core Agents

### Analyst
- Reads the brief, researches context, creates execution plan
- Tools: web search, document reader, knowledge base
- Output: structured task plan with dependencies

### Builder
- Executes the work based on the Analyst's plan
- Tools: code execution, file creation, API calls, document generation
- Output: deliverable artifacts

### QA Reviewer
- Reviews Builder's output against the brief and rubric
- Tools: rubric scoring, fact checking, format validation
- Output: quality score + flagged issues

### Project Manager
- Coordinates workflow, manages client communication
- Tools: status updates, notifications, escalation
- Output: status reports, delivery summaries

## Specialist Agents (activated per task type)

### Researcher
- Deep research tasks, competitive analysis, market reports
- Tools: web search, PDF extraction, data analysis

### Developer
- Code tasks, integrations, technical implementations
- Tools: code execution, git, API testing, deployment

### Writer
- Content creation, copywriting, documentation
- Tools: document creation, style checking, SEO analysis

### Designer
- UI/UX specifications, design systems, mockup descriptions
- Tools: design token generation, layout specification

## Agent Communication

Agents communicate via structured messages:
```json
{
  "from": "analyst",
  "to": "builder",
  "task_id": "uuid",
  "type": "plan",
  "payload": { ... },
  "timestamp": "ISO-8601"
}
```

## Prompt Templates

Each agent has a base prompt + task-specific injection:
- `base_prompt` — role, capabilities, constraints
- `task_context` — brief, client preferences, past work
- `quality_criteria` — rubric for self-checking
- `output_format` — expected deliverable structure
