-- seed/rubrics.sql
-- Default QA rubrics for common task types

-- ============================================================
-- REPORT RUBRIC
-- ============================================================

INSERT INTO rubrics (task_type, name, criteria, version, is_active) VALUES
('report', 'Standard Report QA', '{
  "accuracy": {
    "description": "Facts, figures, and claims are correct and verifiable",
    "weight": 0.30,
    "checks": ["source_citation", "data_consistency", "no_hallucinations"]
  },
  "completeness": {
    "description": "All required sections and data points are covered",
    "weight": 0.25,
    "checks": ["executive_summary", "methodology", "findings", "recommendations"]
  },
  "format": {
    "description": "Follows proper report structure and formatting",
    "weight": 0.15,
    "checks": ["headings_hierarchy", "page_numbers", "table_of_contents", "appendices"]
  },
  "relevance": {
    "description": "Content directly addresses the brief requirements",
    "weight": 0.20,
    "checks": ["scope_alignment", "audience_appropriate", "actionable_insights"]
  },
  "clarity": {
    "description": "Writing is clear, concise, and professional",
    "weight": 0.10,
    "checks": ["grammar", "jargon_appropriate", "readability"]
  }
}', 1, true);

-- ============================================================
-- CODE RUBRIC
-- ============================================================

INSERT INTO rubrics (task_type, name, criteria, version, is_active) VALUES
('code', 'Code Quality QA', '{
  "correctness": {
    "description": "Code produces expected output and handles edge cases",
    "weight": 0.30,
    "checks": ["unit_tests_pass", "edge_cases_handled", "no_syntax_errors"]
  },
  "security": {
    "description": "No vulnerabilities, proper input validation, safe defaults",
    "weight": 0.20,
    "checks": ["input_sanitization", "no_secrets_exposed", "auth_checks", "sql_injection_safe"]
  },
  "maintainability": {
    "description": "Clean, well-structured, follows conventions",
    "weight": 0.20,
    "checks": ["naming_conventions", "dry_principle", "function_length", "separation_of_concerns"]
  },
  "performance": {
    "description": "Efficient algorithms and resource usage",
    "weight": 0.15,
    "checks": ["time_complexity", "memory_usage", "no_unnecessary_queries"]
  },
  "documentation": {
    "description": "Code is properly documented with comments and README",
    "weight": 0.15,
    "checks": ["inline_comments", "api_docs", "setup_instructions"]
  }
}', 1, true);

-- ============================================================
-- ANALYSIS RUBRIC
-- ============================================================

INSERT INTO rubrics (task_type, name, criteria, version, is_active) VALUES
('analysis', 'Analysis QA', '{
  "methodology": {
    "description": "Analytical approach is sound and appropriate",
    "weight": 0.25,
    "checks": ["method_appropriate", "assumptions_stated", "limitations_acknowledged"]
  },
  "data_quality": {
    "description": "Data sources are reliable and properly handled",
    "weight": 0.25,
    "checks": ["source_credibility", "data_cleanliness", "sample_size_adequate"]
  },
  "insights": {
    "description": "Findings are meaningful and actionable",
    "weight": 0.25,
    "checks": ["non_obvious_patterns", "actionable_recommendations", "risk_assessment"]
  },
  "presentation": {
    "description": "Visualizations and tables enhance understanding",
    "weight": 0.15,
    "checks": ["charts_accurate", "tables_readable", "visual_hierarchy"]
  },
  "reproducibility": {
    "description": "Analysis can be reproduced with documented steps",
    "weight": 0.10,
    "checks": ["code_included", "data_sources_cited", "steps_documented"]
  }
}', 1, true);

-- ============================================================
-- CONTENT RUBRIC
-- ============================================================

INSERT INTO rubrics (task_type, name, criteria, version, is_active) VALUES
('content', 'Content QA', '{
  "quality": {
    "description": "Writing quality, tone, and style are professional",
    "weight": 0.25,
    "checks": ["grammar_perfect", "tone_consistent", "engagement_level"]
  },
  "accuracy": {
    "description": "Claims and information are factually correct",
    "weight": 0.20,
    "checks": ["fact_checked", "sources_cited", "no_misinformation"]
  },
  "seo": {
    "description": "Content is optimized for discoverability",
    "weight": 0.15,
    "checks": ["keywords_natural", "meta_description", "heading_structure"]
  },
  "audience_fit": {
    "description": "Content matches target audience expectations",
    "weight": 0.20,
    "checks": ["reading_level", "jargon_appropriate", "value_proposition_clear"]
  },
  "completeness": {
    "description": "All requested elements are included",
    "weight": 0.20,
    "checks": ["required_sections", "word_count_met", "cta_included"]
  }
}', 1, true);

-- ============================================================
-- DATA RUBRIC
-- ============================================================

INSERT INTO rubrics (task_type, name, criteria, version, is_active) VALUES
('data', 'Data Pipeline QA', '{
  "accuracy": {
    "description": "Data transformations produce correct results",
    "weight": 0.30,
    "checks": ["row_counts_match", "aggregations_correct", "no_data_loss"]
  },
  "completeness": {
    "description": "All required fields and records are processed",
    "weight": 0.25,
    "checks": ["null_handling", "missing_data_strategy", "deduplication"]
  },
  "schema": {
    "description": "Output matches expected schema and types",
    "weight": 0.20,
    "checks": ["column_types", "constraints_satisfied", "relationships_valid"]
  },
  "performance": {
    "description": "Pipeline runs efficiently at scale",
    "weight": 0.15,
    "checks": ["execution_time", "memory_efficiency", "parallelizable"]
  },
  "reliability": {
    "description": "Pipeline handles errors gracefully",
    "weight": 0.10,
    "checks": ["error_handling", "retry_logic", "logging"]
  }
}', 1, true);
