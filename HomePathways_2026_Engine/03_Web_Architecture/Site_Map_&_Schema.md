# Site Map & Schema Architecture

## Mission Statement

Define the hybrid web architecture that combines high-performance static HTML (VS Code) for core pages with WordPress for dynamic blog content, while implementing comprehensive Schema.org markup to maximize Answer Engine Optimization (AEO) and search visibility.

---

## Hybrid Architecture Overview

### Core Philosophy

**Static HTML Core + Dynamic WordPress Blog = Speed + Flexibility**

- **Static HTML Pages**: Lightning-fast load times, full design control, hosted directly
- **WordPress Blog**: Content management ease, SEO plugins, REST API integration
- **Seamless Integration**: Unified branding, cross-linking, shared analytics

---

## Site Structure

### Primary Domain: homepathways.ca

```
homepathways.ca/
│
├── [STATIC HTML - VS Code Managed]
│   ├── index.html                    (Homepage)
│   ├── about.html                    (About/Team)
│   ├── pathway.html                  (Pathway Overview)
│   ├── assessment.html               (Interactive Assessment Tool)
│   ├── pathway-assessment.html       (Assessment Results)
│   ├── report.html                   (Personalized Report)
│   │
│   ├── [Service Pages - Persona-Specific]
│   ├── serve-probate.html
│   ├── serve-aging.html
│   ├── serve-rightsizing.html
│   ├── serve-relocation.html
│   ├── serve-first-time-buyers.html
│   ├── serve-upmovers.html
│   ├── serve-presale-investor.html
│   │
│   ├── [Guide Pages - Educational]
│   ├── guides-probate.html
│   ├── guides-aging.html
│   ├── guides-rightsizing.html
│   ├── guides-selling.html
│   ├── guides-buying.html
│   ├── guides-relocation.html
│   │
│   ├── [Regional Pages]
│   ├── regional-fraser-valley.html
│   │
│   ├── [Utility Pages]
│   ├── partners.html
│   ├── inner-circle.html
│   ├── booking.html
│   ├── privacy-policy.html
│   │
│   └── style.css                     (Global Stylesheet)
│
└── [WORDPRESS BLOG - WP Managed]
    └── /blog/                        (WordPress Installation)
        ├── /probate/                 (Category: Probate)
        ├── /aging-in-place/          (Category: Aging)
        ├── /rightsizing/             (Category: Rightsizing)
        ├── /first-time-buyers/       (Category: First-Time Buyers)
        ├── /market-insights/         (Category: Market Intelligence)
        ├── /policy-updates/          (Category: Policy Changes)
        └── /family-housing/          (Category: Multi-Gen/Sandwich)
```

---

## Technical Implementation

### Static HTML Pages (VS Code)

**Hosting**: Direct file hosting (GitHub Pages, Netlify, or traditional hosting)

**Advantages**:

- Load time: <0.5 seconds
- No database queries
- Full design control
- Version control via Git
- Zero CMS overhead

**Management**:

- Edit directly in VS Code
- Deploy via Git push or FTP
- No plugins or updates required

**Use Cases**:

- High-traffic pages (homepage, service pages)
- Interactive tools (assessment)
- Landing pages for campaigns
- Pages requiring custom functionality

---

### WordPress Blog (/blog/)

**Installation**: Subdirectory installation at `/blog/`

**URL Structure**: `homepathways.ca/blog/post-slug/`

**Advantages**:

- Easy content creation and editing
- SEO plugins (Yoast, Rank Math)
- REST API for automation
- Media management
- Comment system (if desired)
- Editorial workflow

**Management**:

- Ghostwriter Agent creates drafts via REST API
- Human review and publish in WP admin
- Categories align with 12 personas
- Tags for cross-referencing

**Required Plugins**:

- Yoast SEO or Rank Math (Schema markup)
- Application Passwords (REST API authentication)
- Classic Editor or Gutenberg (preference)
- Wordfence or similar (security)

---

## Schema.org Implementation

### Purpose: Answer Engine Optimization (AEO)

Schema markup helps search engines and AI answer engines (Google SGE, Bing Chat, ChatGPT) understand and feature your content in:

- Featured snippets
- Knowledge panels
- AI-generated answers
- Voice search results
- Rich results

---

### Schema Type 1: RealEstateAgent (Organization/Person)

**Implementation**: Every page (global in `<head>`)

**Purpose**: Establish entity authority, local SEO, knowledge graph

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "HomePathways",
  "alternateName": "HomePathways Real Estate",
  "url": "https://homepathways.ca",
  "logo": "https://homepathways.ca/images/logo.png",
  "image": "https://homepathways.ca/images/team-photo.jpg",
  "description": "BC real estate specialists serving families through probate, aging transitions, rightsizing, and multi-generational housing solutions.",

  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Your Street Address]",
    "addressLocality": "[City]",
    "addressRegion": "BC",
    "postalCode": "[Postal Code]",
    "addressCountry": "CA"
  },

  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[Latitude]",
    "longitude": "[Longitude]"
  },

  "areaServed": [
    {
      "@type": "City",
      "name": "Vancouver",
      "sameAs": "https://en.wikipedia.org/wiki/Vancouver"
    },
    {
      "@type": "City",
      "name": "Surrey",
      "sameAs": "https://en.wikipedia.org/wiki/Surrey,_British_Columbia"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Fraser Valley",
      "sameAs": "https://en.wikipedia.org/wiki/Fraser_Valley"
    }
  ],

  "telephone": "+1-XXX-XXX-XXXX",
  "email": "info@homepathways.ca",

  "priceRange": "$$",

  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],

  "sameAs": [
    "https://www.facebook.com/homepathways",
    "https://www.linkedin.com/company/homepathways",
    "https://www.instagram.com/homepathways"
  ],

  "knowsAbout": [
    "Probate Real Estate",
    "Estate Sales",
    "Senior Housing Transitions",
    "Rightsizing",
    "Multi-Generational Housing",
    "First-Time Home Buyers",
    "BC Property Tax Deferral",
    "Secondary Suite Financing"
  ],

  "memberOf": {
    "@type": "Organization",
    "name": "Real Estate Board of Greater Vancouver",
    "sameAs": "https://www.rebgv.org"
  }
}
</script>
```

**Key Fields for AEO**:

- `knowsAbout`: Establishes topical authority
- `areaServed`: Geographic relevance
- `description`: Entity understanding
- `sameAs`: Entity verification across web

---

### Schema Type 2: BlogPosting (Blog Articles)

**Implementation**: Every blog post (WordPress template or Yoast/Rank Math)

**Purpose**: Article rich results, featured snippets, news carousel

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post Title - Max 110 characters]",
  "alternativeHeadline": "[Subheadline if applicable]",
  "image": {
    "@type": "ImageObject",
    "url": "https://homepathways.ca/blog/images/featured-image.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "url": "https://homepathways.ca/about.html",
    "sameAs": [
      "https://www.linkedin.com/in/authorprofile"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "HomePathways",
    "logo": {
      "@type": "ImageObject",
      "url": "https://homepathways.ca/images/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": "2026-02-26T09:00:00-08:00",
  "dateModified": "2026-02-26T09:00:00-08:00",
  "description": "[Meta description - 150-160 characters]",
  "articleBody": "[First 200 words of article for context]",

  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://homepathways.ca/blog/post-slug/"
  },

  "keywords": [
    "probate real estate BC",
    "227-day probate backlog",
    "estate property sale",
    "executor responsibilities"
  ],

  "articleSection": "Probate",

  "wordCount": 1200,

  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-intro", ".key-takeaways"]
  },

  "about": {
    "@type": "Thing",
    "name": "Probate Real Estate Process",
    "sameAs": "https://en.wikipedia.org/wiki/Probate"
  },

  "mentions": [
    {
      "@type": "GovernmentOrganization",
      "name": "BC Supreme Court",
      "sameAs": "https://www.bccourts.ca/supreme_court/"
    }
  ]
}
</script>
```

**Key Fields for AEO**:

- `speakable`: Voice search optimization
- `about`: Topic entity linking
- `mentions`: Authority signals
- `keywords`: Semantic relevance
- `articleBody`: Context for AI understanding

---

### Schema Type 3: FAQPage (Guide Pages)

**Implementation**: Guide pages with Q&A sections

**Purpose**: Featured snippet capture, "People Also Ask" boxes

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does probate take in BC in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The BC Supreme Court probate process currently averages 227 days from application to grant. This timeline includes document preparation, court filing, waiting period for creditor claims, and final grant issuance."
      }
    },
    {
      "@type": "Question",
      "name": "What is the BC Property Tax Deferral rate for 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The BC Property Tax Deferral Program charges 6.45% simple interest (compounding annually) for eligible seniors 55+ and families with children. This is significantly lower than reverse mortgage rates of 8-12%."
      }
    },
    {
      "@type": "Question",
      "name": "What is the CMHC Secondary Suite Loan rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The CMHC Secondary Suite Loan Program offers 2% fixed interest for adding legal secondary suites to existing homes, enabling multi-generational housing solutions and rental income strategies."
      }
    }
  ]
}
</script>
```

**Best Practices**:

- 3-10 questions per page
- Questions match natural language queries
- Answers are 40-300 words (concise but complete)
- Include key statistics and data points

---

### Schema Type 4: HowTo (Process/Guide Content)

**Implementation**: Step-by-step guides

**Purpose**: Featured snippets, Google Assistant actions

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Navigate the BC Probate Process as an Executor",
  "description": "A comprehensive guide for executors managing real estate through BC's 227-day probate process.",
  "image": "https://homepathways.ca/images/probate-process-guide.jpg",
  "totalTime": "PT227D",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "CAD",
    "value": "2000-5000"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Locate the Will and Secure the Property",
      "text": "Obtain the original will, change locks on the property, notify insurance company, and begin documenting all estate assets.",
      "url": "https://homepathways.ca/guides-probate.html#step-1"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Apply for Probate Grant",
      "text": "File Form P2 with BC Supreme Court along with original will, death certificate, and estate inventory. Current processing time: 227 days.",
      "url": "https://homepathways.ca/guides-probate.html#step-2"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Maintain Property During Probate",
      "text": "Pay property taxes, insurance, utilities, and maintenance costs from estate funds. Consider bridge financing if estate is cash-poor.",
      "url": "https://homepathways.ca/guides-probate.html#step-3"
    }
  ]
}
</script>
```

---

### Schema Type 5: Service (Service Pages)

**Implementation**: Persona-specific service pages

**Purpose**: Local service rich results, service schema

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Probate Real Estate Services",
  "provider": {
    "@type": "RealEstateAgent",
    "name": "HomePathways"
  },
  "areaServed": {
    "@type": "State",
    "name": "British Columbia"
  },
  "description": "Specialized real estate services for executors managing probate properties, including estate valuation, property preparation, and strategic sale timing to maximize estate value.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "priceCurrency": "CAD",
      "price": "0",
      "description": "Free initial consultation"
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Probate Real Estate Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Estate Property Valuation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Probate Property Preparation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Estate Sale Management"
        }
      }
    ]
  }
}
</script>
```

---

## Schema Implementation Checklist

### Global Schema (All Pages)

- [ ] RealEstateAgent schema in global header
- [ ] BreadcrumbList schema for navigation
- [ ] WebSite schema with site search potential action
- [ ] Organization schema with contact points

### Page-Specific Schema

- [ ] **Homepage**: RealEstateAgent + WebSite + Organization
- [ ] **Service Pages**: Service + RealEstateAgent
- [ ] **Guide Pages**: FAQPage + HowTo (where applicable)
- [ ] **Blog Posts**: BlogPosting + BreadcrumbList
- [ ] **Assessment Tool**: WebApplication + SoftwareApplication
- [ ] **About Page**: Person (for team members) + Organization

---

## WordPress-to-Static Integration

### Blog Feed on Homepage

**Method**: JavaScript fetch from WordPress REST API

```html
<!-- On index.html -->
<section id="latest-insights">
  <h2>Latest Market Insights</h2>
  <div id="blog-feed"></div>
</section>

<script>
  // Fetch latest 3 posts from WordPress
  fetch("https://homepathways.ca/blog/wp-json/wp/v2/posts?per_page=3&_embed")
    .then((response) => response.json())
    .then((posts) => {
      const feedContainer = document.getElementById("blog-feed");
      posts.forEach((post) => {
        const article = `
        <article class="blog-preview">
          <img src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="${post.title.rendered}">
          <h3><a href="${post.link}">${post.title.rendered}</a></h3>
          <p>${post.excerpt.rendered}</p>
          <a href="${post.link}" class="read-more">Read More →</a>
        </article>
      `;
        feedContainer.innerHTML += article;
      });
    });
</script>
```

### Navigation Integration

**Static HTML Navigation** includes blog link:

```html
<nav>
  <ul>
    <li><a href="/index.html">Home</a></li>
    <li><a href="/pathway.html">Pathways</a></li>
    <li><a href="/assessment.html">Assessment</a></li>
    <li><a href="/blog/">Insights</a></li>
    <li><a href="/about.html">About</a></li>
    <li><a href="/booking.html" class="cta-button">Book Consultation</a></li>
  </ul>
</nav>
```

**WordPress Navigation** mirrors static structure (custom menu)

### Branding Consistency

- **WordPress Theme**: Custom theme matching static HTML design
- **CSS**: Import main `style.css` from root into WordPress theme
- **Header/Footer**: Replicate exactly in WordPress theme templates
- **Fonts**: Same Google Fonts or hosted fonts
- **Colors**: CSS variables for consistency

---

## SEO & AEO Strategy

### Answer Engine Optimization (AEO) Priorities

**1. Entity Establishment**

- Consistent NAP (Name, Address, Phone) across all pages
- Schema markup on every page
- Wikipedia/Wikidata entity creation (if eligible)
- Google Business Profile optimization

**2. Topical Authority**

- Comprehensive content clusters around 12 personas
- Internal linking between static pages and blog posts
- `knowsAbout` schema covering all expertise areas
- Regular content updates (weekly blog posts)

**3. Featured Snippet Optimization**

- FAQ schema on guide pages
- HowTo schema for process content
- Concise answers to common questions (40-60 words)
- Structured data for key statistics (227 days, 6.45%, 2%)

**4. Voice Search Optimization**

- Natural language question formats
- Speakable schema on blog posts
- Local intent optimization ("probate real estate near me")
- Conversational content tone

**5. AI Training Data Quality**

- Accurate, cited statistics
- Clear, authoritative content
- Proper entity linking (sameAs properties)
- Structured, scannable content format

---

## Performance Optimization

### Static HTML Pages

**Target Metrics**:

- Load time: <0.5 seconds
- First Contentful Paint: <0.3 seconds
- Largest Contentful Paint: <0.8 seconds
- Cumulative Layout Shift: <0.1

**Optimization Techniques**:

- Minified CSS/JS
- Optimized images (WebP format, lazy loading)
- Critical CSS inline
- Deferred JavaScript
- CDN for static assets

### WordPress Blog

**Target Metrics**:

- Load time: <2 seconds
- First Contentful Paint: <1 second
- Largest Contentful Paint: <2.5 seconds

**Optimization Techniques**:

- Caching plugin (WP Rocket, W3 Total Cache)
- Image optimization plugin (ShortPixel, Imagify)
- Lazy loading
- Minimal plugins (quality over quantity)
- CDN integration

---

## Analytics & Tracking

### Unified Tracking

**Google Analytics 4**: Single property tracking both static and WordPress

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

**Event Tracking**:

- Assessment tool starts/completions
- Blog post engagement (scroll depth, time on page)
- CTA clicks (booking, downloads)
- Form submissions
- Phone number clicks

### Search Console

- Verify both root domain and `/blog/` subdirectory
- Submit XML sitemaps for both static and WordPress
- Monitor rich result performance
- Track featured snippet captures

---

## Maintenance Schedule

### Daily

- Monitor WordPress for security updates
- Check blog post publication (if scheduled)

### Weekly

- Review analytics for both static and blog
- Check for broken links
- Monitor site speed

### Monthly

- Update Schema markup if data changes (stats, programs)
- Review and update FAQ content
- Audit internal linking
- Check mobile usability

### Quarterly

- Comprehensive SEO audit
- Schema validation (Google Rich Results Test)
- Performance optimization review
- Content refresh for top pages

---

**Last Updated**: February 2026  
**Review Cycle**: Quarterly (architecture) / Monthly (schema accuracy)  
**Owner**: Web Architecture Division
