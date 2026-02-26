# Interactive Components Documentation

## Mission Statement

Document the logic, data flow, and persona-tagging architecture for interactive web components—specifically the assessment.html tool—ensuring seamless lead capture, CRM integration, and personalized user experiences.

---

## Overview: The Assessment Tool

### Purpose

The **Strategic Roadmap Audit** (assessment.html) is the primary lead generation and persona-identification tool. It:

1. **Qualifies leads** through 21 contextual questions
2. **Tags personas** based on response patterns
3. **Captures contact data** (name, email, phone)
4. **Sends data to CRM** (GoHighLevel webhook)
5. **Delivers personalized report** (report.html)

### User Journey

```
Homepage → Assessment CTA
         ↓
Persona Selection (6 options)
         ↓
21-Question Audit (persona-specific)
         ↓
Lead Capture Gate (name, email, phone)
         ↓
CRM Webhook Submission
         ↓
Personalized Report Page
```

---

## Architecture: assessment.html

### Technology Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Tailwind CSS (CDN)
- **Data Storage**: LocalStorage (client-side)
- **CRM Integration**: GoHighLevel webhook (POST)
- **Hosting**: Static HTML (GitHub Pages, Netlify, or traditional)

### File Structure

```
assessment.html
├── HTML Structure
│   ├── Navigation (global header)
│   ├── Persona Grid (initial screen)
│   ├── Audit Screen (question flow)
│   └── Lead Capture Gate (final screen)
│
├── Hidden Form (GHL webhook)
│   └── Hidden iframe (form submission target)
│
└── JavaScript Logic
    ├── AuditLibrary (persona data)
    ├── Rendering Functions
    ├── State Management
    └── CRM Submission
```

---

## Data Structure: AuditLibrary

### Schema

```javascript
const AuditLibrary = {
  "Persona Name": {
    desc: "User-facing description for persona selection",
    res: {
      str: "Strength statement (validation)",
      stand: "Current situation analysis",
      pro: "Professional solution offered",
    },
    q: [
      {
        q: "Question text",
        opts: ["Option 1", "Option 2", "Option 3", "Option 4"],
      },
      // ... 21 questions total
    ],
  },
};
```

### Current Personas (6)

1. **Probate Family**
   - Target: Executors managing estate property
   - Key Pain: 227-day probate backlog, family coordination
   - Questions Focus: Legal status, property condition, family dynamics

2. **Aging In Place**
   - Target: Seniors wanting to stay in current home
   - Key Pain: Safety concerns, maintenance burden
   - Questions Focus: Accessibility, safety features, support systems

3. **Relocation**
   - Target: Families moving to new city/neighborhood
   - Key Pain: Unfamiliarity with area, school catchments
   - Questions Focus: Neighborhood preferences, timing, budget

4. **First Time Buyer**
   - Target: Renters ready to purchase first home
   - Key Pain: Down payment, qualification, market knowledge
   - Questions Focus: Budget, mortgage readiness, location preferences

5. **Presale Investor**
   - Target: Investors buying pre-construction
   - Key Pain: Assignment rules, developer reputation, exit strategy
   - Questions Focus: Investment goals, risk tolerance, market knowledge

6. **Rightsizing Senior**
   - Target: Empty nesters downsizing from family home
   - Key Pain: Emotional attachment, decluttering, lifestyle transition
   - Questions Focus: Motivation, timeline, new home preferences

---

## User Flow: Step-by-Step

### Step 1: Persona Selection

**Screen**: `#grid-screen`

**Function**: `renderPersonas()`

**Logic**:

```javascript
// Dynamically generates 6 persona cards from AuditLibrary
Object.keys(AuditLibrary).map((key) => {
  // Create clickable card with:
  // - Persona name
  // - Description
  // - "Begin My Journey" CTA
});
```

**User Action**: Click persona card

**Trigger**: `initAudit(personaName)`

---

### Step 2: Audit Initialization

**Function**: `initAudit(p)`

**Logic**:

```javascript
function initAudit(p) {
  currentType = p; // Store selected persona
  // Hide persona grid
  // Show audit screen
  // Update header label
  renderStep(); // Start question 1
}
```

**State Variables**:

- `currentType`: Selected persona name
- `step`: Current question number (1-21)
- `selectedAnswers`: Object storing all responses

---

### Step 3: Question Flow

**Screen**: `#audit-screen`

**Function**: `renderStep()`

**Logic**:

```javascript
function renderStep() {
  if (step > 21) {
    renderGate(); // Show lead capture
    return;
  }

  // Get question data for current step
  const qData = AuditLibrary[currentType].q[step - 1];

  // Render question + 4 options
  // Each option is clickable
}
```

**Progress Tracking**:

- Progress bar: `(step / 22) * 100%`
- Label: "Point X of 21"
- Back button: Visible after step 1

**User Action**: Click answer option

**Trigger**: `autoAdvance(selectedOption)`

---

### Step 4: Answer Capture

**Function**: `autoAdvance(val)`

**Logic**:

```javascript
function autoAdvance(val) {
  selectedAnswers[step] = val; // Store answer
  step++; // Increment step
  renderStep(); // Render next question
}
```

**Data Storage**:

```javascript
selectedAnswers = {
  1: "I'd like to sell it for the best price possible",
  2: "I have the 'Grant of Probate' ready to go",
  3: "No, the house is currently empty",
  // ... up to 21
};
```

---

### Step 5: Lead Capture Gate

**Function**: `renderGate()`

**Triggered**: When `step > 21`

**Screen Content**:

```html
<h3>Analysis Complete.</h3>
<p>Where should I send your roadmap?</p>

<input id="uname" placeholder="Your Name" />
<input id="uemail" placeholder="Email Address" />
<input id="uphone" placeholder="Phone Number (Optional)" />

<button onclick="finalize()">Generate My Roadmap →</button>
```

**Validation**: Name and email required, phone optional

---

### Step 6: Data Submission

**Function**: `finalize()`

**Logic Flow**:

```javascript
async function finalize() {
  // 1. Validate inputs
  const n = document.getElementById("uname").value;
  const e = document.getElementById("uemail").value;
  const p = document.getElementById("uphone").value;

  if (!n || !e) {
    alert("Please provide your name and email.");
    return;
  }

  // 2. Store persona results in LocalStorage
  const res = AuditLibrary[currentType].res;
  localStorage.setItem("hp_name", n);
  localStorage.setItem("hp_str", res.str);
  localStorage.setItem("hp_stand", res.stand);
  localStorage.setItem("hp_pro", res.pro);
  localStorage.setItem("hp_type", currentType);

  // 3. Build transcript of all answers
  let notesTranscript = `Audit Type: ${currentType}\n\n`;
  for (let k in selectedAnswers) {
    notesTranscript += `Point ${k}: ${selectedAnswers[k]}\n`;
  }

  // 4. Populate hidden form fields
  document.getElementById("ghl-name").value = n;
  document.getElementById("ghl-email").value = e;
  document.getElementById("ghl-phone").value = p;
  document.getElementById("ghl-notes").value = notesTranscript;
  document.getElementById("ghl-source").value = currentType;
  document.getElementById("ghl-persona").value = currentType;

  // 5. Submit to GoHighLevel webhook
  document.getElementById("ghl-form").submit();

  // 6. Redirect to report page
  setTimeout(() => {
    window.location.href = "report.html";
  }, 800);
}
```

---

## CRM Integration: GoHighLevel Webhook

### Hidden Form Structure

```html
<form
  id="ghl-form"
  action="https://services.leadconnectorhq.com/hooks/[WEBHOOK_ID]"
  method="POST"
  target="ghl-hidden-frame"
  style="display:none;"
>
  <input type="text" name="first_name" id="ghl-name" />
  <input type="email" name="email" id="ghl-email" />
  <input type="tel" name="phone" id="ghl-phone" />
  <input type="text" name="notes" id="ghl-notes" />
  <input type="text" name="source" id="ghl-source" />
  <input type="text" name="pathway_score" id="ghl-score" />
  <input type="text" name="pathway_persona" id="ghl-persona" />
</form>

<iframe name="ghl-hidden-frame" style="display:none;"></iframe>
```

### Field Mapping

| Form Field        | GHL Field          | Data Source           | Example Value                                                |
| ----------------- | ------------------ | --------------------- | ------------------------------------------------------------ |
| `first_name`      | Contact First Name | User input            | "Jennifer"                                                   |
| `email`           | Contact Email      | User input            | "jennifer@example.com"                                       |
| `phone`           | Contact Phone      | User input (optional) | "+1-604-555-1234"                                            |
| `notes`           | Contact Notes      | Generated transcript  | "Audit Type: Probate Family\n\nPoint 1: I'd like to sell..." |
| `source`          | Lead Source        | Selected persona      | "Probate Family"                                             |
| `pathway_score`   | Custom Field       | Calculated score      | "0" (placeholder)                                            |
| `pathway_persona` | Custom Field (Tag) | Selected persona      | "Probate Family"                                             |

### Webhook Configuration

**Method**: POST

**Content-Type**: application/x-www-form-urlencoded

**Target**: Hidden iframe (prevents page reload)

**Response**: Not processed (fire-and-forget)

---

## Persona Tagging Logic

### Primary Tag: Selected Persona

**Source**: User's initial persona selection

**Applied**: Immediately upon selection

**Use Cases**:

- CRM segmentation
- Email automation triggers
- Content personalization
- Follow-up workflows

### Secondary Tags: Response Patterns (Future Enhancement)

**Concept**: Analyze answer patterns to add sub-tags

**Example Logic**:

```javascript
// If Probate Family answers indicate urgency
if (
  selectedAnswers[2] === "I have the 'Grant of Probate' ready" &&
  selectedAnswers[15] === "Getting everything settled quickly"
) {
  additionalTags.push("Probate-Urgent");
}

// If First Time Buyer shows suite interest
if (
  selectedAnswers[7] === "Yes, it is a mandatory must-have" &&
  currentType === "First Time Buyer"
) {
  additionalTags.push("Suite-Income-Strategy");
}
```

**Implementation**: Requires webhook to accept array of tags

---

## LocalStorage: Report Data Transfer

### Purpose

Transfer persona-specific messaging from assessment to report page without server-side session management.

### Data Stored

```javascript
localStorage.setItem("hp_name", "Jennifer");
localStorage.setItem("hp_type", "Probate Family");
localStorage.setItem("hp_str", "You are acting as a wonderful anchor...");
localStorage.setItem("hp_stand", "The paperwork can feel like a heavy fog...");
localStorage.setItem(
  "hp_pro",
  "Our 'Quiet Transition' handles all property...",
);
```

### Data Retrieved (report.html)

```javascript
const userName = localStorage.getItem("hp_name");
const personaType = localStorage.getItem("hp_type");
const strengthMsg = localStorage.getItem("hp_str");
const situationMsg = localStorage.getItem("hp_stand");
const solutionMsg = localStorage.getItem("hp_pro");

// Render personalized report
document.getElementById("user-name").innerText = userName;
document.getElementById("strength").innerText = strengthMsg;
// etc.
```

### Data Lifecycle

- **Created**: On finalize() submission
- **Read**: On report.html page load
- **Cleared**: Optional (can persist for return visits)

---

## URL Parameters: Direct Persona Access

### Feature

Allow direct linking to specific persona audit (bypass persona selection).

### Implementation

```javascript
window.addEventListener("DOMContentLoaded", () => {
  renderPersonas();

  // Check for ?path= parameter
  const urlParams = new URLSearchParams(window.location.search);
  const targetPath = urlParams.get("path");

  if (targetPath && AuditLibrary[targetPath]) {
    initAudit(targetPath); // Skip grid, start audit
  }
});
```

### Usage Examples

```
https://homepathways.ca/assessment.html?path=Probate%20Family
https://homepathways.ca/assessment.html?path=First%20Time%20Buyer
https://homepathways.ca/assessment.html?path=Rightsizing%20Senior
```

### Use Cases

- Email campaign links (persona-specific CTAs)
- Social media ads (targeted to persona)
- Service page CTAs (e.g., serve-probate.html → Probate audit)
- Blog post CTAs (content-to-assessment funnel)

---

## Analytics & Event Tracking

### Recommended Events

**Google Analytics 4 Events**:

```javascript
// Persona selected
gtag("event", "persona_selected", {
  persona_type: currentType,
  event_category: "assessment",
  event_label: currentType,
});

// Question answered
gtag("event", "question_answered", {
  question_number: step,
  persona_type: currentType,
  event_category: "assessment",
});

// Assessment completed
gtag("event", "assessment_completed", {
  persona_type: currentType,
  event_category: "conversion",
  event_label: "lead_captured",
});

// Lead submitted
gtag("event", "lead_submitted", {
  persona_type: currentType,
  event_category: "conversion",
  value: 1,
});
```

### Implementation

Add tracking calls to existing functions:

```javascript
function initAudit(p) {
  currentType = p;

  // Track persona selection
  if (typeof gtag !== "undefined") {
    gtag("event", "persona_selected", {
      persona_type: p,
      event_category: "assessment",
    });
  }

  // ... rest of function
}
```

---

## Performance Optimization

### Current Performance

- **Load Time**: <1 second (static HTML + Tailwind CDN)
- **First Contentful Paint**: <0.5 seconds
- **Time to Interactive**: <1 second

### Optimization Techniques

1. **Tailwind CDN**: Fast, but consider self-hosted for production
2. **Inline Critical CSS**: For above-the-fold content
3. **Lazy Load**: Persona grid images (if added)
4. **Minify JavaScript**: Reduce file size
5. **Service Worker**: Cache for offline capability (optional)

---

## Security Considerations

### Client-Side Validation

**Current**: Basic presence check (name, email required)

**Enhanced**:

```javascript
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Optional field, but validate if provided
  const re = /^[\d\s\-\+\(\)]+$/;
  return phone === "" || re.test(phone);
}
```

### Data Sanitization

**Issue**: User input sent to CRM without sanitization

**Solution**:

```javascript
function sanitizeInput(str) {
  return str
    .replace(/[<>]/g, "") // Remove HTML tags
    .trim()
    .substring(0, 500); // Limit length
}

// Apply before submission
document.getElementById("ghl-name").value = sanitizeInput(n);
document.getElementById("ghl-email").value = sanitizeInput(e);
```

### HTTPS Requirement

**Critical**: Assessment must be served over HTTPS for:

- Secure form submission
- LocalStorage security
- User trust

---

## Error Handling

### Current State

Minimal error handling (alert for missing fields)

### Enhanced Error Handling

```javascript
async function finalize() {
  try {
    // Validation
    const n = document.getElementById("uname").value.trim();
    const e = document.getElementById("uemail").value.trim();
    const p = document.getElementById("uphone").value.trim();

    if (!n || !e) {
      showError("Please provide your name and email.");
      return;
    }

    if (!validateEmail(e)) {
      showError("Please provide a valid email address.");
      return;
    }

    // LocalStorage check
    if (typeof Storage === "undefined") {
      showError(
        "Your browser doesn't support this feature. Please update your browser.",
      );
      return;
    }

    // Store data
    localStorage.setItem("hp_name", n);
    // ... rest of storage

    // Submit form
    document.getElementById("ghl-form").submit();

    // Show success message
    showSuccess("Generating your roadmap...");

    // Redirect
    setTimeout(() => {
      window.location.href = "report.html";
    }, 800);
  } catch (error) {
    console.error("Submission error:", error);
    showError("Something went wrong. Please try again or contact us directly.");
  }
}

function showError(msg) {
  // Display error message to user
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mt-4";
  errorDiv.innerText = msg;
  document.getElementById("q-card").appendChild(errorDiv);
}

function showSuccess(msg) {
  // Display success message
  const successDiv = document.createElement("div");
  successDiv.className =
    "bg-brand-mint/10 border border-brand-mint text-brand-mint p-4 rounded-xl mt-4";
  successDiv.innerText = msg;
  document.getElementById("q-card").appendChild(successDiv);
}
```

---

## Accessibility (A11Y)

### Current Issues

- No keyboard navigation for option cards
- No ARIA labels
- No screen reader support

### Improvements

```html
<!-- Persona cards -->
<div
  onclick="initAudit('Probate Family')"
  onkeypress="if(event.key==='Enter') initAudit('Probate Family')"
  tabindex="0"
  role="button"
  aria-label="Begin Probate Family audit"
  class="option-card..."
>
  <!-- content -->
</div>

<!-- Question options -->
<div
  onclick="autoAdvance('Option 1')"
  onkeypress="if(event.key==='Enter') autoAdvance('Option 1')"
  tabindex="0"
  role="button"
  aria-label="Select option: Option 1"
  class="option-card..."
>
  Option 1
</div>

<!-- Progress indicator -->
<div
  role="progressbar"
  aria-valuenow="${step}"
  aria-valuemin="1"
  aria-valuemax="21"
  aria-label="Assessment progress"
>
  <div
    id="bar"
    class="h-full bg-brand-mint"
    style="width: ${(step/22)*100}%"
  ></div>
</div>
```

---

## Mobile Responsiveness

### Current Implementation

- Tailwind responsive classes (`md:`, `lg:`)
- Touch-friendly tap targets (min 44px)
- Readable font sizes (16px+ for body text)

### Testing Checklist

- [ ] iPhone SE (375px width)
- [ ] iPhone 12/13 (390px width)
- [ ] iPad (768px width)
- [ ] Desktop (1440px+ width)
- [ ] Landscape orientation
- [ ] Touch interactions (no hover states)

---

## Future Enhancements

### 1. Progress Save/Resume

**Feature**: Allow users to save progress and return later

**Implementation**:

```javascript
// Save progress to LocalStorage
function saveProgress() {
  localStorage.setItem(
    "hp_progress",
    JSON.stringify({
      currentType: currentType,
      step: step,
      selectedAnswers: selectedAnswers,
      timestamp: Date.now(),
    }),
  );
}

// Resume on page load
function resumeProgress() {
  const saved = localStorage.getItem("hp_progress");
  if (saved) {
    const data = JSON.parse(saved);
    // Check if less than 24 hours old
    if (Date.now() - data.timestamp < 86400000) {
      currentType = data.currentType;
      step = data.step;
      selectedAnswers = data.selectedAnswers;
      initAudit(currentType);
    }
  }
}
```

---

### 2. Conditional Question Logic

**Feature**: Show different questions based on previous answers

**Example**:

```javascript
// If user says "I have Grant of Probate ready"
// Skip questions about applying for probate
// Show questions about property preparation instead

function getNextQuestion() {
  if (
    currentType === "Probate Family" &&
    selectedAnswers[2] === "I have the 'Grant of Probate' ready"
  ) {
    return 5; // Skip to question 5
  }
  return step + 1; // Normal progression
}
```

---

### 3. Score Calculation

**Feature**: Calculate readiness score based on answers

**Implementation**:

```javascript
function calculateScore() {
  let score = 0;

  // Scoring logic per persona
  if (currentType === "Probate Family") {
    // +10 points if Grant ready
    if (selectedAnswers[2] === "I have the 'Grant of Probate' ready") {
      score += 10;
    }
    // +5 points if house is empty
    if (selectedAnswers[3] === "No, the house is currently empty") {
      score += 5;
    }
    // ... more scoring logic
  }

  return score;
}

// Use in finalize()
const totalScore = calculateScore();
document.getElementById("ghl-score").value = totalScore;
```

---

### 4. Multi-Language Support

**Feature**: Offer assessment in multiple languages

**Implementation**:

```javascript
const AuditLibrary_EN = {
  /* English version */
};
const AuditLibrary_ZH = {
  /* Chinese version */
};
const AuditLibrary_PA = {
  /* Punjabi version */
};

let currentLanguage = "EN";
let AuditLibrary = AuditLibrary_EN;

function setLanguage(lang) {
  currentLanguage = lang;
  AuditLibrary = eval(`AuditLibrary_${lang}`);
  renderPersonas();
}
```

---

### 5. Email Confirmation

**Feature**: Send confirmation email with report link

**Implementation**: Requires backend or email service integration

**Options**:

- GoHighLevel automation (send email on webhook receipt)
- Zapier integration (webhook → email service)
- Custom backend endpoint

---

## Testing Protocol

### Manual Testing Checklist

**Persona Selection**:

- [ ] All 6 personas render correctly
- [ ] Click initiates correct audit
- [ ] URL parameter works for direct access

**Question Flow**:

- [ ] All 21 questions display
- [ ] Progress bar updates correctly
- [ ] Back button works (except on Q1)
- [ ] Answers are stored correctly

**Lead Capture**:

- [ ] Gate appears after Q21
- [ ] Name/email validation works
- [ ] Phone field is optional
- [ ] Error messages display

**Data Submission**:

- [ ] LocalStorage data is set
- [ ] GHL webhook receives data
- [ ] Redirect to report.html works
- [ ] Report displays correct data

**Cross-Browser**:

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Troubleshooting Guide

### Issue: "Report page shows no data"

**Cause**: LocalStorage not set or cleared

**Solution**:

1. Check browser console for errors
2. Verify LocalStorage in DevTools (Application tab)
3. Ensure assessment completed fully
4. Check if user cleared browser data

---

### Issue: "Webhook not receiving data"

**Cause**: Form submission failed or webhook URL incorrect

**Solution**:

1. Check Network tab in DevTools
2. Verify webhook URL is correct
3. Test webhook with curl/Postman
4. Check GoHighLevel webhook logs

---

### Issue: "Progress bar stuck"

**Cause**: JavaScript error preventing step increment

**Solution**:

1. Check console for errors
2. Verify `step` variable is incrementing
3. Check if `autoAdvance()` is being called
4. Verify question data exists for current step

---

## Integration with Other Components

### Homepage Integration

**CTA Buttons** → `assessment.html`

```html
<a href="assessment.html" class="cta-button"> Discover Your Pathway → </a>
```

### Service Page Integration

**Persona-Specific CTAs** → `assessment.html?path=PersonaName`

```html
<!-- On serve-probate.html -->
<a href="assessment.html?path=Probate%20Family" class="cta-button">
  Start Your Probate Audit →
</a>
```

### Blog Integration

**Content-to-Assessment Funnel**

```html
<!-- At end of blog post about probate -->
<div class="cta-box">
  <h3>Ready for Your Custom Roadmap?</h3>
  <p>Take our 5-minute Strategic Audit to get personalized guidance.</p>
  <a href="../assessment.html?path=Probate%20Family"> Start Probate Audit → </a>
</div>
```

---

## Maintenance Schedule

### Weekly

- Monitor webhook success rate
- Check for JavaScript errors (Google Analytics)
- Review completion rate by persona

### Monthly

- Update question content if market data changes
- Review and optimize question flow based on drop-off
- A/B test persona descriptions

### Quarterly

- Audit full user journey
- Update persona messaging based on Market_Truths_2026.md
- Review and update CRM field mapping
- Performance optimization audit

---

**Last Updated**: February 2026  
**Review Cycle**: Monthly (content) / Quarterly (functionality)  
**Owner**: Web Architecture Division
