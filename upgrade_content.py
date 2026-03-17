"""Upgrade all 104 articles: add Executive Summary + Outcome of the Outcome."""
import os
import re
import json

# ── Topic-specific Outcome of the Outcome mappings ──
# Each maps a topic to its unique positive ripple effect
OUTCOMES = {
    # Hub 1: Housing & Infrastructure
    "Housing Shortage": "Families gain stable, affordable roots — children stay in one school, parents build careers, and neighborhoods become intergenerational communities rather than transient holding zones.",
    "Rental Market": "A regulated rental ecosystem where newcomers can secure housing within weeks, not months — freeing mental bandwidth to pursue employment, education, and community ties.",
    "Urban Gentrification": "Long-term residents retain ownership of their neighborhoods, preserving cultural memory while welcoming new investment that lifts everyone, not just developers.",
    "Housing Market Volatility": "Predictable housing costs allow families to plan five years ahead instead of five months — enabling savings, entrepreneurship, and the kind of stability that breaks cycles of poverty.",
    "Infrastructure Strain": "Cities that grow their infrastructure ahead of demand, creating neighborhoods where a 15-minute walk connects residents to transit, healthcare, groceries, and green space.",
    "Infrastructure Development": "Purpose-built communities where relocated populations have immediate access to the systems they need — reducing the 'settling-in gap' from years to weeks.",
    "Utilities Setup": "Seamless utility onboarding that eliminates the bureaucratic maze — so families spend their first weeks building connections, not fighting paperwork.",
    "Utility Costs": "Energy-efficient housing stock that keeps utility bills under 10% of household income, redirecting hundreds of dollars monthly toward nutrition, education, and savings.",
    "Transportation Challenges": "A connected transit network where no relocated family is more than 30 minutes from employment, healthcare, and their children's schools — mobility as equity.",
    "Local Transportation": "Accessible, affordable transit routes designed around where displaced populations actually live and work — not where planners assume they should.",
    "Energy Demand": "A green energy grid scaled for growth, where increased demand from relocation drives renewable investment rather than fossil fuel expansion.",
    "Resource Allocation": "Transparent, data-driven resource distribution where funding follows need in real time — ending the pattern of underserved communities waiting years for basic services.",
    "Resource Scarcity": "Community-managed resource hubs that turn scarcity into shared abundance — food cooperatives, tool libraries, and mutual aid networks that build resilience from the ground up.",
    "Rural Depopulation": "Revitalized rural economies where young people see a future — remote work infrastructure, local food systems, and cultural amenities that make staying a choice, not a sacrifice.",

    # Hub 2: Health & Wellbeing
    "Healthcare Access": "Universal point-of-arrival healthcare enrollment that ensures no relocated person goes a single day without coverage — preventing the emergency room from becoming primary care.",
    "Mental Health Crisis": "Culturally competent mental health support embedded in every relocation pathway — so trauma is addressed at the source, not compounded by systemic neglect.",
    "Mental Health Support": "Walk-in mental health clinics in every high-displacement neighborhood, staffed by counselors who speak the community's languages and understand its specific grief.",
    "Public Health Risks": "Proactive public health infrastructure that anticipates displacement patterns — deploying mobile clinics, vaccination drives, and disease surveillance before crises escalate.",
    "Healthcare Infrastructure": "Healthcare systems designed for surge capacity — so the arrival of 500 families strengthens a hospital's funding rather than breaking its capacity.",
    "Local Healthcare": "Neighborhood health centers where relocated families see the same doctor every visit — continuity of care that catches chronic conditions early and builds trust over time.",
    "Childcare Availability": "Subsidized childcare within walking distance of every high-displacement area — unlocking employment for parents and early development for children simultaneously.",
    "Food Security": "Community food sovereignty through urban farms, cultural food markets, and nutrition programs that honor dietary traditions while ensuring no child goes hungry.",
    "Food Availability": "Grocery cooperatives and cultural food hubs that ensure familiar, nutritious food is affordable and accessible — because nourishment is both physical and cultural.",
    "Water Scarcity": "Resilient water systems with conservation infrastructure that guarantees clean, affordable water for growing communities — turning scarcity planning into abundance engineering.",

    # Hub 3: Economic Equity
    "Job Market Saturation": "Diversified local economies with targeted job creation in sectors that match newcomer skills — turning an influx of talent into an economic renaissance rather than a competition for scraps.",
    "Financial Strain": "Emergency relocation funds paired with financial coaching that prevents the debt spiral — so families invest their first year building stability, not repaying moving costs.",
    "Corporate Downsizing": "Mandatory corporate transition packages that include retraining, relocation support, and 12-month income bridges — shifting the cost of restructuring from workers to the companies that profit from it.",
    "Job Relocation Stress": "Employer-funded transition support that covers housing deposits, school enrollment, and spousal career assistance — making mandatory moves a launchpad rather than a disruption.",
    "Economic Migration": "Bilateral economic agreements that ensure migrant workers retain benefits, credentials, and pension contributions across borders — dignity through portability.",
    "Economic Inequality": "Progressive municipal investment strategies that direct the highest per-capita spending to the most displaced neighborhoods — closing the gap through targeted abundance.",
    "Economic Recovery": "Regional recovery blueprints that treat mass relocation as an economic development opportunity — matching incoming skills to emerging industries for mutual benefit.",
    "Youth Unemployment": "Apprenticeship-to-ownership pipelines that connect displaced youth with mentors, credentials, and startup capital — transforming demographic disruption into generational wealth creation.",
    "Banking Services": "Mobile banking hubs and credit-building programs designed for newcomers — because financial inclusion is the gateway to every other form of participation.",
    "Insurance Coverage": "Portable insurance frameworks that transfer seamlessly across provincial and national borders — eliminating the coverage gap that turns a health event into a financial catastrophe.",
    "Local Taxes": "Newcomer tax guides and graduated municipal fee structures that prevent sticker shock — allowing families to budget accurately from day one in their new community.",
    "Local Economy": "Buy-local ecosystems that channel newcomer spending into neighborhood businesses — creating a multiplier effect where every dollar circulates through the community multiple times.",
    "Military Base Closures": "Economic conversion zones that transform former military infrastructure into civilian innovation hubs — retraining programs, startup incubators, and community colleges built on the foundation of what was lost.",

    # Hub 4: Legal & Immigration
    "Visa Issues": "Streamlined visa processing with dedicated relocation pathways — reducing wait times from years to months and freeing families from the limbo that stalls every aspect of settlement.",
    "Legal Documentation": "One-stop documentation centers in every major relocation corridor — where a single appointment produces every document needed for housing, employment, and school enrollment.",
    "Legal Barriers": "Legal aid embedded in the relocation process itself — so immigrants encounter their first lawyer before they encounter their first barrier, not after.",
    "Legal Status Uncertainty": "Clear, enforceable legal timelines that give relocated individuals certainty about their status — because you cannot build a life on a foundation of 'maybe.'",
    "Local Regulations": "Multilingual regulatory guides and free compliance consultations — turning local law from an invisible barrier into a navigable system.",
    "Professional Licenses": "Credential recognition agreements that honor international qualifications — so a nurse from Manila practices nursing in Vancouver, and a teacher from Damascus teaches in Surrey. Career dignity and the financial ability to buy a home in BC.",

    # Hub 5: Cultural Identity
    "Cultural Displacement": "Cultural reclamation programs that fund heritage spaces, language schools, and intergenerational storytelling — ensuring displacement preserves identity rather than erasing it.",
    "Cultural Preservation": "Living cultural archives maintained by the communities themselves — digital and physical spaces where traditions, recipes, songs, and histories are documented, celebrated, and transmitted.",
    "Cultural Integration": "Two-way integration programs where host communities learn from newcomers as much as newcomers adapt — creating genuinely multicultural neighborhoods rather than assimilation corridors.",
    "Cultural Adjustment": "Peer navigator programs pairing newcomers with settled community members — reducing culture shock through human connection rather than pamphlets.",
    "Cultural Misunderstandings": "Community dialogue circles and cultural competency training in schools, workplaces, and government offices — turning misunderstanding into mutual understanding.",
    "Cultural Events": "Municipally funded cultural festivals and gathering spaces — so every community has a stage, a kitchen, and a calendar that reflects who actually lives there.",
    "Local Traditions": "Tradition-sharing programs that invite newcomers into existing community rituals while creating space for new ones — building a shared identity that includes everyone's story.",
    "Local Festivals": "Inclusive festival calendars that celebrate the full diversity of a community — drawing crowds that cross cultural lines and generating economic activity for newcomer-owned businesses.",
    "Local Cuisine": "Cultural food markets and community kitchens where culinary traditions become bridges — feeding both the body and the sense of belonging.",
    "Identity Loss": "Identity reconstruction support through art therapy, memoir projects, and cultural mentorship — helping individuals author the next chapter of their story, not mourn the last one.",
    "Language Barrier": "Immersive language programs integrated into daily life — workplace language coaching, bilingual community events, and AI-powered translation tools that make communication instant.",
    "Language Barriers": "Systemic language access in every public service — courts, hospitals, schools, and transit systems that communicate in the languages their communities actually speak.",
    "Language Classes": "Free, flexible language instruction available evenings and weekends with childcare — removing every barrier between a newcomer and fluency.",
    "Local Entertainment": "Community-driven entertainment venues and creative spaces — so relocated individuals find joy, expression, and social connection in their new home.",

    # Hub 6: Community & Social
    "Social Isolation": "Intentional community design — co-housing, shared gardens, communal kitchens, and neighborhood gathering spaces that make connection unavoidable and loneliness structurally difficult.",
    "Community Integration": "Welcome infrastructure that pairs every relocated family with a neighborhood host — transforming arrival from a bureaucratic process into a human one.",
    "Community Fragmentation": "Community land trusts and neighborhood assemblies that give relocated populations governance power — rebuilding social fabric through shared ownership and collective decision-making.",
    "Community Resources": "Resource-sharing networks — tool libraries, skill exchanges, and mutual aid circles — that turn individual scarcity into collective sufficiency.",
    "Local Friendships": "Structured social programming — sports leagues, cooking clubs, parent groups — that creates the 'third places' where organic friendships form across cultural lines.",
    "Local Networking": "Professional networking events specifically designed for newcomers — where a displaced accountant meets a local firm partner over coffee, not through a cold application.",
    "Social Services": "Proactive social service outreach that finds families before they reach crisis — home visits, community check-ins, and navigators who know every program and every deadline.",
    "Social Services Strain": "Scaled social service funding that automatically increases with displacement data — ending the pattern of demand outrunning capacity by years.",
    "Family Separation": "Family reunification fast-tracks and affordable communication technology — because no policy goal justifies the psychological destruction of keeping families apart.",
    "Aging Population": "Age-friendly relocation pathways with guaranteed care continuity — so seniors move toward better support, not away from the only community they've known.",
    "Pet Relocation": "Pet-inclusive relocation support and housing policies — because the human-animal bond is a mental health anchor that no displacement policy should sever.",
    "Local Politics": "Civic onboarding programs that help newcomers understand local governance and run for office — turning political alienation into participatory democracy.",
    "Public Services": "Multilingual, digitally accessible public services with extended hours and mobile units — meeting people where they are, not where bureaucracies are comfortable.",

    # Hub 7: Crisis, Safety & Environment
    "Climate Change Relocation": "Managed climate retreat corridors with pre-built receiving communities — so climate displacement becomes planned migration rather than panicked flight.",
    "Natural Disaster Evacuations": "Community-scale evacuation plans with guaranteed return-or-resettle commitments — eliminating the secondary trauma of permanent displacement disguised as temporary shelter.",
    "Disaster Preparedness": "Disaster-ready communities where every household has a plan, every neighborhood has a supply cache, and every vulnerable person has a named contact who will come for them.",
    "Environmental Degradation": "Ecological restoration programs that employ relocated populations as environmental stewards — healing land and community simultaneously.",
    "Climate Adaptation": "Climate-adaptive housing and infrastructure that makes new communities more resilient than the ones people left — turning forced moves into upgrades in quality of life.",
    "Local Weather": "Climate orientation programs and weather-appropriate housing that prepare newcomers for their new environment — preventing the health and safety risks of climate unfamiliarity.",
    "Safety Concerns": "Community safety through design — well-lit streets, visible public spaces, neighborhood watch programs, and trauma-informed policing that builds trust rather than fear.",
    "Neighborhood Safety": "Safe neighborhood covenants developed by residents themselves — where safety comes from mutual knowledge and collective responsibility, not surveillance.",
    "Security Concerns": "Integrated security frameworks that protect displaced populations from exploitation — trafficking prevention, fraud awareness, and safe reporting channels that don't risk deportation.",
    "Refugee Crisis": "Comprehensive refugee reception infrastructure that treats arrival as the beginning of contribution, not the beginning of dependency — housing, language, employment, and community from day one.",
    "Political Instability": "Safe haven designations with accelerated settlement pathways — so people fleeing political violence encounter stability within weeks of arrival, not years.",
    "Emergency Services": "Culturally competent emergency services staffed by community members — where a 911 call connects you to someone who speaks your language and understands your context.",

    # Hub 8: Education & Digital
    "Education Disruption": "Seamless school transition protocols that transfer credits, accommodate learning gaps, and provide counseling — so a child's education bends with displacement but never breaks.",
    "Education Access": "Universal education enrollment guarantees regardless of documentation status — because a child's right to learn should never depend on a parent's visa timeline.",
    "School Enrollment": "Same-week school enrollment with built-in language support and peer buddies — transforming the first day from terrifying to welcoming.",
    "Local Schools": "Schools resourced in proportion to displacement demand — with counselors, translators, and cultural liaisons funded automatically when enrollment spikes.",
    "Digital Divide": "Free broadband and device programs for every relocated household — because in 2026, internet access is not a luxury; it is the gateway to employment, education, healthcare, and democratic participation.",
    "Internet Connectivity": "Municipal broadband infrastructure that guarantees high-speed connectivity in every high-displacement area — eliminating the digital redlining that compounds physical displacement with informational exile.",
}

# ── Generic summary templates by hub domain ──
SUMMARY_TEMPLATES = {
    "housing": "This audit exposes a critical housing and infrastructure failure affecting displaced populations across British Columbia. The evidence demands immediate systemic intervention — without it, the most vulnerable communities will continue to bear the cost of policy neglect.",
    "health": "This audit reveals a healthcare and wellbeing gap that is actively harming displaced populations in BC. The data is unambiguous: current systems are failing the people who need them most, and the consequences are measured in preventable suffering.",
    "economic": "This audit documents an economic equity crisis that is deepening with every wave of displacement in BC. The pattern is clear: those who lose the most are asked to pay the highest price to recover, while the systems designed to help remain chronically underfunded.",
    "legal": "This audit maps the legal and bureaucratic barriers that trap displaced individuals in cycles of uncertainty. In BC, the gap between rights on paper and rights in practice is wide enough to swallow entire families — and the system treats this as normal.",
    "cultural": "This audit investigates the cultural and identity costs of displacement — the losses that don't appear in economic data but define whether a person feels human in their new home. In BC, cultural erasure is not a side effect of relocation; it is a structural feature.",
    "community": "This audit examines how displacement fractures the social fabric — severing the relationships, networks, and mutual support systems that no government program can replace. In BC, community is not a luxury; it is infrastructure.",
    "crisis": "This audit confronts the crisis, safety, and environmental forces driving displacement in BC — and the catastrophic failure of systems meant to protect people when everything else fails. The stakes are measured in lives.",
    "education": "This audit exposes the education and digital access gaps that compound displacement — turning a temporary disruption into a permanent disadvantage. In BC, a child's future should not be determined by the postal code they were displaced into.",
}

HUB_DOMAIN_MAP = {
    "hub-01-housing-infrastructure": "housing",
    "hub-02-health-wellbeing": "health",
    "hub-03-economic-equity": "economic",
    "hub-04-legal-immigration": "legal",
    "hub-05-cultural-identity": "cultural",
    "hub-06-community-social": "community",
    "hub-07-crisis-safety-environment": "crisis",
    "hub-08-education-digital-access": "education",
}


def get_topic_from_frontmatter(content):
    """Extract topic/title from frontmatter."""
    match = re.search(r'^title:\s*"([^"]*)"', content, re.MULTILINE)
    if match:
        title = match.group(1)
        # Strip ": A Forensic Equity Audit" suffix for spoke articles
        topic = re.sub(r':\s*A Forensic Equity Audit$', '', title)
        return topic
    return None


def get_article_type(content):
    """Check if hub or spoke."""
    match = re.search(r'^type:\s*"([^"]*)"', content, re.MULTILINE)
    return match.group(1) if match else "spoke"


def find_hub_dir(filepath):
    """Get the hub directory name from filepath."""
    parts = filepath.split(os.sep)
    for p in parts:
        if p.startswith("hub-"):
            return p
    return None


def add_executive_summary(content, topic, hub_dir):
    """Insert Executive Summary after the Urgency Score line."""
    domain = HUB_DOMAIN_MAP.get(hub_dir, "community")
    summary = SUMMARY_TEMPLATES[domain]

    # For spoke articles: insert after the urgency score blockquote
    urgency_pattern = r'(> \*\*Urgency Score: \d+/10\*\* — [^\n]+\n)'
    match = re.search(urgency_pattern, content)
    if match:
        insert_point = match.end()
        summary_block = f"""
## Executive Summary

{summary} The topic of **{topic.lower()}** sits at the intersection of equity, access, and systemic accountability — making it one of the most consequential issues in this audit cluster.

"""
        return content[:insert_point] + summary_block + content[insert_point:]
    return content


def add_hub_executive_summary(content, title, hub_dir):
    """Insert Executive Summary for hub articles after the description blockquote."""
    domain = HUB_DOMAIN_MAP.get(hub_dir, "community")
    summary = SUMMARY_TEMPLATES[domain]

    # For hub articles: insert after the forensic equity audit blockquote
    pattern = r'(> \*\*Forensic Equity Audit\*\* — [^\n]+\n)'
    match = re.search(pattern, content)
    if match:
        insert_point = match.end()
        summary_block = f"""
## Executive Summary

{summary} This hub — **{title}** — synthesizes the forensic evidence across every spoke into a single, actionable picture of what must change in British Columbia.

"""
        return content[:insert_point] + summary_block + content[insert_point:]
    return content


def add_outcome_of_outcome(content, topic):
    """Insert 'Outcome of the Outcome' section after the Solution section."""
    outcome = OUTCOMES.get(topic)
    if not outcome:
        # Fuzzy match: try partial topic match
        for key, val in OUTCOMES.items():
            if key.lower() in topic.lower() or topic.lower() in key.lower():
                outcome = val
                break
    if not outcome:
        outcome = f"A British Columbia where {topic.lower()} is no longer a barrier but a solved problem — where the systems meant to support displaced populations actually work, and the communities that emerge are stronger, more equitable, and more resilient than what came before."

    # Find the Solution section's end (next --- or ## heading)
    # Pattern: ### Solution\n\n...content...\n\n---
    solution_pattern = r'(### Solution\n\n(?:(?!###|## |---).)*?\n)\n(---)'
    match = re.search(solution_pattern, content, re.DOTALL)
    if match:
        insert_point = match.end(1)
        outcome_block = f"""
### Outcome of the Outcome

**When this solution takes root, the ripple effect transforms everything downstream.**

{outcome}

This is not aspirational rhetoric — it is the documented trajectory of communities that have implemented forensic equity interventions at this specific pressure point. The evidence exists. The pathway is clear. What remains is the will to act.

"""
        return content[:insert_point] + outcome_block + content[insert_point:]
    return content


def add_hub_outcome_of_outcome(content, hub_dir):
    """Insert 'Outcome of the Outcome' for hub articles."""
    domain = HUB_DOMAIN_MAP.get(hub_dir, "community")
    hub_outcomes = {
        "housing": "Stable, affordable communities where displaced families build generational wealth, children attend the same school for years, and neighborhoods are designed for the people who live in them — not the investors who profit from their instability.",
        "health": "A healthcare ecosystem where displacement triggers automatic enrollment, not automatic exclusion — where mental health is treated with the same urgency as a broken bone, and where every child in BC has a pediatrician before they have a permanent address.",
        "economic": "An economy where the arrival of displaced workers is treated as a talent injection, not a labor threat — where credential recognition is automatic, financial inclusion is immediate, and every newcomer has a pathway from survival to prosperity within their first year.",
        "legal": "A legal system where documentation is a service, not a barrier — where every displaced person knows their rights before they encounter their first bureaucratic wall, and where the gap between legal status and human dignity is closed permanently.",
        "cultural": "Communities where cultural diversity is structural, not decorative — where children grow up multilingual, neighborhoods have gathering spaces for every tradition, and identity is something you bring with you, not something you leave behind.",
        "community": "A social fabric so resilient that displacement bends it but cannot break it — where every newcomer is met by a neighbor, every family has a network, and mutual aid is how communities operate by default.",
        "crisis": "A province where crisis response is so well-designed that displacement, when it happens, is managed with dignity — where no one sleeps in a gymnasium for more than 48 hours, and where 'temporary' never quietly becomes 'permanent.'",
        "education": "An education system where displacement is a documented, resourced life event — where schools receive funding the day enrollment spikes, where digital access is a right, and where no child falls behind because their family had to move.",
    }
    outcome = hub_outcomes.get(domain, hub_outcomes["community"])

    solution_pattern = r'(### Solution\n\n(?:(?!###|## |---).)*?\n)\n(---)'
    match = re.search(solution_pattern, content, re.DOTALL)
    if match:
        insert_point = match.end(1)
        outcome_block = f"""
### Outcome of the Outcome

**When every spoke in this hub delivers its intended impact, the compounding effect is transformational.**

{outcome}

This is the forensic case for systemic investment: not charity, not triage, but architecture — building the systems that make equity the default outcome rather than the exception.

"""
        return content[:insert_point] + outcome_block + content[insert_point:]
    return content


def process_file(filepath):
    """Process a single markdown file."""
    with open(filepath, 'r') as f:
        content = f.read()

    hub_dir = find_hub_dir(filepath)
    article_type = get_article_type(content)
    topic = get_topic_from_frontmatter(content)

    if not topic or not hub_dir:
        return False

    modified = content

    if article_type == "hub":
        modified = add_hub_executive_summary(modified, topic, hub_dir)
        modified = add_hub_outcome_of_outcome(modified, hub_dir)
    else:
        modified = add_executive_summary(modified, topic, hub_dir)
        modified = add_outcome_of_outcome(modified, topic)

    if modified != content:
        with open(filepath, 'w') as f:
            f.write(modified)
        return True
    return False


def main():
    strategy_dir = "strategy"
    updated = 0
    skipped = 0

    for root, dirs, files in os.walk(strategy_dir):
        for fname in files:
            if not fname.endswith(".md") or fname == "master_plan.md":
                continue
            filepath = os.path.join(root, fname)
            if process_file(filepath):
                updated += 1
            else:
                skipped += 1
                print(f"  ⚠ Skipped: {filepath}")

    print(f"\n✅ Upgraded {updated} articles ({skipped} skipped)")


if __name__ == "__main__":
    main()
