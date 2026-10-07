# 🎓 Course Rec Assistant — Study Abroad Counselor Copilot

> An AI-powered, real-time study abroad course recommendation platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Google Gemini Grounding RAG**.

---

## 📽️ Video Walkthrough

> **Watch the product demonstration and technical overview:**  
https://drive.google.com/drive/folders/1J1-vYxWOWmHoGPJ3oWGHDcJ_GSUTITwP?usp=sharing

---

## 🚀 Quick Run Instructions

### Prerequisites
- **Node.js**: v18.x or higher (Tested on Node v23.11)
- **npm**: v9.x or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/course-recommendation-assistant.git
cd course-recommendation-assistant
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Optional: Enables live Google Search Grounding RAG via Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Enables Tavily Web Search API fallback
TAVILY_API_KEY=your_tavily_api_key_here
```
*(Note: If no API keys are supplied, the application automatically defaults to the built-in multi-country fallback dataset).*

### 3. Run Development Server
```bash
# If running with increased heap memory (recommended)
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run dev   # Windows PowerShell
# OR
NODE_OPTIONS="--max-old-space-size=4096" npm run dev         # macOS/Linux
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📑 Short Write-Up & Architectural Overview

### 🧠 1. Recommendation Approach
The Course Rec Assistant employs a **Hybrid Grounded RAG (Retrieval-Augmented Generation)** architecture designed specifically for educational counseling:
1. **Dynamic Search Query Generation**: Analyzes student profile parameters (Target Major, GPA, IELTS, Budget, Countries) to synthesize localized Google Search queries for intake cycles (2027/2028).
2. **Google Search Grounding & Web Search Retrieval**: Calls Gemini Models with native web search grounding to fetch current program fees, intakes, entry criteria, and campus locations.
3. **High-Precision Multi-Country Fallback**: In the absence of an API key or network connectivity, the app seamlessly falls back to an internal multi-country university matrix covering Ireland, UK, USA, Canada, Australia, and Germany.
4. **ROI & Payback Metric Calculation**: Automatically computes estimated post-grad starting salary and financial payback period (years) based on target major and regional labor data.
5. **Real-time Server-Sent Events (SSE)**: Streams step-by-step pipeline status updates to the UI, offering full visibility into the AI's search & filtering logic.

---

### 🎨 2. Interface Design Strategy
Designed as a **Counselor Copilot Interface** tailored for study abroad advisors during live client consultations:
- **Dual-Pane Workstation Layout**: Keeps student profile input on the left and live recommendation streams on the right.
- **Interactive Assumption Pills**: Displays critical assumptions (e.g. Budget caps, min IELTS) at the top of the interface with click-to-edit inline modals for instantaneous profile adjustments.

---

### 🔥 3. Three Key Feature Decisions

| Feature Decision | Rationale & User Benefit |
| :--- | :--- |
| **1. Tiered Admission Probability (`Reach` / `Moderate` / `Safe`)** | Categorizes programs dynamically into balanced tiers based on student GPA & IELTS relative to university admission benchmarks. Allows counselors to present realistic portfolio strategies. |
| **2. Active Assumption Pills & Recalculation Engine** | Allows counselors to tweak assumptions (e.g. raising IELTS score or changing budget) on-the-fly and recalculate recommendations without retyping the entire form. |
| **3. 3-Way Side-by-Side Course Comparison Matrix** | Enables students and counselors to select up to 3 course options and inspect side-by-side cost breakdown, admission requirements, living expenses, and estimated payback ROI. |

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Animations**: Framer Motion
- **AI/LLM Engine**: Google Gemini API (`@ai-sdk/google`, `@ai-sdk/openai`), Native REST Fetch with fallback schema validation.
