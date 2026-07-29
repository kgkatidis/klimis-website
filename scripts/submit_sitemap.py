#!/usr/bin/env python3
"""
submit_sitemap.py — Pings the Search Console API to re-fetch sitemap.xml
so new blog posts get discovered without waiting for Google's own schedule.

Usage: GSC_SERVICE_ACCOUNT_KEY=<service-account-json> python scripts/submit_sitemap.py
"""

import json
import os
import sys
from urllib.parse import quote

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

SCOPES = ["https://www.googleapis.com/auth/webmasters"]
SITE_URL = "sc-domain:klimisgiamouridis.gr"
SITEMAP_URL = "https://klimisgiamouridis.gr/sitemap.xml"


def main():
    key_json = os.environ.get("GSC_SERVICE_ACCOUNT_KEY")
    if not key_json:
        print("GSC_SERVICE_ACCOUNT_KEY not set, skipping sitemap resubmit.")
        return

    creds = service_account.Credentials.from_service_account_info(
        json.loads(key_json), scopes=SCOPES
    )
    creds.refresh(Request())

    endpoint = (
        "https://www.googleapis.com/webmasters/v3/sites/"
        f"{quote(SITE_URL, safe='')}/sitemaps/{quote(SITEMAP_URL, safe='')}"
    )
    resp = requests.put(endpoint, headers={"Authorization": f"Bearer {creds.token}"})
    if resp.status_code != 204:
        print(f"Sitemap resubmit failed: {resp.status_code} {resp.text}", file=sys.stderr)
        sys.exit(1)
    print("Sitemap resubmit requested successfully.")


if __name__ == "__main__":
    main()
