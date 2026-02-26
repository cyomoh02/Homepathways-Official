# Blog Review Workflow Instructions

## Mission Statement

Define the quality control process for reviewing blog drafts before approval and publication, ensuring all content meets HomePathways standards for accuracy, engagement, and conversion optimization.

---

## Workflow Overview

```
Ghostwriter Agent Creates Draft
         ↓
Saved to: 04_Campaigns/Drafts_For_Review/
         ↓
Human Review (This Process)
         ↓
Approved → Move to: 04_Campaigns/Approved/
         ↓
WordPress Publication (via REST API or Manual)
```

---

## Review Checklist

### 1. Protocol Compliance

**1-3-Story-1 Structure**:

- [ ] **Hook** is present and compelling (first 3-5 sentences)
- [ ] **Three-Point Value** section is clear and actionable
- [ ] **Emotional Story** is included and relatable
- [ ] **Single CTA** is clear and appropriate for funnel stage

**Scoring**: Must pass all 4 elements to proceed

---

### 2. Persona Alignment

**Target Persona Verification**:

- [ ] Content clearly targets one of the 12 personas from Market_Truths_2026.md
- [ ] Pain points match persona profile
- [ ] Opportunities/solutions are persona-specific
- [ ] Language and tone resonate with target audience

**Reference**: Check against Market_Truths_2026.md persona descriptions

---

### 3. Data Accuracy

**Critical Statistics** (verify against Market_Truths_2026.md and Researcher.md):

- [ ] **227-day probate backlog** (if mentioned) is current
- [ ] **6.45% tax deferral rate** (if mentioned) is current
- [ ] **2% Federal Suite loan** (if mentioned) is current
- [ ] All other statistics are cited and verifiable
- [ ] No outdated or incorrect data present

**Action**: If data is outdated, update before approval

---

### 4. Content Quality

**Readability**:

- [ ] Paragraphs are 2-4 sentences max
- [ ] Sentences are clear and concise (under 25 words average)
- [ ] No jargon without explanation
- [ ] Subheadings break up content every 200-300 words
- [ ] Bullet points or numbered lists used where appropriate

**Engagement**:

- [ ] Hook creates curiosity or urgency
- [ ] Story is emotionally resonant
- [ ] Examples are specific and vivid
- [ ] Reader can see themselves in the content

**Value**:

- [ ] Three points are genuinely useful
- [ ] Reader learns something new or actionable
- [ ] Content goes beyond surface-level advice

---

### 5. SEO & AEO Optimization

**Keywords**:

- [ ] Primary keyword appears in title
- [ ] Primary keyword appears in first paragraph
- [ ] Secondary keywords naturally integrated
- [ ] No keyword stuffing

**Structure for Featured Snippets**:

- [ ] Clear question-answer format (where applicable)
- [ ] Concise answers (40-60 words for definitions)
- [ ] Lists or steps clearly formatted
- [ ] Statistics highlighted

**Meta Elements** (to be added in WordPress):

- [ ] Title is 50-60 characters
- [ ] Meta description is 150-160 characters
- [ ] URL slug is clear and keyword-rich

---

### 6. Conversion Optimization

**CTA Effectiveness**:

- [ ] CTA is singular (only one primary action)
- [ ] CTA is specific (not generic "Contact Us")
- [ ] CTA matches content depth and reader readiness
- [ ] CTA link/button is functional (if applicable)

**CTA Examples by Funnel Stage**:

- **Top of Funnel**: "Download the Probate Executor's Checklist"
- **Middle of Funnel**: "Book Your 20-Minute Strategy Call"
- **Bottom of Funnel**: "Schedule Your Property Valuation"

---

### 7. Brand Consistency

**Voice & Tone** (per Ghostwriter.md):

- [ ] Authoritative but accessible
- [ ] Empathetic but action-oriented
- [ ] Data-driven but human
- [ ] Honest but optimistic

**Avoid**:

- [ ] No real estate clichés ("dream home," "perfect time to buy")
- [ ] No pressure tactics or false urgency
- [ ] No overpromising or guarantees
- [ ] No generic advice

---

### 8. Legal & Compliance

**Disclaimers**:

- [ ] Financial advice includes appropriate disclaimers
- [ ] Legal information notes "consult a lawyer"
- [ ] Tax information notes "consult a tax professional"
- [ ] No guarantees of specific outcomes

**Accuracy**:

- [ ] All claims are factual and supportable
- [ ] No misleading statements
- [ ] Proper attribution for quotes or data

---

### 9. Technical Elements

**Formatting**:

- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] No formatting errors (broken bold, italics, etc.)
- [ ] Links are functional and open correctly
- [ ] Images have alt text (if applicable)

**Length**:

- [ ] Blog post is 800-1200 words (ideal range)
- [ ] Not too short (under 600 words)
- [ ] Not too long (over 1500 words without subheadings)

---

### 10. Final Polish

**Proofreading**:

- [ ] No spelling errors
- [ ] No grammatical errors
- [ ] No typos
- [ ] Consistent punctuation style

**Flow**:

- [ ] Smooth transitions between sections
- [ ] Logical progression of ideas
- [ ] No abrupt topic changes
- [ ] Conclusion ties back to hook

---

## Review Process

### Step 1: Initial Read-Through

**Purpose**: Get overall impression and identify major issues

**Actions**:

1. Read the entire post from start to finish
2. Note first impressions (engaging? confusing? too long?)
3. Identify any glaring errors or missing elements

**Time**: 5-10 minutes

---

### Step 2: Checklist Review

**Purpose**: Systematically verify all quality standards

**Actions**:

1. Go through each section of the checklist above
2. Mark items as pass/fail
3. Note specific issues that need correction

**Time**: 10-15 minutes

---

### Step 3: Edits & Corrections

**Purpose**: Fix identified issues

**Actions**:

1. Correct spelling, grammar, and formatting errors
2. Update outdated statistics or data
3. Strengthen weak sections (hook, story, CTA)
4. Improve readability (break up long paragraphs, add subheadings)

**Time**: 15-30 minutes (depending on issues)

---

### Step 4: Final Approval Decision

**Decision Matrix**:

| Checklist Score | Action                                            |
| --------------- | ------------------------------------------------- |
| 90-100% pass    | **APPROVE** - Move to Approved folder             |
| 70-89% pass     | **REVISE** - Make edits and re-review             |
| Below 70%       | **REJECT** - Send back to Ghostwriter for rewrite |

**Approval Criteria**:

- All "Critical" items must pass (Protocol, Persona, Data Accuracy)
- At least 90% of total checklist items pass
- No major quality issues remain

---

### Step 5: Move to Approved Folder

**If Approved**:

1. **Rename file** (if needed) to match WordPress slug format:
   - Example: `Probate_Executor_227_Day_Crisis.md` → `probate-executor-227-day-crisis.md`

2. **Move file** from `Drafts_For_Review/` to `Approved/`

3. **Update Ready_To_Launch.md** with:
   - File name
   - Target persona
   - Publish date (scheduled)
   - Category and tags

4. **Notify team** (if applicable) that post is ready for WordPress

---

## WordPress Publication Checklist

Once moved to Approved folder, prepare for WordPress:

### Pre-Publication

- [ ] Copy content into WordPress editor
- [ ] Add featured image (1200x630px, optimized)
- [ ] Set category (aligned with persona)
- [ ] Add tags (3-7 tags, mix of data/topic/location/persona)
- [ ] Write meta description (150-160 characters)
- [ ] Set URL slug (lowercase, hyphens, keyword-rich)
- [ ] Add internal links (2-3 to relevant service/guide pages)
- [ ] Add external links (1-2 to authoritative sources)

### Yoast/Rank Math SEO

- [ ] Focus keyword set
- [ ] SEO score: Green (good) or Orange (acceptable)
- [ ] Readability score: Green (good) or Orange (acceptable)
- [ ] Schema markup configured (BlogPosting)

### Final Check

- [ ] Preview post on desktop
- [ ] Preview post on mobile
- [ ] Test all links
- [ ] Verify images load correctly
- [ ] Check formatting (no weird spacing, broken elements)

### Publication

- [ ] Set publish date/time (Tuesday, Thursday, or Saturday at 9:00 AM PT)
- [ ] Publish or schedule
- [ ] Verify live post looks correct
- [ ] Share on social media (if applicable)

---

## Common Issues & Solutions

### Issue: Hook is Weak

**Symptoms**: Generic opening, no curiosity, doesn't stop the scroll

**Solution**:

- Lead with surprising statistic ("227 days...")
- Ask provocative question
- Use contrarian statement
- Create urgency or concern

**Example Fix**:

- ❌ "Probate can be a difficult process for executors."
- ✅ "227 days. That's how long your family will wait for probate while property taxes and maintenance costs drain the estate."

---

### Issue: Story is Missing or Weak

**Symptoms**: All facts, no emotion; generic example; no client story

**Solution**:

- Add specific client story (anonymized)
- Include emotional details (what they felt, said, worried about)
- Show transformation (before → decision → after)
- Make it relatable ("that could be me")

---

### Issue: CTA is Unclear or Multiple

**Symptoms**: Multiple CTAs competing; vague action; no clear next step

**Solution**:

- Choose ONE primary CTA
- Make it specific and actionable
- Match to funnel stage
- Use action verb + outcome + ease indicator

**Example Fix**:

- ❌ "Contact us to learn more or download our guide or book a call."
- ✅ "Download the Executor's Timeline: 227 Days to Grant (Free PDF) →"

---

### Issue: Data is Outdated

**Symptoms**: Old statistics, expired programs, incorrect rates

**Solution**:

- Check Market_Truths_2026.md for current data
- Verify with Researcher.md sources
- Update all instances in the post
- Add "Last Updated: [Date]" if needed

---

### Issue: Too Generic (Not Persona-Specific)

**Symptoms**: Could apply to anyone; no specific pain points; generic advice

**Solution**:

- Review persona profile in Market_Truths_2026.md
- Add persona-specific pain points
- Include persona-specific solutions
- Use persona language and concerns

---

## Quality Standards Summary

### Minimum Standards (Must Pass)

1. ✅ Follows 1-3-Story-1 protocol
2. ✅ Targets specific persona
3. ✅ All data is accurate and current
4. ✅ No spelling or grammar errors
5. ✅ Single clear CTA

### Excellence Standards (Aim For)

1. 🌟 Hook creates immediate curiosity or urgency
2. 🌟 Story is emotionally compelling and specific
3. 🌟 Three points are genuinely valuable and actionable
4. 🌟 Optimized for featured snippets (AEO)
5. 🌟 Includes internal links to service pages
6. 🌟 Mobile-friendly formatting
7. 🌟 Unique angle or insight (not generic advice)

---

## Review Time Estimates

| Post Quality              | Review Time           |
| ------------------------- | --------------------- |
| Excellent (few issues)    | 20-30 minutes         |
| Good (minor edits needed) | 30-45 minutes         |
| Fair (significant edits)  | 45-60 minutes         |
| Poor (major rewrite)      | 60+ minutes or reject |

**Goal**: Average 30-40 minutes per post review

---

## Reviewer Notes Template

Use this template when reviewing:

```
POST: [File Name]
REVIEWER: [Your Name]
DATE: [Review Date]

PERSONA TARGET: [Which of 12 personas]
PROTOCOL COMPLIANCE: [Pass/Fail - note issues]
DATA ACCURACY: [Pass/Fail - note issues]
CONTENT QUALITY: [Pass/Fail - note issues]
SEO/AEO: [Pass/Fail - note issues]

MAJOR ISSUES:
- [List any major problems]

MINOR EDITS NEEDED:
- [List small fixes]

APPROVAL STATUS: [Approved / Needs Revision / Rejected]

NOTES:
[Any additional comments or suggestions]
```

---

## Continuous Improvement

### Monthly Review

- Analyze which posts perform best (engagement, conversions)
- Identify common issues in drafts
- Update checklist based on learnings
- Share best practices with Ghostwriter Agent

### Quarterly Audit

- Review all published posts for outdated data
- Update statistics and program information
- Refresh underperforming posts
- Archive or redirect obsolete content

---

**Last Updated**: February 2026  
**Review Cycle**: Monthly (process refinement) / As needed (checklist updates)  
**Owner**: Campaigns Division
