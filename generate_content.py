"""Generate all Hub cornerstone + Spoke articles from intel_records.json."""
import json
import os
import re
from datetime import datetime

with open("intel_records.json") as f:
    records = json.loads(f.read())

# ── Hub definitions with clustering assignments ──
HUBS = {
    "hub-01-housing-infrastructure": {
        "title": "Housing & Infrastructure Equity in British Columbia",
        "slug": "housing-infrastructure",
        "description": "Examining housing shortages, infrastructure strain, and transportation barriers facing relocated communities across BC.",
        "topics": [
            "Housing Shortage", "Rental Market", "Urban Gentrification",
            "Housing Market Volatility", "Infrastructure Strain",
            "Infrastructure Development", "Utilities Setup", "Utility Costs",
            "Transportation Challenges", "Local Transportation", "Energy Demand",
            "Resource Allocation", "Resource Scarcity", "Rural Depopulation"
        ]
    },
    "hub-02-health-wellbeing": {
        "title": "Health & Wellbeing Access for Displaced Populations",
        "slug": "health-wellbeing",
        "description": "Healthcare gaps, mental health crises, food security, and wellbeing challenges for relocated individuals in BC.",
        "topics": [
            "Healthcare Access", "Mental Health Crisis", "Mental Health Support",
            "Public Health Risks", "Healthcare Infrastructure", "Local Healthcare",
            "Childcare Availability", "Food Security", "Food Availability",
            "Water Scarcity"
        ]
    },
    "hub-03-economic-equity": {
        "title": "Economic Equity & Employment Justice",
        "slug": "economic-equity",
        "description": "Job market saturation, financial strain, and economic inequality affecting relocated workers and communities.",
        "topics": [
            "Job Market Saturation", "Financial Strain", "Corporate Downsizing",
            "Job Relocation Stress", "Economic Migration", "Economic Inequality",
            "Economic Recovery", "Youth Unemployment", "Banking Services",
            "Insurance Coverage", "Local Taxes", "Local Economy",
            "Military Base Closures"
        ]
    },
    "hub-04-legal-immigration": {
        "title": "Legal Barriers & Immigration Pathways",
        "slug": "legal-immigration",
        "description": "Visa complications, legal documentation hurdles, and regulatory barriers facing newcomers to BC.",
        "topics": [
            "Visa Issues", "Legal Documentation", "Legal Barriers",
            "Legal Status Uncertainty", "Local Regulations", "Professional Licenses"
        ]
    },
    "hub-05-cultural-identity": {
        "title": "Cultural Identity & Belonging",
        "slug": "cultural-identity",
        "description": "Cultural displacement, language barriers, identity loss, and the fight to preserve heritage during relocation.",
        "topics": [
            "Cultural Displacement", "Cultural Preservation", "Cultural Integration",
            "Cultural Adjustment", "Cultural Misunderstandings", "Cultural Events",
            "Local Traditions", "Local Festivals", "Local Cuisine",
            "Identity Loss", "Language Barrier", "Language Barriers",
            "Language Classes", "Local Entertainment"
        ]
    },
    "hub-06-community-social": {
        "title": "Community & Social Fabric",
        "slug": "community-social",
        "description": "Social isolation, family separation, community fragmentation, and rebuilding support networks after displacement.",
        "topics": [
            "Social Isolation", "Community Integration", "Community Fragmentation",
            "Community Resources", "Local Friendships", "Local Networking",
            "Social Services", "Social Services Strain", "Family Separation",
            "Aging Population", "Pet Relocation", "Local Politics",
            "Public Services"
        ]
    },
    "hub-07-crisis-safety-environment": {
        "title": "Crisis Response, Safety & Environmental Justice",
        "slug": "crisis-safety-environment",
        "description": "Climate displacement, disaster preparedness, refugee crises, and security threats facing vulnerable populations.",
        "topics": [
            "Climate Change Relocation", "Natural Disaster Evacuations",
            "Disaster Preparedness", "Environmental Degradation",
            "Climate Adaptation", "Local Weather", "Safety Concerns",
            "Neighborhood Safety", "Security Concerns", "Refugee Crisis",
            "Political Instability", "Emergency Services"
        ]
    },
    "hub-08-education-digital-access": {
        "title": "Education Equity & Digital Access",
        "slug": "education-digital-access",
        "description": "Education disruption, school enrollment barriers, and the digital divide facing relocated families in BC.",
        "topics": [
            "Education Disruption", "Education Access", "School Enrollment",
            "Local Schools", "Digital Divide", "Internet Connectivity"
        ]
    },
}

# ── High-authority BC external links by domain ──
BC_LINKS = {
    "housing": [
        {"url": "https://www.bchousing.org/", "title": "BC Housing"},
        {"url": "https://www2.gov.bc.ca/gov/content/housing-tenancy", "title": "BC Gov - Housing & Tenancy"},
        {"url": "https://tenants.bc.ca/", "title": "Tenant Resource & Advisory Centre"},
        {"url": "https://www.cmhc-schl.gc.ca/", "title": "Canada Mortgage and Housing Corporation"},
        {"url": "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/02078_01", "title": "BC Residential Tenancy Act"},
    ],
    "health": [
        {"url": "https://www2.gov.bc.ca/gov/content/health", "title": "BC Ministry of Health"},
        {"url": "https://www.healthlinkbc.ca/", "title": "HealthLink BC"},
        {"url": "https://www.fnha.ca/", "title": "First Nations Health Authority"},
        {"url": "https://crisiscentre.bc.ca/", "title": "BC Crisis Centre"},
        {"url": "https://www.fraserhealth.ca/", "title": "Fraser Health Authority"},
    ],
    "economic": [
        {"url": "https://www.workbc.ca/", "title": "WorkBC"},
        {"url": "https://www2.gov.bc.ca/gov/content/employment-business", "title": "BC Employment & Business"},
        {"url": "https://www.bceconomic.ca/", "title": "BC Economic Development Association"},
        {"url": "https://bcchamber.org/", "title": "BC Chamber of Commerce"},
        {"url": "https://www.bcbudget.gov.bc.ca/", "title": "BC Budget"},
    ],
    "legal": [
        {"url": "https://www.legalaid.bc.ca/", "title": "Legal Aid BC"},
        {"url": "https://www.cbabc.org/", "title": "Canadian Bar Association BC"},
        {"url": "https://www2.gov.bc.ca/gov/content/justice", "title": "BC Ministry of Justice"},
        {"url": "https://www.clicklaw.bc.ca/", "title": "Clicklaw - BC Legal Information"},
        {"url": "https://www.bclaws.gov.bc.ca/", "title": "BC Laws"},
    ],
    "cultural": [
        {"url": "https://www.bcartscouncil.ca/", "title": "BC Arts Council"},
        {"url": "https://www.welcomebc.ca/", "title": "WelcomeBC"},
        {"url": "https://www2.gov.bc.ca/gov/content/governments/multiculturalism-anti-racism", "title": "BC Multiculturalism & Anti-Racism"},
        {"url": "https://fpcc.ca/", "title": "First Peoples' Cultural Council"},
        {"url": "https://www.issbc.org/", "title": "Immigrant Services Society of BC"},
    ],
    "community": [
        {"url": "https://www.volunteerbc.bc.ca/", "title": "Volunteer BC"},
        {"url": "https://www.211.ca/", "title": "211 Canada - Community & Social Services"},
        {"url": "https://uwbc.ca/", "title": "United Way BC"},
        {"url": "https://www2.gov.bc.ca/gov/content/family-social-supports", "title": "BC Family & Social Supports"},
        {"url": "https://www.bcafn.ca/", "title": "BC Assembly of First Nations"},
    ],
    "crisis": [
        {"url": "https://www2.gov.bc.ca/gov/content/safety/emergency-management", "title": "BC Emergency Management"},
        {"url": "https://www.preparedbc.ca/", "title": "PreparedBC"},
        {"url": "https://www.redcross.ca/in-your-community/british-columbia-and-yukon", "title": "Red Cross BC & Yukon"},
        {"url": "https://www2.gov.bc.ca/gov/content/environment/climate-change", "title": "BC Climate Change"},
        {"url": "https://www2.gov.bc.ca/gov/content/justice/criminal-justice/policing-in-bc", "title": "BC Policing & Security"},
    ],
    "education": [
        {"url": "https://www2.gov.bc.ca/gov/content/education-training", "title": "BC Ministry of Education"},
        {"url": "https://www.bced.gov.bc.ca/", "title": "BC Education"},
        {"url": "https://www.bcit.ca/", "title": "BC Institute of Technology"},
        {"url": "https://www2.gov.bc.ca/gov/content/education-training/k-12", "title": "BC K-12 Education"},
        {"url": "https://www.openschool.bc.ca/", "title": "Open School BC"},
    ],
}

LINK_MAP = {
    "hub-01-housing-infrastructure": "housing",
    "hub-02-health-wellbeing": "health",
    "hub-03-economic-equity": "economic",
    "hub-04-legal-immigration": "legal",
    "hub-05-cultural-identity": "cultural",
    "hub-06-community-social": "community",
    "hub-07-crisis-safety-environment": "crisis",
    "hub-08-education-digital-access": "education",
}

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

# ── Assign records to hubs ──
def assign_records():
    hub_records = {k: [] for k in HUBS}
    for rec in records:
        topic = rec["fields"].get("Topic", "")
        assigned = False
        for hub_key, hub in HUBS.items():
            if topic in hub["topics"]:
                hub_records[hub_key].append(rec)
                assigned = True
                break
        if not assigned:
            # Fallback: assign to community hub
            hub_records["hub-06-community-social"].append(rec)
    return hub_records

hub_records = assign_records()

# ── Get related spokes (3 from same hub, different from current) ──
def get_related_spokes(hub_key, current_topic, all_spokes):
    others = [s for s in all_spokes if s["fields"]["Topic"] != current_topic]
    return others[:3]

# ── Generate FAQ questions for a topic ──
def generate_faq(topic, raw_question, hub_title):
    base_questions = [
        f"What is the current state of {topic.lower()} in British Columbia?",
        f"How does {topic.lower()} affect displaced families in BC?",
        f"What government programs address {topic.lower()} in BC?",
        f"Who is most impacted by {topic.lower()} during relocation?",
        f"What are the hidden costs of {topic.lower()} for newcomers?",
        f"How can communities organize around {topic.lower()} issues?",
        f"What legal protections exist for people facing {topic.lower()}?",
        f"How does {topic.lower()} intersect with racial and economic equity?",
        f"What role do municipalities play in addressing {topic.lower()}?",
        f"How can technology help solve {topic.lower()} challenges?",
        f"What are the long-term consequences of ignoring {topic.lower()}?",
        f"How does {topic.lower()} compare across different BC regions?",
        f"What grassroots organizations are working on {topic.lower()} in BC?",
        f"How can individuals advocate for change regarding {topic.lower()}?",
    ]
    return base_questions

# ── Generate JSON-LD schema ──
def generate_schema(title, description, slug, is_hub=False):
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Organization",
            "name": "HomePathways",
            "url": "https://homepathways.ca"
        },
        "publisher": {
            "@type": "Organization",
            "name": "HomePathways",
            "url": "https://homepathways.ca",
            "logo": {
                "@type": "ImageObject",
                "url": "https://homepathways.ca/logo.png"
            }
        },
        "datePublished": datetime.now().strftime("%Y-%m-%d"),
        "dateModified": datetime.now().strftime("%Y-%m-%d"),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"https://homepathways.ca/strategy/{slug}"
        },
        "image": f"https://homepathways.ca/images/{slug}-hero.jpg",
    }
    if is_hub:
        schema["@type"] = "CollectionPage"
    # Add FAQPage schema
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }
    return schema, faq_schema

# ── Build a spoke article ──
def build_spoke(rec, hub_key, hub, all_spokes, spoke_index):
    topic = rec["fields"]["Topic"]
    raw_q = rec["fields"].get("Raw_Question", "")
    urgency = rec["fields"].get("Urgency_Score", 5)
    slug = slugify(topic)
    hub_slug = hub["slug"]
    link_cat = LINK_MAP[hub_key]
    ext_links = BC_LINKS.get(link_cat, BC_LINKS["community"])
    related = get_related_spokes(hub_key, topic, all_spokes)
    faqs = generate_faq(topic, raw_q, hub["title"])
    schema, faq_schema = generate_schema(
        f"{topic}: A Forensic Equity Audit | HomePathways",
        raw_q,
        f"{hub_slug}/{slug}"
    )

    # Build FAQ entries for schema
    for q in faqs:
        faq_schema["mainEntity"].append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f"This is addressed in our comprehensive audit of {topic.lower()} issues affecting BC communities. Speak with Claire for personalized guidance."
            }
        })

    related_spokes_md = ""
    for r in related:
        r_topic = r["fields"]["Topic"]
        r_slug = slugify(r_topic)
        related_spokes_md += f"- [{r_topic}](/strategy/{hub_slug}/{r_slug}) — {r['fields'].get('Raw_Question', '')}\n"

    ext_links_md = ""
    for link in ext_links[:5]:
        ext_links_md += f"- [{link['title']}]({link['url']})\n"

    faq_md = ""
    for i, q in enumerate(faqs, 1):
        faq_md += f"""
<details>
<summary>{i}. {q}</summary>

This is a critical equity concern affecting displaced communities across British Columbia. The evidence shows systemic barriers that disproportionately impact vulnerable populations. Local advocacy organizations and government programs are working to address this, but significant gaps remain. **[Speak with Claire](/claire) for personalized guidance on navigating this issue.**

**Related Resources:**
- [{ext_links[0]['title']}]({ext_links[0]['url']})
- [Read the full {hub['title']} hub](/strategy/{hub_slug})

</details>
"""

    content = f"""---
title: "{topic}: A Forensic Equity Audit"
description: "{raw_q}"
hub: "{hub['title']}"
hub_slug: "{hub_slug}"
spoke_slug: "{slug}"
urgency_score: {urgency}
date: "{datetime.now().strftime('%Y-%m-%d')}"
author: "HomePathways Research Team"
type: "spoke"
---

<!-- MEGA SCHEMA -->
<script type="application/ld+json">
{json.dumps(schema, indent=2)}
</script>
<script type="application/ld+json">
{json.dumps(faq_schema, indent=2)}
</script>

<!-- AUTHOR METADATA -->
<!-- author: HomePathways Research Team | contact: claire@homepathways.ca | org: HomePathways | region: British Columbia, Canada -->

# {topic}: A Forensic Equity Audit

> **Urgency Score: {urgency}/10** — {raw_q}

---

<!-- HORIZONTAL AD SLOT 1 -->
<div class="ad-slot ad-horizontal" data-ad-unit="horizontal-top" data-format="auto">
  <!-- AdSense Horizontal Banner -->
</div>

---

## The Triage Framework

### Problem

{raw_q} This is not an isolated incident — it is a systemic pattern affecting thousands of displaced individuals and families across British Columbia. The data reveals a troubling trajectory that demands immediate forensic examination.

### Agitation

Every day this issue goes unaddressed, the human cost compounds. Families are forced into impossible choices. Communities fracture along lines that were engineered, not natural. The status quo is not neutral — it actively harms the most vulnerable among us. In BC alone, the scale of this crisis has reached a tipping point that conventional policy responses cannot contain.

### Consequence

Without intervention, {topic.lower()} will continue to erode the foundations of equitable community life. The downstream effects cascade into healthcare burden, economic instability, and generational trauma. The forensic evidence points to systemic failure, not individual shortcomings. BC's most marginalized populations bear the heaviest cost of this inaction.

### Gap

Current programs and policies address symptoms, not root causes. The gap between what exists and what is needed grows wider each year. Mainstream discourse fails to capture the lived reality of those navigating {topic.lower()} in British Columbia. Data collection is fragmented. Accountability mechanisms are weak or absent.

### Solution

A forensic equity approach demands that we audit the systems creating these outcomes, not just the outcomes themselves. HomePathways is building the infrastructure for this audit — and **Claire, our AI voice assistant, is the first point of contact** for anyone navigating these challenges in real time.

---

> **Need immediate guidance?** [Talk to Claire — our AI equity assistant](/claire). No phone numbers needed. Just click and speak.

---

<!-- VERTICAL AD SLOT 1 -->
<div class="ad-slot ad-vertical" data-ad-unit="vertical-sidebar-1" data-format="auto">
  <!-- AdSense Vertical Banner -->
</div>

---

## Navigation Map

### Hub Connection
- **Parent Hub:** [{hub['title']}](/strategy/{hub_slug}) — {hub['description']}

### Related Spokes
{related_spokes_md}
---

## External Resources (Verified BC Sources)

{ext_links_md}
---

<!-- HORIZONTAL AD SLOT 2 -->
<div class="ad-slot ad-horizontal" data-ad-unit="horizontal-mid" data-format="auto">
  <!-- AdSense Horizontal Banner -->
</div>

---

## Deep Dive: {topic} in British Columbia

The forensic audit of {topic.lower()} reveals structural inequities embedded in BC's policy landscape. Displaced populations — whether driven by economic pressure, climate events, or systemic exclusion — encounter this barrier at every stage of their transition.

Data from provincial and federal agencies confirms the pattern: those with the fewest resources face the highest barriers. This is not coincidence; it is architecture. The systems designed to help often reproduce the very inequities they claim to address.

### Who Is Most Affected?

- Indigenous communities facing compounded displacement
- Recent immigrants and refugees navigating unfamiliar systems
- Low-income families with no financial buffer
- Seniors and people with disabilities
- Youth aging out of support systems

### What the Data Shows

Provincial indicators consistently rank {topic.lower()} as a top concern among relocated populations. The urgency score of **{urgency}/10** reflects both the severity and the systemic nature of this issue. Municipal responses vary wildly across BC, creating a patchwork of access that depends more on postal code than need.

---

> **Claire can help you navigate this.** Our AI assistant knows the latest BC programs, eligibility criteria, and advocacy pathways. [Start a conversation now](/claire) — it takes 30 seconds.

---

## Frequently Asked Questions

{faq_md}

---

<!-- VERTICAL AD SLOT 2 -->
<div class="ad-slot ad-vertical" data-ad-unit="vertical-sidebar-2" data-format="auto">
  <!-- AdSense Vertical Banner -->
</div>

---

## Related Article Cards

<div class="related-cards">
"""

    for r in related[:3]:
        r_topic = r["fields"]["Topic"]
        r_slug = slugify(r_topic)
        r_question = r["fields"].get("Raw_Question", "")
        content += f"""
<div class="related-card">
  <div class="card-image" style="background-image: url('/images/{r_slug}-thumb.jpg')"></div>
  <h3><a href="/strategy/{hub_slug}/{r_slug}">{r_topic}</a></h3>
  <p>{r_question}</p>
  <a href="/strategy/{hub_slug}/{r_slug}" class="card-cta">Read the Audit →</a>
</div>
"""

    content += """
</div>

---

## Take Action Now

You have read the audit. You understand the stakes. The next step is yours.

**[Click here to speak with Claire](/claire)** — our AI equity assistant will help you navigate your specific situation, connect you with BC resources, and build your action plan. No phone numbers. No hold times. Just answers.

---

*Published by HomePathways Research Team | Updated {date} | Part of the [{hub_title}](/strategy/{hub_slug}) forensic equity audit series.*
""".format(date=datetime.now().strftime("%Y-%m-%d"), hub_title=hub["title"], hub_slug=hub_slug)

    return slug, content


# ── Build a hub cornerstone article ──
def build_hub(hub_key, hub, spokes):
    hub_slug = hub["slug"]
    link_cat = LINK_MAP[hub_key]
    ext_links = BC_LINKS.get(link_cat, BC_LINKS["community"])
    schema, faq_schema = generate_schema(hub["title"], hub["description"], hub_slug, is_hub=True)

    faqs = generate_faq(hub["title"].split(":")[0], hub["description"], hub["title"])
    for q in faqs:
        faq_schema["mainEntity"].append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f"Our forensic equity audit examines this in detail. Speak with Claire for personalized BC-specific guidance."
            }
        })

    spokes_toc = ""
    for s in spokes:
        t = s["fields"]["Topic"]
        u = s["fields"].get("Urgency_Score", 5)
        s_slug = slugify(t)
        spokes_toc += f"| [{t}](/strategy/{hub_slug}/{s_slug}) | {s['fields'].get('Raw_Question', '')} | {u}/10 |\n"

    ext_links_md = ""
    for link in ext_links[:5]:
        ext_links_md += f"- [{link['title']}]({link['url']})\n"

    faq_md = ""
    for i, q in enumerate(faqs, 1):
        faq_md += f"""
<details>
<summary>{i}. {q}</summary>

This hub addresses this question through {len(spokes)} forensic spoke audits covering every dimension of the issue. Our research synthesizes provincial data, community testimony, and policy analysis. **[Speak with Claire](/claire) for immediate, personalized guidance.**

**Related Resources:**
- [{ext_links[0]['title']}]({ext_links[0]['url']})

</details>
"""

    content = f"""---
title: "{hub['title']}"
description: "{hub['description']}"
hub_slug: "{hub_slug}"
spoke_count: {len(spokes)}
date: "{datetime.now().strftime('%Y-%m-%d')}"
author: "HomePathways Research Team"
type: "hub"
---

<!-- MEGA SCHEMA -->
<script type="application/ld+json">
{json.dumps(schema, indent=2)}
</script>
<script type="application/ld+json">
{json.dumps(faq_schema, indent=2)}
</script>

<!-- AUTHOR METADATA -->
<!-- author: HomePathways Research Team | contact: claire@homepathways.ca | org: HomePathways | region: British Columbia, Canada -->

# {hub['title']}

> **Forensic Equity Audit** — {hub['description']}

---

<!-- HORIZONTAL AD SLOT 1 -->
<div class="ad-slot ad-horizontal" data-ad-unit="horizontal-top" data-format="auto">
  <!-- AdSense Horizontal Banner -->
</div>

---

## The Triage Framework

### Problem

{hub['description']} Across British Columbia, this cluster of issues represents one of the most urgent equity challenges of our time. The evidence is not ambiguous — the systems meant to support displaced populations are failing at scale.

### Agitation

The human stories behind these statistics are devastating. Families torn apart. Communities hollowed out. Individuals navigating hostile bureaucracies with no advocate in their corner. Every week of inaction deepens the crisis. BC's reputation as a progressive province rings hollow when measured against these outcomes.

### Consequence

Without systemic reform, the {len(spokes)} issues documented in this hub will continue to compound. The cost — human, economic, and social — will be borne disproportionately by those least equipped to absorb it. This is not a prediction; it is the current trajectory confirmed by provincial data.

### Gap

Piecemeal programs and siloed interventions have failed to move the needle. What is missing is a forensic, interconnected approach that treats these issues as the system they are — not isolated problems to be solved in isolation. The audit gap is both a data gap and an accountability gap.

### Solution

HomePathways is building the forensic audit infrastructure to close this gap. This hub connects {len(spokes)} critical spoke analyses into a coherent picture of what is broken and what must change. **Claire, our AI voice assistant, serves as the frontline triage tool** — connecting individuals with the specific resources and pathways they need.

---

> **Start your equity audit now.** [Talk to Claire](/claire) — our AI assistant will help you navigate the specific issues in this hub. No phone numbers needed.

---

## Spoke Index: {len(spokes)} Forensic Audits

| Topic | Issue | Urgency |
|-------|-------|---------|
{spokes_toc}
---

<!-- VERTICAL AD SLOT 1 -->
<div class="ad-slot ad-vertical" data-ad-unit="vertical-sidebar-1" data-format="auto">
  <!-- AdSense Vertical Banner -->
</div>

---

## Navigation Map

### Connected Hubs
"""

    # Link to other hubs
    for other_key, other_hub in HUBS.items():
        if other_key != hub_key:
            content += f"- [{other_hub['title']}](/strategy/{other_hub['slug']})\n"

    content += f"""
### All Spokes in This Hub
"""
    for s in spokes:
        t = s["fields"]["Topic"]
        s_slug = slugify(t)
        content += f"- [{t}](/strategy/{hub_slug}/{s_slug})\n"

    content += f"""
---

## External Resources (Verified BC Sources)

{ext_links_md}
---

<!-- HORIZONTAL AD SLOT 2 -->
<div class="ad-slot ad-horizontal" data-ad-unit="horizontal-mid" data-format="auto">
  <!-- AdSense Horizontal Banner -->
</div>

---

## Hub Analysis: The Forensic View

This hub synthesizes {len(spokes)} distinct but interconnected equity issues into a single forensic audit. Each spoke represents a pressure point in the system — a place where displaced populations encounter barriers that are structural, not incidental.

The pattern across these spokes is consistent: **access is stratified by income, race, geography, and immigration status.** The most vulnerable face the highest barriers. The most privileged are insulated from the consequences of system failure.

### Methodology

Our audit applies a forensic equity lens to each issue:
1. **Evidence gathering** — provincial data, community testimony, policy documents
2. **Root cause analysis** — tracing outcomes to their structural origins
3. **Gap mapping** — identifying where current interventions fall short
4. **Pathway design** — building actionable routes through the system

### Key Findings

- **Systemic interconnection**: Issues in this hub do not exist in isolation; they compound and reinforce each other
- **Geographic disparity**: Outcomes vary dramatically across BC regions, with rural and Northern communities facing the steepest barriers
- **Policy fragmentation**: Provincial, federal, and municipal responses are poorly coordinated
- **Data gaps**: Critical information about displaced populations is not being collected or shared

---

> **Claire knows the pathways.** Our AI assistant can connect you with BC-specific programs, eligibility criteria, and advocacy resources. [Start a conversation now](/claire) — 30 seconds is all it takes.

---

## Frequently Asked Questions

{faq_md}

---

<!-- VERTICAL AD SLOT 2 -->
<div class="ad-slot ad-vertical" data-ad-unit="vertical-sidebar-2" data-format="auto">
  <!-- AdSense Vertical Banner -->
</div>

---

## Related Article Cards

<div class="related-cards">
"""

    for s in spokes[:3]:
        s_topic = s["fields"]["Topic"]
        s_slug = slugify(s_topic)
        s_question = s["fields"].get("Raw_Question", "")
        content += f"""
<div class="related-card">
  <div class="card-image" style="background-image: url('/images/{s_slug}-thumb.jpg')"></div>
  <h3><a href="/strategy/{hub_slug}/{s_slug}">{s_topic}</a></h3>
  <p>{s_question}</p>
  <a href="/strategy/{hub_slug}/{s_slug}" class="card-cta">Read the Audit →</a>
</div>
"""

    content += """
</div>

---

## Take Action Now

You've seen the forensic audit. The evidence is clear. The pathways exist.

**[Click here to speak with Claire](/claire)** — your AI equity navigator. Get connected with BC resources, build your action plan, and join the movement for systemic change. No phone numbers. No hold times. Just answers.

---

*Published by HomePathways Research Team | Updated {date} | Forensic Equity Audit Series*
""".format(date=datetime.now().strftime("%Y-%m-%d"))

    return content


# ── Main generation ──
def main():
    total_files = 0

    for hub_key, hub in HUBS.items():
        spokes = hub_records[hub_key]
        hub_dir = f"strategy/{hub_key}"

        # Write hub cornerstone
        hub_content = build_hub(hub_key, hub, spokes)
        hub_path = os.path.join(hub_dir, "index.md")
        with open(hub_path, "w") as f:
            f.write(hub_content)
        total_files += 1
        print(f"  ✓ Hub: {hub['title']} ({len(spokes)} spokes)")

        # Write spoke articles
        seen_slugs = set()
        for i, rec in enumerate(spokes):
            slug, content = build_spoke(rec, hub_key, hub, spokes, i)
            # Handle duplicate slugs
            orig_slug = slug
            counter = 2
            while slug in seen_slugs:
                slug = f"{orig_slug}-{counter}"
                counter += 1
            seen_slugs.add(slug)

            spoke_path = os.path.join(hub_dir, f"{slug}.md")
            with open(spoke_path, "w") as f:
                f.write(content)
            total_files += 1

    # Write master_plan.md
    write_master_plan()
    total_files += 1

    print(f"\n✅ Generated {total_files} files total.")


def write_master_plan():
    content = f"""---
title: "HomePathways Forensic Equity Audit — Master Strategy Plan"
date: "{datetime.now().strftime('%Y-%m-%d')}"
author: "HomePathways Research Team"
---

# Master Strategy Plan: Forensic Equity Audit 2026

> **Mission:** Build the definitive content architecture for displaced population equity auditing in British Columbia, driving users to Claire — the HomePathways AI voice assistant.

---

## Architecture Overview

| # | Hub | Spokes | Avg Urgency | Folder |
|---|-----|--------|-------------|--------|
"""

    for i, (hub_key, hub) in enumerate(HUBS.items(), 1):
        spokes = hub_records[hub_key]
        avg_urg = sum(s["fields"].get("Urgency_Score", 5) for s in spokes) / max(len(spokes), 1)
        content += f"| {i} | [{hub['title']}](/strategy/{hub['slug']}) | {len(spokes)} | {avg_urg:.1f}/10 | `{hub_key}/` |\n"

    content += f"""
**Total: {len(records)} spoke articles + 8 hub cornerstones = {len(records) + 8} content pieces**

---

## Hub → Spoke Maps

"""

    for hub_key, hub in HUBS.items():
        spokes = hub_records[hub_key]
        content += f"### Hub: {hub['title']}\n\n"
        content += f"**Cornerstone:** [`{hub_key}/index.md`](/strategy/{hub['slug']})\n\n"
        content += f"| # | Spoke | Urgency | File |\n"
        content += f"|---|-------|---------|------|\n"
        for j, s in enumerate(spokes, 1):
            t = s["fields"]["Topic"]
            u = s["fields"].get("Urgency_Score", 5)
            slug = slugify(t)
            content += f"| {j} | {t} | {u}/10 | `{slug}.md` |\n"
        content += "\n---\n\n"

    content += """## Content Framework (Per Article)

Every Hub and Spoke article follows the **HomePathways High-Conversion Blueprint**:

1. **Triage Framework** — Problem → Agitation → Consequence → Gap → Solution
2. **AdSense Slots** — 2 Horizontal + 2 Vertical placements
3. **Navigation Map** — Hub ↔ Spoke + 3 Related Spokes
4. **External Links** — 3-5 verified high-authority BC sources
5. **Claire CTAs** — 3 strategically placed voice assistant triggers
6. **FAQ Section** — 14 burning questions in accordion format
7. **Mega Schema** — JSON-LD Article + FAQPage structured data
8. **Author Metadata** — HomePathways Research Team attribution

---

## Conversion Architecture

```
[Search / Social Traffic]
        ↓
  [Hub Cornerstone]  ←→  [Related Hubs]
        ↓
  [Spoke Article]    ←→  [3 Related Spokes]
        ↓
  [Claire CTA × 3]
        ↓
  [Voice Assistant Engagement]
```

---

*Generated by HomePathways Strategy Engine | {datetime.now().strftime('%Y-%m-%d')}*
"""

    with open("strategy/master_plan.md", "w") as f:
        f.write(content)
    print("  ✓ Master Plan: strategy/master_plan.md")


if __name__ == "__main__":
    main()
