"""
Bundle exports - all agent bundles
"""

from .sales import (
    SDREDAgent,
    AccountExecutiveAgent,
    DealCloserAgent,
    AccountManagerAgent,
    VPSalesAgent,
    PipelineAnalystAgent,
)

from .marketing import (
    SEOSpecialistAgent,
    ContentCreatorAgent,
    SocialMediaManagerAgent,
    EmailMarketerAgent,
    PaidAdsManagerAgent,
    CopywriterAgent,
    MarketingDirectorAgent,
)

from .development import (
    FrontendDeveloperAgent,
    BackendDeveloperAgent,
    FullStackDeveloperAgent,
    DevOpsEngineerAgent,
    QAEngineerAgent,
    SecurityEngineerAgent,
    TechLeadAgent,
)

from .operations import (
    ProjectManagerAgent,
    VirtualAssistantAgent,
    BookkeeperAgent,
    HRManagerAgent,
    RecruiterAgent,
    OperationsManagerAgent,
)

from .executive import (
    CEOAgent,
    CFOAgent,
    CTOAgent,
    CMOAgent,
    COOAgent,
    CPOAgent,
)

from .customer_success import (
    CSManagerAgent,
    OnboardingSpecialistAgent,
    SupportAgent,
    SuccessAnalystAgent,
)

from .design import (
    UIDesignerAgent,
    UXResearcherAgent,
    GraphicDesignerAgent,
    WebDesignerAgent,
    BrandDesignerAgent,
    MotionDesignerAgent,
)

from .research import (
    MarketResearcherAgent,
    DataAnalystAgent,
    ProductResearcherAgent,
    ContentStrategistAgent,
)

__all__ = [
    # Sales
    "SDREDAgent",
    "AccountExecutiveAgent",
    "DealCloserAgent",
    "AccountManagerAgent",
    "VPSalesAgent",
    "PipelineAnalystAgent",
    # Marketing
    "SEOSpecialistAgent",
    "ContentCreatorAgent",
    "SocialMediaManagerAgent",
    "EmailMarketerAgent",
    "PaidAdsManagerAgent",
    "CopywriterAgent",
    "MarketingDirectorAgent",
    # Development
    "FrontendDeveloperAgent",
    "BackendDeveloperAgent",
    "FullStackDeveloperAgent",
    "DevOpsEngineerAgent",
    "QAEngineerAgent",
    "SecurityEngineerAgent",
    "TechLeadAgent",
    # Operations
    "ProjectManagerAgent",
    "VirtualAssistantAgent",
    "BookkeeperAgent",
    "HRManagerAgent",
    "RecruiterAgent",
    "OperationsManagerAgent",
    # Executive
    "CEOAgent",
    "CFOAgent",
    "CTOAgent",
    "CMOAgent",
    "COOAgent",
    "CPOAgent",
    # Customer Success
    "CSManagerAgent",
    "OnboardingSpecialistAgent",
    "SupportAgent",
    "SuccessAnalystAgent",
    # Design
    "UIDesignerAgent",
    "UXResearcherAgent",
    "GraphicDesignerAgent",
    "WebDesignerAgent",
    "BrandDesignerAgent",
    "MotionDesignerAgent",
    # Research
    "MarketResearcherAgent",
    "DataAnalystAgent",
    "ProductResearcherAgent",
    "ContentStrategistAgent",
]