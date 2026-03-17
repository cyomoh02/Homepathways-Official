"""Verify all external BC links used in generated content."""
import json
import ssl
import urllib.request
import urllib.error
import certifi
import concurrent.futures

SSL_CTX = ssl.create_default_context(cafile=certifi.where())

BC_LINKS = [
    "https://www.bchousing.org/",
    "https://www2.gov.bc.ca/gov/content/housing-tenancy",
    "https://tenants.bc.ca/",
    "https://www.cmhc-schl.gc.ca/",
    "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/02078_01",
    "https://www2.gov.bc.ca/gov/content/health",
    "https://www.healthlinkbc.ca/",
    "https://www.fnha.ca/",
    "https://crisiscentre.bc.ca/",
    "https://www.fraserhealth.ca/",
    "https://www.workbc.ca/",
    "https://www2.gov.bc.ca/gov/content/employment-business",
    "https://www.smallbusinessbc.ca/",
    "https://bcchamber.org/",
    "https://www.bcbudget.gov.bc.ca/",
    "https://www.legalaid.bc.ca/",
    "https://www.cbabc.org/",
    "https://www2.gov.bc.ca/gov/content/justice",
    "https://www.clicklaw.bc.ca/",
    "https://www.bclaws.gov.bc.ca/",
    "https://www.bcartscouncil.ca/",
    "https://www.welcomebc.ca/",
    "https://www2.gov.bc.ca/gov/content/governments/multiculturalism-anti-racism",
    "https://fpcc.ca/",
    "https://www.issbc.org/",
    "https://www.volunteerbc.bc.ca/",
    "https://www.211.ca/",
    "https://uwbc.ca/",
    "https://www2.gov.bc.ca/gov/content/family-social-supports",
    "https://www.bcafn.ca/",
    "https://www2.gov.bc.ca/gov/content/safety/emergency-management",
    "https://www.preparedbc.ca/",
    "https://www.redcross.ca/in-your-community/british-columbia-and-yukon",
    "https://www2.gov.bc.ca/gov/content/environment/climate-change",
    "https://www.rcmp-grc.gc.ca/en/bc",
    "https://www2.gov.bc.ca/gov/content/education-training",
    "https://www.bced.gov.bc.ca/",
    "https://www.bcit.ca/",
    "https://www2.gov.bc.ca/gov/content/education-training/k-12",
    "https://www.openschool.bc.ca/",
]

def check_url(url):
    try:
        req = urllib.request.Request(url, method="HEAD", headers={
            "User-Agent": "Mozilla/5.0 (HomePathways Link Checker)"
        })
        with urllib.request.urlopen(req, timeout=10, context=SSL_CTX) as resp:
            return url, resp.status, "OK"
    except urllib.error.HTTPError as e:
        return url, e.code, "HTTP Error"
    except Exception as e:
        # Try GET as fallback (some servers reject HEAD)
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (HomePathways Link Checker)"
            })
            with urllib.request.urlopen(req, timeout=10, context=SSL_CTX) as resp:
                return url, resp.status, "OK (GET fallback)"
        except urllib.error.HTTPError as e2:
            return url, e2.code, "HTTP Error"
        except Exception as e2:
            return url, 0, str(e2)[:60]

def main():
    unique_links = list(set(BC_LINKS))
    print(f"Verifying {len(unique_links)} unique external links...\n")

    results = {"ok": [], "warning": [], "dead": []}

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(check_url, url): url for url in unique_links}
        for future in concurrent.futures.as_completed(futures):
            url, status, msg = future.result()
            icon = "✅" if status in (200, 301, 302, 303, 307, 308) else "⚠️" if status in (403, 405, 406) else "❌"
            print(f"  {icon} [{status}] {url} — {msg}")
            if status in (200, 301, 302, 303, 307, 308):
                results["ok"].append(url)
            elif status in (403, 405, 406):
                results["warning"].append(url)  # Likely blocking bots but alive
            else:
                results["dead"].append(url)

    print(f"\n{'='*60}")
    print(f"✅ Live: {len(results['ok'])}")
    print(f"⚠️  Likely live (blocking bots): {len(results['warning'])}")
    print(f"❌ Dead/unreachable: {len(results['dead'])}")
    if results["dead"]:
        print(f"\nDead links to replace:")
        for url in results["dead"]:
            print(f"  - {url}")

    with open("link_verification.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()
