"""
Profession Bundles - Ready-to-use agent packs for clients

Each bundle contains multiple agents optimized for a specific profession.
"""

from enum import Enum


class Bundle(str, Enum):
    SALES = "sales"
    MARKETING = "marketing"
    DEVELOPMENT = "development"
    OPERATIONS = "operations"
    EXECUTIVE = "executive"
    CUSTOMER_SUCCESS = "customer_success"
    DESIGN = "design"
    RESEARCH = "research"


# Bundle definitions - maps bundle to its agent configuration
BUNDLES = {
    Bundle.SALES: {
        "name": "Sales Team",
        "description": "Complete salesforce - lead generation to deal closing",
        "agents": [
            {"id": "sdr", "name": "Sales Development Rep", "role": "cold_outreach, lead_qualification, meeting_booking"},
            {"id": "ae", "name": "Account Executive", "role": "discovery_calls, presentations, proposals, closing"},
            {"id": "closer", "name": "Deal Closer", "role": "contract_review, objection_handling, final_negotiation"},
            {"id": "account_manager", "name": "Account Manager", "role": "account_health, upselling, renewals"},
            {"id": "vp_sales", "name": "VP of Sales", "role": "sales_strategy, pipeline, forecasting"},
            {"id": "sales_pipeline_analyst", "name": "Pipeline Analyst", "role": "metrics, forecasting, optimization"},
        ],
    },
    Bundle.MARKETING: {
        "name": "Marketing Team",
        "description": "Full-stack marketing - SEO, content, social, paid",
        "agents": [
            {"id": "seo_specialist", "name": "SEO Specialist", "role": "keyword_research, on_page_seo, link_building"},
            {"id": "content_creator", "name": "Content Creator", "role": "blog_posts, social_content, campaigns"},
            {"id": "social_media_manager", "name": "Social Media Manager", "role": "posting, community, analytics"},
            {"id": "email_marketer", "name": "Email Marketer", "role": "campaigns, automation, segmentation"},
            {"id": "paid_ads_manager", "name": "Paid Ads Manager", "role": "google_ads, facebook_ads, optimization"},
            {"id": "copywriter", "name": "Copywriter", "role": "ad_copy, landing_pages, product_descriptions"},
            {"id": "marketing_director", "name": "Marketing Director", "role": "strategy, campaigns, budget"},
        ],
    },
    Bundle.DEVELOPMENT: {
        "name": "Development Team",
        "description": "Engineering squad - build to deployment",
        "agents": [
            {"id": "frontend_dev", "name": "Frontend Developer", "role": "react, vue, ui, responsive"},
            {"id": "backend_dev", "name": "Backend Developer", "role": "python, node, apis, databases"},
            {"id": "fullstack_developer", "name": "Full Stack Developer", "role": "frontend, backend, full_stack"},
            {"id": "devops", "name": "DevOps Engineer", "role": "ci_cd, cloud, monitoring, deployments"},
            {"id": "qa_engineer", "name": "QA Engineer", "role": "testing, bug_tracking, regression"},
            {"id": "security_engineer", "name": "Security Engineer", "role": "penetration_testing, vulnerability_scan"},
            {"id": "tech_lead", "name": "Tech Lead", "role": "architecture, code_review, mentoring"},
        ],
    },
    Bundle.OPERATIONS: {
        "name": "Operations Team",
        "description": "Day-to-day business running",
        "agents": [
            {"id": "project_manager", "name": "Project Manager", "role": "planning, timeline, resources, reporting"},
            {"id": "virtual_assistant", "name": "Virtual Assistant", "role": "scheduling, email, calendar, research"},
            {"id": "bookkeeper", "name": "Bookkeeper", "role": "invoicing, expenses, reconciliation"},
            {"id": "hr_manager", "name": "HR Manager", "role": "hiring, onboarding, compliance"},
            {"id": "recruiter", "name": "Recruiter", "role": "job_postings, sourcing, interviews"},
            {"id": "operations_manager", "name": "Operations Manager", "role": "process_optimization, workflows"},
        ],
    },
    Bundle.EXECUTIVE: {
        "name": "Executive Suite",
        "description": "C-level strategic decision making",
        "agents": [
            {"id": "ceo", "name": "Chief Executive Officer", "role": "strategic_planning, board_comms, vision"},
            {"id": "cfo", "name": "Chief Financial Officer", "role": "financial_planning, budgeting, investment"},
            {"id": "cto", "name": "Chief Technology Officer", "role": "tech_strategy, architecture, security"},
            {"id": "cmo", "name": "Chief Marketing Officer", "role": "marketing_strategy, brand, campaigns"},
            {"id": "coo", "name": "Chief Operating Officer", "role": "operations, processes, execution"},
            {"id": "cpo", "name": "Chief Product Officer", "role": "product_strategy, roadmap, launch"},
        ],
    },
    Bundle.CUSTOMER_SUCCESS: {
        "name": "Customer Success",
        "description": "Support and retention",
        "agents": [
            {"id": "csm_manager", "name": "CS Manager", "role": "team_management, escalations, renewals"},
            {"id": "onboarding_specialist", "name": "Onboarding Specialist", "role": "setup, training, kickoff"},
            {"id": "support_agent", "name": "Support Agent", "role": "ticket_resolution, email, chat"},
            {"id": "success_analyst", "name": "Success Analyst", "role": "health_metrics, adoption, reporting"},
        ],
    },
    Bundle.DESIGN: {
        "name": "Design Team",
        "description": "Visual creation and branding",
        "agents": [
            {"id": "ui_designer", "name": "UI/UX Designer", "role": "wireframes, mockups, design_systems"},
            {"id": "ux_researcher", "name": "UX Researcher", "role": "user_interviews, testing, journey_mapping"},
            {"id": "graphic_designer", "name": "Graphic Designer", "role": "logos, branding, print"},
            {"id": "web_designer", "name": "Web Designer", "role": "website_design, landing_pages"},
            {"id": "brand_designer", "name": "Brand Designer", "role": "brand_identity, guidelines"},
            {"id": "motion_designer", "name": "Motion Designer", "role": "animations, video_editing"},
        ],
    },
    Bundle.RESEARCH: {
        "name": "Research Team",
        "description": "Data and market intelligence",
        "agents": [
            {"id": "market_researcher", "name": "Market Researcher", "role": "market_analysis, competitor_research"},
            {"id": "data_analyst", "name": "Data Analyst", "role": "data_analysis, visualization, insights"},
            {"id": "product_researcher", "name": "Product Researcher", "role": "user_research, feature_validation"},
            {"id": "content_strategist", "name": "Content Strategist", "role": "content_calendar, topic_research"},
        ],
    },
}


def get_bundle(bundle: Bundle) -> dict:
    """Get bundle configuration"""
    return BUNDLES.get(bundle)


def list_bundles() -> list[dict]:
    """List all available bundles"""
    return [
        {"id": b.value, "name": BUNDLES[b]["name"], "description": BUNDLES[b]["description"], "agent_count": len(BUNDLES[b]["agents"])}
        for b in Bundle
    ]


def get_all_agents_in_bundle(bundle: Bundle) -> list[dict]:
    """Get all agent configs for a bundle"""
    return BUNDLES.get(bundle, {}).get("agents", [])