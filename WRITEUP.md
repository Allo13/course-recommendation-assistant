# 📝 Project Submission & Recommendation System Write-Up

**Project Title:** Course Rec Assistant — Study Abroad Counselor Copilot  
**Repository Path:** `d:\Alroy\Course Recommendation`  
**Application URL:** [http://localhost:3000](http://localhost:3000)

---

## 1. Deliverables Checklist

- [x] **Working Application**: Running locally at `http://localhost:3000`. Detailed setup instructions provided in `README.md`.
- [x] **Source Code**: Clean TypeScript, Next.js 14 App Router, and Tailwind CSS codebase.
- [x] **Short Write-up**: Detailed explanation of recommendation approach, interface design, and three feature decisions (below).
- [x] **Video Walkthrough**: Link placeholder embedded in `README.md`.

---

## 2. Recommendation Approach

The core objective of the Course Rec Assistant is to deliver **verified, hyper-personalized, multi-country university course recommendations** for upcoming intake cycles (2027 / 2028). 

### Architectural Workflow:
1. **Profile Synthesis & Parameter Normalization**:
   The system ingests the student's profile (GPA, IELTS score, target countries, preferred major, budget, work experience). It resolves target countries into normalized lists (e.g., Ireland, UK, USA, Canada, Australia, Germany).

2. **Query Expansion & Retrieval (RAG Pipeline)**:
   The RAG pipeline generates multi-layered search queries targeting intake cycles, tuition fees, eligibility thresholds, and living costs. 

3. **Google Search Grounding via Gemini**:
   Using Gemini API with search grounding, the model queries real-time web results to retrieve live degree programs, campus locations, current tuition fees, and admission criteria.

4. **Multi-Country Database Fallback**:
   To guarantee reliability even when external API keys are unavailable or limited, the app incorporates a curated fallback database (`ragPipeline.ts`) covering top universities across Ireland, UK, USA, Canada, Australia, and Germany.

5. **Financial ROI & Payback Estimation**:
   Using localized salary dataset projections (`salaryData.ts`), the system estimates post-graduation starting salaries for specific major/country pairs and calculates the projected payback period in years:
   $$\text{Payback Period (Years)} = \frac{\text{Annual Tuition} + \text{Living Cost}}{0.4 \times \text{Estimated Starting Salary}}$$

---

## 3. Interface Design Strategy

The user interface is engineered as a **Counselor Copilot Workstation**:
- **Dual-Column Ergonomics**: Keeps input parameters accessible on the left while rendering dynamic recommendation cards on the right.
- **Compact Dock Mode (`380px`)**: A custom layout toggle collapses the app into a side-panel width, allowing counselors to place the tool side-by-side with video meeting applications (Google Meet / Zoom) during live student consultations.
- **Live SSE Status Visualizer**: Provides step-by-step progress indicators while streaming recommendation data.

---

## 4. Three Key Feature Decisions

### Feature 1: Tiered Admission Categorization (`Reach`, `Moderate`, `Safe`)
* **Decision**: Automatically classify recommendations into three admission risk tiers.
* **Rationale**: Admissions counselors need to guide students toward a balanced application strategy (e.g. 3 Reach, 4 Moderate, 3 Safe). Rather than just displaying raw scores, the assistant compares student GPA/IELTS with university minimum requirements to offer actionable portfolio distribution.

### Feature 2: Active Assumption Pills & Real-Time Recalculation
* **Decision**: Display baseline counselor assumptions as top-level interactive pills.
* **Rationale**: Counselors frequently run "what-if" scenarios (e.g., *"What if the student retakes IELTS and scores 7.5 instead of 6.5?"*). The assumption pills allow single-click parameter modification and instant pipeline recalculation without resetting the profile form.

### Feature 3: Interactive 3-Way Course Comparison Matrix
* **Decision**: Provide a modal comparison view for up to 3 selected courses.
* **Rationale**: Students struggle to compare multi-country options across different currencies and cost-of-living standards. The comparison matrix standardizes tuition, living costs, entry thresholds, and ROI metrics into a single side-by-side table.

---

## 5. Instructions to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server with expanded heap space
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run dev

# 3. Open browser
http://localhost:3000
```
