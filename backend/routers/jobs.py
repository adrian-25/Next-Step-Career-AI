"""Live job-market data sourced from The Muse public Jobs API."""

from collections import Counter
from datetime import datetime, timezone
import re

import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

MUSE_JOBS_URL = "https://www.themuse.com/api/public/jobs"
SKILL_PATTERNS = {
    "Python": r"\bpython\b", "JavaScript": r"\bjavascript\b", "TypeScript": r"\btypescript\b",
    "React": r"\breact(?:\.js)?\b", "Node.js": r"\bnode(?:\.js)?\b", "SQL": r"\bsql\b",
    "AWS": r"\baws\b|amazon web services", "Docker": r"\bdocker\b", "Kubernetes": r"\bkubernetes\b|\bk8s\b",
    "Java": r"\bjava\b", "C++": r"\bc\+\+\b", "Git": r"\bgit\b", "Figma": r"\bfigma\b",
    "Machine Learning": r"machine learning|\bml\b", "TensorFlow": r"\btensorflow\b",
    "Excel": r"\bexcel\b", "Power BI": r"power bi", "Tableau": r"\btableau\b",
}


def plain_text(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", value or "")).strip()


@router.get("/search")
async def search_jobs(
    role: str = Query(..., min_length=2, max_length=100),
    city: str = Query(..., min_length=2, max_length=100),
):
    """Return current listings and job-market signals for the selected role and city.

    The response deliberately reports only observed listing data; it does not
    manufacture salary or growth figures when the source has not supplied them.
    """
    params = {"page": 0, "location": city}
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            response = await client.get(MUSE_JOBS_URL, params=params)
            response.raise_for_status()
            payload = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="Live job source is temporarily unavailable") from exc

    city_lower = city.casefold()
    role_terms = [term for term in re.split(r"\s+", role.casefold()) if len(term) > 2]
    jobs = []
    for item in payload.get("results", []):
        title = item.get("name", "")
        locations = [location.get("name", "") for location in item.get("locations", [])]
        searchable = f"{title} {plain_text(item.get('contents', ''))}".casefold()
        city_matches = any(city_lower in location.casefold() for location in locations)
        role_matches = not role_terms or any(term in searchable for term in role_terms)
        if not city_matches or not role_matches:
            continue
        jobs.append({
            "id": str(item.get("id", "")),
            "title": title,
            "company": item.get("company", {}).get("name", "Unknown company"),
            "locations": locations,
            "publishedAt": item.get("publication_date"),
            "url": item.get("refs", {}).get("landing_page", ""),
            "description": plain_text(item.get("contents", ""))[:380],
        })

    # The public endpoint returns the most relevant page; expose a compact,
    # fresh set and derive skills only from those real descriptions.
    jobs = jobs[:20]
    skill_counter: Counter[str] = Counter()
    company_counter: Counter[str] = Counter()
    for job in jobs:
        company_counter[job["company"]] += 1
        text = f"{job['title']} {job['description']}"
        for skill, pattern in SKILL_PATTERNS.items():
            if re.search(pattern, text, flags=re.IGNORECASE):
                skill_counter[skill] += 1

    return {
        "source": "The Muse public Jobs API",
        "queriedAt": datetime.now(timezone.utc).isoformat(),
        "role": role,
        "city": city,
        "totalFromSource": payload.get("total", 0),
        "jobs": jobs,
        "topSkills": [{"name": skill, "count": count} for skill, count in skill_counter.most_common(8)],
        "topCompanies": [{"name": company, "count": count} for company, count in company_counter.most_common(6)],
    }
