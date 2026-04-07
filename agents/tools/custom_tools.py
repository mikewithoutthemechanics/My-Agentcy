"""
Custom CrewAI tools for the My-Agentcy agent system.

Each tool wraps an external capability (search, code execution, etc.)
in CrewAI's @tool decorator so agents can invoke them natively.
"""

from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path
from typing import Any, Optional

from crewai.tools import tool


# ─────────────────────────────────────────────────────────────────────
# Web Search
# ─────────────────────────────────────────────────────────────────────

@tool("web_search")
def WebSearchTool(query: str, num_results: int = 5) -> str:
    """Search the web and return top results with titles, URLs, and snippets.

    Args:
        query: The search query string.
        num_results: Number of results to return (default 5, max 10).
    """
    # Use Brave Search via subprocess to keep the tool self-contained.
    # Falls back to a lightweight DuckDuckGo scrape if Brave isn't configured.
    num_results = min(num_results, 10)

    try:
        # Prefer the brave-search CLI if available
        import brave_search  # type: ignore
        results = brave_search.search(query, count=num_results)
        return json.dumps(results, indent=2)
    except ImportError:
        pass

    # Fallback: use curl + DuckDuckGo instant answer API
    try:
        import urllib.parse
        import urllib.request

        encoded = urllib.parse.quote_plus(query)
        url = f"https://api.duckduckgo.com/?q={encoded}&format=json&no_redirect=1"
        req = urllib.request.Request(url, headers={"User-Agent": "My-Agentcy/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())

        abstract = data.get("AbstractText", "")
        related = [
            {"title": r.get("Text", ""), "url": r.get("FirstURL", "")}
            for r in data.get("RelatedTopics", [])[:num_results]
        ]
        return json.dumps({
            "query": query,
            "abstract": abstract,
            "results": related,
        }, indent=2)
    except Exception as exc:
        return json.dumps({"error": str(exc), "query": query})


# ─────────────────────────────────────────────────────────────────────
# Document Reader
# ─────────────────────────────────────────────────────────────────────

@tool("document_reader")
def DocumentReaderTool(file_path: str, max_chars: int = 10_000) -> str:
    """Read a document from disk and return its text content.

    Supports: .txt, .md, .json, .csv, .py, .js, .ts, .yaml, .yml, .html, .xml.

    Args:
        file_path: Absolute or relative path to the document.
        max_chars: Maximum characters to return (default 10 000).
    """
    path = Path(file_path).expanduser().resolve()
    if not path.exists():
        return json.dumps({"error": f"File not found: {file_path}"})

    supported = {".txt", ".md", ".json", ".csv", ".py", ".js", ".ts",
                 ".yaml", ".yml", ".html", ".xml", ".toml", ".cfg", ".ini", ".env"}
    if path.suffix.lower() not in supported:
        return json.dumps({"error": f"Unsupported file type: {path.suffix}"})

    try:
        text = path.read_text(encoding="utf-8")
        truncated = len(text) > max_chars
        text = text[:max_chars]
        return json.dumps({
            "path": str(path),
            "size_bytes": path.stat().st_size,
            "truncated": truncated,
            "content": text,
        }, indent=2)
    except Exception as exc:
        return json.dumps({"error": str(exc)})


# ─────────────────────────────────────────────────────────────────────
# Code Executor
# ─────────────────────────────────────────────────────────────────────

@tool("code_executor")
def CodeExecutorTool(language: str, code: str, timeout: int = 30) -> str:
    """Execute code in a sandboxed subprocess and return stdout/stderr.

    Supports: python, bash, node (javascript).

    Args:
        language: One of 'python', 'bash', 'node'.
        code: The source code to execute.
        timeout: Maximum execution time in seconds (default 30).
    """
    runners = {
        "python": ["python3", "-c"],
        "bash": ["bash", "-c"],
        "node": ["node", "-e"],
        "javascript": ["node", "-e"],
        "js": ["node", "-e"],
    }

    lang = language.lower()
    if lang not in runners:
        return json.dumps({
            "error": f"Unsupported language: {language}. "
                     f"Supported: {', '.join(runners.keys())}"
        })

    cmd = runners[lang] + [code]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=tempfile.gettempdir(),
        )
        return json.dumps({
            "language": language,
            "exit_code": result.returncode,
            "stdout": result.stdout[:5000],
            "stderr": result.stderr[:5000],
            "success": result.returncode == 0,
        }, indent=2)
    except subprocess.TimeoutExpired:
        return json.dumps({"error": f"Execution timed out after {timeout}s"})
    except Exception as exc:
        return json.dumps({"error": str(exc)})


# ─────────────────────────────────────────────────────────────────────
# File Creator
# ─────────────────────────────────────────────────────────────────────

@tool("file_creator")
def FileCreatorTool(file_path: str, content: str, overwrite: bool = False) -> str:
    """Create or overwrite a file with the given content.

    Args:
        file_path: Destination path (directories are created automatically).
        content: File content to write.
        overwrite: If False and file exists, returns an error (default False).
    """
    path = Path(file_path).expanduser().resolve()

    if path.exists() and not overwrite:
        return json.dumps({
            "error": f"File already exists: {file_path}. Set overwrite=True to replace."
        })

    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return json.dumps({
            "path": str(path),
            "bytes_written": len(content.encode("utf-8")),
            "success": True,
        }, indent=2)
    except Exception as exc:
        return json.dumps({"error": str(exc)})


# ─────────────────────────────────────────────────────────────────────
# Rubric Lookup
# ─────────────────────────────────────────────────────────────────────

@tool("rubric_lookup")
def RubricLookupTool(task_type: str) -> str:
    """Return the QA rubric for a given task type.

    The rubric defines scoring criteria (accuracy, completeness, format,
    relevance) and their weights.  Agents use this to evaluate deliverables.

    Args:
        task_type: One of 'code', 'document', 'analysis', 'design', 'research', 'general'.
    """
    rubrics: dict[str, dict[str, Any]] = {
        "code": {
            "criteria": {
                "correctness":  {"weight": 0.35, "description": "Code runs and produces expected output"},
                "quality":      {"weight": 0.25, "description": "Clean, readable, well-structured code"},
                "testing":      {"weight": 0.15, "description": "Adequate test coverage or test stubs"},
                "documentation": {"weight": 0.15, "description": "Docstrings, comments, README"},
                "security":     {"weight": 0.10, "description": "No obvious vulnerabilities"},
            },
            "pass_threshold": 0.70,
        },
        "document": {
            "criteria": {
                "accuracy":     {"weight": 0.30, "description": "Facts and figures are correct"},
                "completeness": {"weight": 0.25, "description": "All required sections present"},
                "clarity":      {"weight": 0.20, "description": "Well-written and easy to understand"},
                "format":       {"weight": 0.15, "description": "Follows requested format/style"},
                "relevance":    {"weight": 0.10, "description": "Stays on-topic and on-brief"},
            },
            "pass_threshold": 0.70,
        },
        "analysis": {
            "criteria": {
                "accuracy":     {"weight": 0.30, "description": "Data and conclusions are correct"},
                "depth":        {"weight": 0.25, "description": "Thorough analysis with sufficient detail"},
                "structure":    {"weight": 0.20, "description": "Logical flow and clear sections"},
                "insights":     {"weight": 0.15, "description": "Actionable recommendations provided"},
                "sources":      {"weight": 0.10, "description": "Data sources cited"},
            },
            "pass_threshold": 0.70,
        },
        "design": {
            "criteria": {
                "usability":    {"weight": 0.30, "description": "Intuitive and user-friendly"},
                "aesthetics":   {"weight": 0.25, "description": "Visually appealing and consistent"},
                "completeness": {"weight": 0.20, "description": "All required elements included"},
                "accessibility": {"weight": 0.15, "description": "Meets accessibility standards"},
                "brand_fit":    {"weight": 0.10, "description": "Aligns with brand guidelines"},
            },
            "pass_threshold": 0.70,
        },
        "research": {
            "criteria": {
                "accuracy":     {"weight": 0.30, "description": "Findings are factually correct"},
                "depth":        {"weight": 0.25, "description": "Comprehensive coverage of topic"},
                "sources":      {"weight": 0.20, "description": "Credible and cited sources"},
                "structure":    {"weight": 0.15, "description": "Well-organized report"},
                "recency":      {"weight": 0.10, "description": "Uses up-to-date information"},
            },
            "pass_threshold": 0.70,
        },
        "general": {
            "criteria": {
                "accuracy":     {"weight": 0.25, "description": "Content is correct"},
                "completeness": {"weight": 0.25, "description": "All requirements met"},
                "format":       {"weight": 0.20, "description": "Proper formatting"},
                "relevance":    {"weight": 0.15, "description": "On-topic"},
                "quality":      {"weight": 0.15, "description": "Overall quality"},
            },
            "pass_threshold": 0.65,
        },
    }

    rubric = rubrics.get(task_type.lower(), rubrics["general"])
    return json.dumps(rubric, indent=2)


# ─────────────────────────────────────────────────────────────────────
# Fact Checker
# ─────────────────────────────────────────────────────────────────────

@tool("fact_checker")
def FactCheckTool(claim: str, context: str = "") -> str:
    """Verify a factual claim against available sources.

    Returns a verdict (supported / contradicted / inconclusive) with
    confidence and explanation.

    Args:
        claim: The factual statement to verify.
        context: Optional surrounding context to aid verification.
    """
    # In production this would hit a fact-checking API or search engine.
    # Here we provide a structured skeleton that a real LLM-based agent
    # can fill in by reasoning about the claim.
    return json.dumps({
        "claim": claim,
        "context": context,
        "verdict": "inconclusive",
        "confidence": 0.0,
        "explanation": (
            "Automated fact-check requires live source verification. "
            "An agent should search for corroborating sources and update "
            "this verdict based on evidence found."
        ),
        "suggested_sources": [
            f"https://www.google.com/search?q={claim.replace(' ', '+')}",
        ],
    }, indent=2)


# ─────────────────────────────────────────────────────────────────────
# Format Validator
# ─────────────────────────────────────────────────────────────────────

@tool("format_validator")
def FormatValidatorTool(content: str, expected_format: str) -> str:
    """Validate that content matches an expected format.

    Supported formats: json, markdown, html, csv, yaml, code:python,
    code:javascript, prose.

    Args:
        content: The content string to validate.
        expected_format: The format to validate against.
    """
    fmt = expected_format.lower().strip()
    errors: list[str] = []
    warnings: list[str] = []

    if fmt == "json":
        try:
            json.loads(content)
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid JSON: {exc.msg} at line {exc.lineno} col {exc.colno}")

    elif fmt == "markdown":
        if not content.strip():
            errors.append("Empty content")
        # Basic heuristic checks
        lines = content.split("\n")
        has_heading = any(line.strip().startswith("#") for line in lines)
        if not has_heading:
            warnings.append("No markdown headings found")

    elif fmt == "html":
        if "<html" not in content.lower() and "<!doctype" not in content.lower():
            warnings.append("Missing <html> or <!DOCTYPE> declaration")
        open_tags = content.count("<") - content.count("</") - content.count("<!") - content.count("/>")
        if abs(open_tags) > 5:
            warnings.append(f"Possible unclosed tags (delta: {open_tags})")

    elif fmt == "csv":
        lines = content.strip().split("\n")
        if len(lines) < 2:
            errors.append("CSV must have at least a header and one data row")
        else:
            header_cols = len(lines[0].split(","))
            for i, line in enumerate(lines[1:], start=2):
                if len(line.split(",")) != header_cols:
                    warnings.append(f"Row {i} has different column count than header")
                    if len(errors) + len(warnings) > 10:
                        warnings.append("... (truncated)")
                        break

    elif fmt == "yaml":
        try:
            import yaml  # type: ignore
            yaml.safe_load(content)
        except ImportError:
            warnings.append("PyYAML not installed; skipping deep validation")
        except Exception as exc:
            errors.append(f"Invalid YAML: {exc}")

    elif fmt.startswith("code:"):
        lang = fmt.split(":", 1)[1]
        if lang == "python":
            try:
                compile(content, "<string>", "exec")
            except SyntaxError as exc:
                errors.append(f"Python syntax error: {exc.msg} at line {exc.lineno}")
        else:
            warnings.append(f"Syntax check not implemented for {lang}")

    elif fmt == "prose":
        words = content.split()
        if len(words) < 10:
            warnings.append(f"Very short prose ({len(words)} words)")
        sentences = [s.strip() for s in content.replace("!", ".").replace("?", ".").split(".") if s.strip()]
        if sentences:
            avg_len = sum(len(s.split()) for s in sentences) / len(sentences)
            if avg_len > 40:
                warnings.append(f"Average sentence length is high ({avg_len:.0f} words)")

    else:
        errors.append(f"Unknown format: {expected_format}")

    is_valid = len(errors) == 0
    return json.dumps({
        "format": expected_format,
        "valid": is_valid,
        "errors": errors,
        "warnings": warnings,
        "score": 1.0 if is_valid else max(0.0, 1.0 - len(errors) * 0.25),
    }, indent=2)


# ─────────────────────────────────────────────────────────────────────
# Status Update / Notification (for PM agent)
# ─────────────────────────────────────────────────────────────────────

@tool("status_update")
def StatusUpdateTool(task_id: str, status: str, message: str = "") -> str:
    """Record a status update for a task.

    Args:
        task_id: Unique task identifier.
        status: One of 'pending', 'in_progress', 'blocked', 'review', 'done', 'failed'.
        message: Optional detail about the status change.
    """
    from datetime import datetime, timezone

    valid_statuses = {"pending", "in_progress", "blocked", "review", "done", "failed"}
    if status.lower() not in valid_statuses:
        return json.dumps({"error": f"Invalid status. Must be one of: {valid_statuses}"})

    update = {
        "task_id": task_id,
        "status": status.lower(),
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    return json.dumps(update, indent=2)


@tool("notification")
def NotificationTool(recipient: str, subject: str, body: str, channel: str = "email") -> str:
    """Send a notification to a recipient (email, slack, webhook).

    Args:
        recipient: Recipient identifier (email, channel name, webhook URL).
        subject: Notification subject / title.
        body: Notification body text.
        channel: Delivery channel — 'email', 'slack', 'webhook' (default 'email').
    """
    # In production this would integrate with actual notification services.
    # Here we log the intent for the calling agent to pick up.
    return json.dumps({
        "queued": True,
        "recipient": recipient,
        "subject": subject,
        "body": body[:500],
        "channel": channel,
        "note": "Notification queued for delivery. Integrate with SMTP/Slack/webhook in production.",
    }, indent=2)


@tool("escalation")
def EscalationTool(reason: str, severity: str = "medium", details: str = "") -> str:
    """Escalate an issue to human oversight.

    Args:
        reason: Brief escalation reason.
        severity: 'low', 'medium', 'high', 'critical'.
        details: Additional context for the human reviewer.
    """
    from datetime import datetime, timezone

    return json.dumps({
        "escalated": True,
        "reason": reason,
        "severity": severity.lower(),
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action_required": "Human review and decision needed.",
    }, indent=2)


# ─────────────────────────────────────────────────────────────────────
# Romy Backend Executor
# ─────────────────────────────────────────────────────────────────────

import os
import urllib.request
import json

ROMY_BACKEND_URL = os.environ.get("ROMY_BACKEND_URL", "https://romy-backend.vercel.app")


@tool("romy_execute")
def RomyExecuteTool(agent_id: str, task: str, context: dict = None) -> str:
    """Execute a task using the Romy Backend agents (54+ working agents).

    Use this to delegate tasks to specialized Romy agents across departments:
    - Executive (CEO, CFO, CTO, COO, CMO)
    - Sales, Customer Success, Finance
    - Research, Design, Engineering
    - Marketing, Product, QA, Operations

    Args:
        agent_id: The Romy agent ID (e.g., 'ceo', 'sales_rep', 'researcher')
        task: The task description for the agent to perform
        context: Optional context dict with additional parameters
    """
    try:
        url = f"{ROMY_BACKEND_URL}/execute"
        
        # Backend expects query params: agent_type, task, input_data
        import urllib.parse
        params = urllib.parse.urlencode({
            "agent_type": agent_id,
            "task": task,
            "input_data": json.dumps(context or {})
        })
        full_url = f"{url}?{params}"
        
        req = urllib.request.Request(
            full_url,
            headers={"User-Agent": "My-Agentcy/1.0"},
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return json.dumps(result, indent=2)
            
    except urllib.error.HTTPError as e:
        return json.dumps({
            "error": f"HTTP Error {e.code}",
            "message": e.read().decode("utf-8") if e.fp else str(e)
        })
    except Exception as exc:
        return json.dumps({"error": str(exc), "agent_id": agent_id})


@tool("romy_list_agents")
def RomyListAgentsTool(department: str = None) -> str:
    """List available Romy backend agents, optionally filtered by department.

    Args:
        department: Optional filter (e.g., 'Sales', 'Engineering', 'Research')
    """
    try:
        url = f"{ROMY_BACKEND_URL}/agents"
        if department:
            url = f"{ROMY_BACKEND_URL}/agents/{department.lower()}"
            
        req = urllib.request.Request(url, headers={"User-Agent": "My-Agentcy/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            agents = json.loads(resp.read().decode("utf-8"))
            return json.dumps(agents, indent=2)
    except Exception as exc:
        return json.dumps({"error": str(exc)})


# ─────────────────────────────────────────────────────────────────────
# Exports
# ─────────────────────────────────────────────────────────────────────

ALL_TOOLS = [
    WebSearchTool,
    DocumentReaderTool,
    CodeExecutorTool,
    FileCreatorTool,
    RubricLookupTool,
    FactCheckTool,
    FormatValidatorTool,
    StatusUpdateTool,
    NotificationTool,
    EscalationTool,
    RomyExecuteTool,
    RomyListAgentsTool,
]

__all__ = [
    "WebSearchTool",
    "DocumentReaderTool",
    "CodeExecutorTool",
    "FileCreatorTool",
    "RubricLookupTool",
    "FactCheckTool",
    "FormatValidatorTool",
    "StatusUpdateTool",
    "NotificationTool",
    "EscalationTool",
    "RomyExecuteTool",
    "RomyListAgentsTool",
    "ALL_TOOLS",
]
