"""
Supabase client initialization for My-Agentcy.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# Regular client (respects RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Service client (bypasses RLS for internal operations)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY) if SUPABASE_SERVICE_KEY else supabase


def get_client(use_admin: bool = False) -> Client:
    """Get Supabase client. Use admin for internal operations."""
    return supabase_admin if use_admin else supabase
