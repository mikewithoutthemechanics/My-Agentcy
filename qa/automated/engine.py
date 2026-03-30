"""
My-Agentcy — Automated QA System

The QA layer is the core differentiator. It ensures every deliverable
meets quality standards before reaching the client.

Architecture:
    Deliverable → QA Agent (auto) → Score → Pass? → Deliver
                                    ↓ Fail
                              Human Review → Approve/Reject → Revise
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
import json


# ═══════════════════════════════════════════════════════
# QA SCORING
# ═══════════════════════════════════════════════════════

class ReviewType(str, Enum):
    AUTOMATED = "automated"
    SPOT_CHECK = "spot_check"
    FULL = "full"
    SENIOR = "senior"


class Severity(str, Enum):
    CRITICAL = "critical"  # Must fix before delivery
    MAJOR = "major"        # Should fix, impacts quality
    MINOR = "minor"        # Nice to fix, cosmetic
    INFO = "info"          # Suggestion, not an issue


@dataclass
class QAScore:
    """Quality score for a deliverable."""
    overall: int = 0        # 0-100, weighted average
    accuracy: int = 0       # Factual correctness
    completeness: int = 0   # All requirements met
    format: int = 0         # Structure, formatting, style
    relevance: int = 0      # Addresses the brief

    def weighted_average(self, weights: dict = None) -> int:
        if weights is None:
            weights = {"accuracy": 0.35, "completeness": 0.30, "format": 0.15, "relevance": 0.20}
        return int(
            self.accuracy * weights["accuracy"]
            + self.completeness * weights["completeness"]
            + self.format * weights["format"]
            + self.relevance * weights["relevance"]
        )

    def to_dict(self) -> dict:
        return {
            "overall": self.overall,
            "accuracy": self.accuracy,
            "completeness": self.completeness,
            "format": self.format,
            "relevance": self.relevance,
        }


@dataclass
class QAFlag:
    """A specific issue found during review."""
    field: str                  # Which section/field has the issue
    issue: str                  # Description of the problem
    severity: Severity          # How bad is it
    suggestion: str = ""        # How to fix it
    auto_fixable: bool = False  # Can the agent fix this automatically?


@dataclass
class QAReview:
    """Complete QA review result."""
    task_id: str
    deliverable_id: str
    review_type: ReviewType
    reviewer: str               # "qa_agent" or user_id
    scores: QAScore = field(default_factory=QAScore)
    passed: bool = False
    flags: list[QAFlag] = field(default_factory=list)
    comments: str = ""
    rubric_used: str = ""
    rubric_version: str = ""
    token_usage: dict = field(default_factory=dict)

    def evaluate(self, pass_threshold: int = 85) -> bool:
        """Determine if deliverable passes QA."""
        self.scores.overall = self.scores.weighted_average()
        
        # Fail if any critical flags
        has_critical = any(f.severity == Severity.CRITICAL for f in self.flags)
        if has_critical:
            self.passed = False
            return False

        # Fail if below threshold
        if self.scores.overall < pass_threshold:
            self.passed = False
            return False

        self.passed = True
        return True

    def to_dict(self) -> dict:
        return {
            "task_id": self.task_id,
            "deliverable_id": self.deliverable_id,
            "review_type": self.review_type.value,
            "reviewer": self.reviewer,
            "scores": self.scores.to_dict(),
            "passed": self.passed,
            "flags": [
                {"field": f.field, "issue": f.issue, "severity": f.severity.value,
                 "suggestion": f.suggestion, "auto_fixable": f.auto_fixable}
                for f in self.flags
            ],
            "comments": self.comments,
            "rubric_used": self.rubric_used,
        }


# ═══════════════════════════════════════════════════════
# QA RUBRICS
# ═══════════════════════════════════════════════════════

@dataclass
class RubricCriterion:
    """A single evaluation criterion."""
    name: str
    description: str
    weight: float
    check_questions: list[str]  # Questions the QA agent asks itself


@dataclass
class QARubric:
    """Evaluation rubric for a specific task type."""
    id: str
    task_type: str
    name: str
    version: str = "1.0"
    criteria: list[RubricCriterion] = field(default_factory=list)
    pass_threshold: int = 85

    def to_prompt(self) -> str:
        """Generate QA agent prompt from rubric."""
        lines = [f"## QA Rubric: {self.name} (v{self.version})\n"]
        lines.append(f"Pass threshold: {self.pass_threshold}/100\n")

        for c in self.criteria:
            lines.append(f"### {c.name} (weight: {c.weight})")
            lines.append(f"{c.description}")
            lines.append("Check:")
            for q in c.check_questions:
                lines.append(f"  - {q}")
            lines.append("")

        return "\n".join(lines)


# Default rubrics for common task types
RUBRICS = {
    "report": QARubric(
        id="rubric-report",
        task_type="report",
        name="Report Quality",
        criteria=[
            RubricCriterion(
                name="Accuracy",
                description="Factual correctness of all claims and data",
                weight=0.35,
                check_questions=[
                    "Are all statistics cited with sources?",
                    "Are calculations correct?",
                    "Are there any contradictory statements?",
                    "Is the data up-to-date?",
                ],
            ),
            RubricCriterion(
                name="Completeness",
                description="All required sections and information present",
                weight=0.30,
                check_questions=[
                    "Does it address every point in the brief?",
                    "Are all required sections present?",
                    "Is the executive summary included?",
                    "Are recommendations actionable?",
                ],
            ),
            RubricCriterion(
                name="Format",
                description="Professional structure and presentation",
                weight=0.15,
                check_questions=[
                    "Is the structure logical and clear?",
                    "Are headings and sections consistent?",
                    "Is the language professional?",
                    "Are tables/charts properly formatted?",
                ],
            ),
            RubricCriterion(
                name="Relevance",
                description="Directly addresses the client's needs",
                weight=0.20,
                check_questions=[
                    "Does it answer the core question?",
                    "Is the scope appropriate (not too broad/narrow)?",
                    "Does it consider the target audience?",
                    "Are recommendations relevant to the context?",
                ],
            ),
        ],
    ),
    "code": QARubric(
        id="rubric-code",
        task_type="code",
        name="Code Quality",
        criteria=[
            RubricCriterion(
                name="Correctness",
                description="Code works as intended",
                weight=0.35,
                check_questions=[
                    "Does the code run without errors?",
                    "Does it handle edge cases?",
                    "Are there unit tests?",
                    "Do tests pass?",
                ],
            ),
            RubricCriterion(
                name="Completeness",
                description="All requirements implemented",
                weight=0.30,
                check_questions=[
                    "Are all features from the brief implemented?",
                    "Is error handling comprehensive?",
                    "Are all API endpoints working?",
                    "Is documentation included?",
                ],
            ),
            RubricCriterion(
                name="Quality",
                description="Clean, maintainable, well-structured code",
                weight=0.20,
                check_questions=[
                    "Is the code well-organized?",
                    "Are naming conventions followed?",
                    "Is there unnecessary complexity?",
                    "Are there security concerns?",
                ],
            ),
            RubricCriterion(
                name="Relevance",
                description="Solves the right problem",
                weight=0.15,
                check_questions=[
                    "Does it solve the stated problem?",
                    "Is the approach appropriate?",
                    "Are dependencies reasonable?",
                ],
            ),
        ],
    ),
    "analysis": QARubric(
        id="rubric-analysis",
        task_type="analysis",
        name="Analysis Quality",
        criteria=[
            RubricCriterion(
                name="Accuracy",
                description="Data and conclusions are correct",
                weight=0.35,
                check_questions=[
                    "Is the data source reliable?",
                    "Are statistical methods appropriate?",
                    "Are conclusions supported by evidence?",
                    "Are limitations acknowledged?",
                ],
            ),
            RubricCriterion(
                name="Depth",
                description="Sufficiently thorough analysis",
                weight=0.25,
                check_questions=[
                    "Are multiple perspectives considered?",
                    "Is the root cause identified?",
                    "Are trends and patterns identified?",
                    "Is the analysis actionable?",
                ],
            ),
            RubricCriterion(
                name="Format",
                description="Clear presentation of findings",
                weight=0.15,
                check_questions=[
                    "Are visualizations clear and accurate?",
                    "Is the narrative logical?",
                    "Can a non-expert understand it?",
                ],
            ),
            RubricCriterion(
                name="Relevance",
                description="Addresses the core question",
                weight=0.25,
                check_questions=[
                    "Does it answer what was asked?",
                    "Are recommendations practical?",
                    "Is the scope appropriate?",
                ],
            ),
        ],
    ),
    "content": QARubric(
        id="rubric-content",
        task_type="content",
        name="Content Quality",
        criteria=[
            RubricCriterion(
                name="Accuracy",
                description="Factual correctness",
                weight=0.25,
                check_questions=[
                    "Are all facts verified?",
                    "Are quotes attributed correctly?",
                    "Is the tone appropriate?",
                ],
            ),
            RubricCriterion(
                name="Completeness",
                description="All required content present",
                weight=0.25,
                check_questions=[
                    "Does it cover all requested topics?",
                    "Is the word count appropriate?",
                    "Are all sections complete?",
                ],
            ),
            RubricCriterion(
                name="Quality",
                description="Writing quality and engagement",
                weight=0.30,
                check_questions=[
                    "Is the writing clear and concise?",
                    "Is it engaging for the target audience?",
                    "Is grammar and spelling correct?",
                    "Does it have a clear structure?",
                ],
            ),
            RubricCriterion(
                name="SEO/Relevance",
                description="Optimized and relevant",
                weight=0.20,
                check_questions=[
                    "Are target keywords included naturally?",
                    "Is the content relevant to the audience?",
                    "Does it match the brand voice?",
                ],
            ),
        ],
    ),
}


# ═══════════════════════════════════════════════════════
# QA AGENT SYSTEM PROMPT
# ═══════════════════════════════════════════════════════

QA_SYSTEM_PROMPT = """You are a meticulous QA reviewer for an AI agency. Your job is to evaluate 
deliverables against client briefs and quality rubrics.

## Your Process

1. **Read the brief** — Understand what the client asked for
2. **Read the rubric** — Know what criteria to evaluate against
3. **Review the deliverable** — Check each criterion systematically
4. **Score each dimension** — 0-100 scale with justification
5. **Flag issues** — Specific, actionable feedback
6. **Decide pass/fail** — Based on threshold and critical flags

## Scoring Guidelines

- **90-100:** Exceptional, exceeds expectations
- **80-89:** Good, meets all requirements with minor issues
- **70-79:** Acceptable, meets most requirements but needs improvement
- **60-69:** Below expectations, significant issues
- **Below 60:** Unacceptable, major revision needed

## Flag Severity

- **CRITICAL:** Must fix. Blocks delivery. (Factual errors, missing requirements, broken code)
- **MAJOR:** Should fix. Impacts quality noticeably. (Weak analysis, poor formatting, missing sources)
- **MINOR:** Nice to fix. Cosmetic or style issues. (Typos, inconsistent formatting, awkward phrasing)
- **INFO:** Suggestion for improvement. Not an issue.

## Output Format

Respond with a JSON object:
```json
{
    "scores": {
        "accuracy": 85,
        "completeness": 90,
        "format": 80,
        "relevance": 88
    },
    "flags": [
        {
            "field": "section_name",
            "issue": "Description of the problem",
            "severity": "major",
            "suggestion": "How to fix it",
            "auto_fixable": true
        }
    ],
    "comments": "Overall assessment in 2-3 sentences",
    "passed": true
}
```

Be strict but fair. Your job is to ensure quality, not to be nice.
"""

# ═══════════════════════════════════════════════════════
# TIER CLASSIFICATION
# ═══════════════════════════════════════════════════════

TIER_RULES = {
    "T0": {
        "name": "Automated Only",
        "description": "QA agent reviews, no human needed",
        "review_type": ReviewType.AUTOMATED,
        "pass_threshold": 80,
        "sample_rate": 0.0,  # No spot checks
        "task_types": ["data_entry", "formatting", "translation", "summarization", "extraction"],
    },
    "T1": {
        "name": "Spot Check",
        "description": "QA agent reviews all, human spot-checks 20%",
        "review_type": ReviewType.AUTOMATED,
        "pass_threshold": 85,
        "sample_rate": 0.2,
        "task_types": ["report", "analysis", "code", "content", "research"],
    },
    "T2": {
        "name": "Full Review",
        "description": "QA agent + full human review",
        "review_type": ReviewType.FULL,
        "pass_threshold": 90,
        "sample_rate": 1.0,
        "task_types": ["strategy", "design", "client_facing", "proposal"],
    },
    "T3": {
        "name": "Senior Review",
        "description": "QA agent + senior human + client sign-off",
        "review_type": ReviewType.SENIOR,
        "pass_threshold": 95,
        "sample_rate": 1.0,
        "task_types": ["legal", "financial", "compliance", "contract", "brand_critical"],
    },
}


def classify_tier(task_type: str, priority: int = 3) -> str:
    """Auto-classify a task into a QA tier."""
    for tier, rules in TIER_RULES.items():
        if task_type in rules["task_types"]:
            # Escalate if high priority
            if priority == 1 and tier in ("T0", "T1"):
                return "T2"
            return tier
    # Default to T1
    return "T1"


def get_rubric(task_type: str) -> Optional[QARubric]:
    """Get the appropriate rubric for a task type."""
    return RUBRICS.get(task_type)


# ═══════════════════════════════════════════════════════
# QA PIPELINE
# ═══════════════════════════════════════════════════════

class QAPipeline:
    """
    Full QA pipeline that routes deliverables through
    the appropriate review process based on tier.
    """

    def __init__(self):
        self.reviews: list[QAReview] = []

    async def review_deliverable(
        self,
        task_id: str,
        deliverable_id: str,
        brief: dict,
        deliverable: dict,
        task_type: str,
        tier: str = "T1",
    ) -> QAReview:
        """Run QA review on a deliverable."""

        rubric = get_rubric(task_type)
        tier_rules = TIER_RULES.get(tier, TIER_RULES["T1"])

        review = QAReview(
            task_id=task_id,
            deliverable_id=deliverable_id,
            review_type=tier_rules["review_type"],
            reviewer="qa_agent",
            rubric_used=rubric.id if rubric else "default",
            rubric_version=rubric.version if rubric else "1.0",
        )

        # Step 1: Automated QA
        automated_result = await self._run_automated_review(
            brief, deliverable, rubric, tier_rules["pass_threshold"]
        )
        review.scores = automated_result["scores"]
        review.flags = automated_result["flags"]
        review.comments = automated_result["comments"]
        review.evaluate(tier_rules["pass_threshold"])

        # Step 2: Determine if human review needed
        needs_human = self._needs_human_review(review, tier, tier_rules)

        if needs_human:
            review.review_type = ReviewType.FULL if tier in ("T2", "T3") else ReviewType.SPOT_CHECK
            # Queue for human review
            review.comments += " [Queued for human review]"

        self.reviews.append(review)
        return review

    async def _run_automated_review(
        self,
        brief: dict,
        deliverable: dict,
        rubric: Optional[QARubric],
        threshold: int,
    ) -> dict:
        """
        Run automated QA using the QA agent.
        
        In production, this calls the LLM with the QA_SYSTEM_PROMPT + rubric + brief + deliverable.
        For now, returns the structure for integration.
        """
        # This is where the CrewAI QA agent gets called
        # The agent receives: QA_SYSTEM_PROMPT, rubric.to_prompt(), brief, deliverable
        # Returns: scores, flags, comments

        return {
            "scores": QAScore(
                accuracy=0,
                completeness=0,
                format=0,
                relevance=0,
            ),
            "flags": [],
            "comments": "Pending agent integration",
        }

    def _needs_human_review(self, review: QAReview, tier: str, rules: dict) -> bool:
        """Determine if a human needs to review this."""
        # T2+ always get human review
        if tier in ("T2", "T3"):
            return True

        # Failed automated review → human
        if not review.passed:
            return True

        # Has critical or major flags → human
        if any(f.severity in (Severity.CRITICAL, Severity.MAJOR) for f in review.flags):
            return True

        # T1 spot check sampling
        import random
        if random.random() < rules.get("sample_rate", 0):
            return True

        return False

    def get_stats(self) -> dict:
        """Get QA pipeline statistics."""
        total = len(self.reviews)
        if total == 0:
            return {"total": 0}

        passed = sum(1 for r in self.reviews if r.passed)
        automated = sum(1 for r in self.reviews if r.review_type == ReviewType.AUTOMATED)
        human = total - automated

        avg_score = sum(r.scores.overall for r in self.reviews) / total

        return {
            "total_reviews": total,
            "pass_rate": round(passed / total * 100, 1),
            "avg_score": round(avg_score, 1),
            "automated_reviews": automated,
            "human_reviews": human,
            "auto_pass_rate": round(
                sum(1 for r in self.reviews if r.review_type == ReviewType.AUTOMATED and r.passed) / max(automated, 1) * 100, 1
            ),
        }
