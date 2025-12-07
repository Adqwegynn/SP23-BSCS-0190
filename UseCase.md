
USE CASE DIAGRAM:


┌─────────────────────────────────────┐
                    │   HR Virtual Assistant System       │
                    │                                     │
                    │  ┌──────────────────────────────┐  │
    ┌─────────┐     │  │   Upload CV                  │  │
    │   HR    │────────│   Enter Job Description      │  │
    │Recruiter│     │  │   Analyze Match              │  │
    └─────────┘     │  │   View Results               │  │
                    │  │   Download Report            │  │
                    │  │   Reset System               │  │
                    │  └──────────────────────────────┘  │
                    │            ↓                        │
    ┌─────────┐     │  ┌──────────────────────────────┐  │
    │  Job    │────────│   Check CV Compatibility     │  │
    │ Seeker  │     │  │   Identify Skill Gaps        │  │
    └─────────┘     │  │   Get Recommendations        │  │
                    │  └──────────────────────────────┘  │
                    │            ↓                        │
    ┌─────────┐     │  ┌──────────────────────────────┐  │
    │ Hiring  │────────│   Review Match Results       │  │
    │ Manager │     │  │   Compare Candidates         │  │
    └─────────┘     │  │   Make Hiring Decision       │  │
                    │  └──────────────────────────────┘  │
                    │            ↓                        │
                    │  ┌──────────────────────────────┐  │
                    │  │   PDF/Word Text Extraction   │  │
                    │  │   Skills Detection Engine    │  │
                    │  │   Match Scoring Algorithm    │  │
                    │  │   Report Generation          │  │
                    │  └──────────────────────────────┘  │
                    │                                     │
                    └─────────────────────────────────────┘


High-Level System Design:
System Architecture

┌─────────────────────────────────────────────────────────────┐
│                         USER LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐             │
│  │    HR    │  │   Job    │  │    Hiring     │             │
│  │Recruiter │  │  Seeker  │  │   Manager     │             │
│  └────┬─────┘  └────┬─────┘  └───────┬───────┘             │
│       │             │                 │                     │
└───────┼─────────────┼─────────────────┼─────────────────────┘
        │             │                 │
        └─────────────┼─────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│                      (index.html)                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • Input Forms (Job Title, Description)            │    │
│  │  • File Upload Area (Drag & Drop)                  │    │
│  │  • Privacy Notice Popup                            │    │
│  │  • Loading Indicator                               │    │
│  │  • Results Display (Charts, Tags, Cards)           │    │
│  │  • Action Buttons (Analyze, Download, Reset)       │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                   │
│                        (app.js)                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  SECURITY MODULE                                    │    │
│  │  • File validation (type, size, extension)         │    │
│  │  • Input sanitization (XSS protection)             │    │
│  │  • Privacy consent management                      │    │
│  │  • Auto-cleanup timer (5 min)                      │    │
│  │  • Session ID generation                           │    │
│  └────────────────────────────────────────────────────┘    │
│                            ↓                                │
│  ┌────────────────────────────────────────────────────┐    │
│  │  FILE PROCESSING MODULE                             │    │
│  │  • PDF text extraction (PDF.js)                    │    │
│  │  • Word text extraction (Mammoth.js)               │    │
│  │  • Text sanitization                               │    │
│  └────────────────────────────────────────────────────┘    │
│                            ↓                                │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ANALYSIS ENGINE                                    │    │
│  │  • Skills extraction (200+ skills database)        │    │
│  │  • Keyword matching algorithm                      │    │
│  │  • Experience extraction (regex patterns)          │    │
│  │  • Qualifications detection                        │    │
│  │  • Match score calculation (weighted algorithm)    │    │
│  │  • Level determination (High/Medium/Low)           │    │
│  └────────────────────────────────────────────────────┘    │
│                            ↓                                │
│  ┌────────────────────────────────────────────────────┐    │
│  │  REPORT GENERATION MODULE                           │    │
│  │  • Results formatting                              │    │
│  │  • Recommendations generation                      │    │
│  │  • Text report creation                            │    │
│  │  • Download handling                               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│                  (Browser Memory Only)                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │  SESSION STORAGE (Temporary)                       │    │
│  │  • Privacy consent flag                            │    │
│  │  • Current file object                             │    │
│  │  • Analysis results                                │    │
│  │  • Session ID                                      │    │
│  │  • Auto-cleared on close/refresh                   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL LIBRARIES (CDN)                  │
│  • PDF.js (PDF processing)                                 │
│  • Mammoth.js (Word processing)                            │
│  • No external APIs or servers                             │
└─────────────────────────────────────────────────────────────┘


Data Flow Diagram:
Main Process Flow

START
  ↓
┌─────────────────────────┐
│  1. USER INPUT          │
│  • Job Title            │
│  • Job Description      │
│  • CV File Upload       │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  2. VALIDATION          │
│  • File type check      │
│  • File size check      │
│  • Extension check      │
│  • Input sanitization   │
└───────────┬─────────────┘
            ↓
      [Valid?]───No───→ Show Error Alert ──→ Return to Input
            │
           Yes
            ↓
┌─────────────────────────┐
│  3. FILE PROCESSING     │
│  • Read file bytes      │
│  • Extract text         │
│    - PDF → PDF.js       │
│    - Word → Mammoth.js  │
│  • Sanitize text        │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  4. TEXT ANALYSIS       │
│  • Extract CV skills    │
│  • Extract JD skills    │
│  • Extract experience   │
│  • Extract education    │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  5. MATCHING ALGORITHM  │
│  A. Skills Match (60%)  │
│     - Compare CV & JD   │
│     - Count matches     │
│  B. Experience (25%)    │
│     - Years comparison  │
│  C. Education (15%)     │
│     - Degree matching   │
│  Total Score = A+B+C    │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  6. LEVEL DETERMINATION │
│  If Score >= 71: HIGH   │
│  If Score >= 41: MEDIUM │
│  If Score < 41: LOW     │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  7. GENERATE INSIGHTS   │
│  • Matched skills list  │
│  • Missing skills list  │
│  • Gap analysis         │
│  • Recommendations      │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  8. DISPLAY RESULTS     │
│  • Match percentage     │
│  • Color-coded level    │
│  • Skills breakdown     │
│  • Experience details   │
│  • HR recommendations   │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  9. USER ACTIONS        │
│  • View results         │
│  • Download report      │
│  • Analyze another      │
│  • Reset system         │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  10. AUTO-CLEANUP       │
│  • 5-minute timer       │
│  • Clear file data      │
│  • Clear results        │
│  • Protect privacy      │
└───────────┬─────────────┘
            ↓
          END



Detailed Scoring Algorithm:
Match Score Calculation

TOTAL SCORE (100 points) = Skills Match + Experience + Education

┌──────────────────────────────────────────────────────────┐
│  COMPONENT 1: SKILLS MATCH (60 points maximum)           │
├──────────────────────────────────────────────────────────┤
│  Formula:                                                │
│    Score = (Matched Skills / Required Skills) × 60      │
│                                                          │
│  Example:                                                │
│    Required Skills (JD): 10 skills                       │
│    Matched Skills (CV): 7 skills                         │
│    Score = (7/10) × 60 = 42 points                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  COMPONENT 2: EXPERIENCE MATCH (25 points maximum)       │
├──────────────────────────────────────────────────────────┤
│  Formula:                                                │
│    If JD specifies years:                                │
│      Score = min(CV Years / JD Years, 1) × 25           │
│    If JD doesn't specify:                                │
│      Score = 15 (if CV has any experience)              │
│                                                          │
│  Example:                                                │
│    Required: 5 years                                     │
│    Candidate: 4 years                                    │
│    Score = (4/5) × 25 = 20 points                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  COMPONENT 3: EDUCATION MATCH (15 points maximum)        │
├──────────────────────────────────────────────────────────┤
│  Logic:                                                  │
│    If JD requires degree AND CV has matching: 15 pts    │
│    If JD requires degree AND CV has related: 5 pts      │
│    If CV has degree (no JD requirement): 10 pts         │
│    If no degree info: 0 pts                             │
│                                                          │
│  Example:                                                │
│    JD requires: Bachelor's in CS                         │
│    CV has: Bachelor's in CS                              │
│    Score = 15 points                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  FINAL SCORE & LEVEL                                     │
├──────────────────────────────────────────────────────────┤
│  Total = Component1 + Component2 + Component3            │
│  Maximum possible score = 100                            │
│                                                          │
│  Level Assignment:                                       │
│    71-100 points = HIGH MATCH (Green)                   │
│    41-70 points  = MEDIUM MATCH (Yellow)                │
│    0-40 points   = LOW MATCH (Red)                      │
└──────────────────────────────────────────────────────────┘


Security & Privacy Flow:
┌─────────────────────────────────────────────────────────┐
│                  PRIVACY PROTECTION                     │
└─────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │   1. PRIVACY CONSENT           │
        │   • Show notice on first load  │
        │   • Explain local processing   │
        │   • Get user acceptance        │
        │   • Store in sessionStorage    │
        └────────────┬───────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   2. FILE SECURITY CHECKS      │
        │   • Type validation            │
        │   • Size limit (10MB)          │
        │   • Extension whitelist        │
        │   • Name sanitization          │
        └────────────┬───────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   3. INPUT SANITIZATION        │
        │   • Remove <script> tags       │
        │   • Remove <iframe> tags       │
        │   • Escape HTML entities       │
        │   • Remove event handlers      │
        └────────────┬───────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   4. LOCAL PROCESSING          │
        │   • All in browser memory      │
        │   • No external API calls      │
        │   • No server uploads          │
        │   • No cloud storage           │
        └────────────┬───────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   5. AUTO-CLEANUP              │
        │   • 5-minute inactivity timer  │
        │   • Clear on page refresh      │
        │   • Manual clear button        │
        │   • Session-only storage       │
        └────────────┬───────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   6. DATA DISPOSAL             │
        │   • File object deleted        │
        │   • Results cleared            │
        │   • Memory released            │
        │   • No traces left             │
        └────────────────────────────────┘


System Capabilities:
Performance Metrics

