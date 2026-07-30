---
name: Technical Requirements Document — Template
description: Reusable template for authoring a TRD as a prerequisite input to /dare-to-rise-code-plan. Defines what the system must do technically — functional requirements, non-functional requirements, integration, data, technical constraints. Filled-in instances feed into Stage 00 research.
type: template
skill: dare-to-rise-code-plan
version: v01_I
date: 2026-04-17
---

# Technical Requirements Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_TRD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

The TRD is downstream of the PRD and upstream of the D2R code plan. The PRD says what the product IS. The TRD says what the system MUST DO technically. The D2R code plan says HOW it will be built.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run. An incomplete TRD produces degraded Stage 00 research because the research cannot scope itself against requirements that don't exist.

Every section has instructions (italic) and a placeholder format. Replace instructions with the filled-in content. Keep the section headers.

---

## 1. Document Identity

### 1.1 Project Name And Version

_State the project name (matching the PRD). State the version this TRD applies to (matching the PRD version)._

### 1.2 PRD Reference

_Cite the PRD this TRD is downstream of. Include file path or URL._

### 1.3 Revision History

_Track revisions to this document. Required fields per revision:_

- _Version_
- _Date_
- _Changes summary_
- _Reviewer name_

---

## 2. Functional Requirements

### 2.1 Core Functional Requirements

_What the system must do. Stated in testable terms. Each requirement should be concrete enough that a test can be written against it._

_Required format per requirement:_

- _Requirement ID (FR-NN)_
- _Statement: "The system MUST [verb] [object] [under conditions]."_
- _Rationale: why this requirement exists (trace to PRD if possible)_
- _Acceptance criteria: specific measurable conditions that indicate the requirement is met_
- _Priority: Must-Have / Should-Have / Could-Have / Won't-Have-This-Version (MoSCoW)_

### 2.2 User-Facing Behavior Requirements

_How the system behaves from the user's perspective. Can restate PRD user journeys in technical terms or add behaviors the PRD didn't specify._

_Required format per behavior:_

- _Behavior ID (BR-NN)_
- _Description_
- _Input/trigger_
- _Expected output/response_
- _Timing expectation (synchronous, async with max latency, etc.)_

### 2.3 System-Facing Behavior Requirements

_How the system behaves internally — background jobs, scheduled tasks, event processing, data transformations not directly user-visible._

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

_Specific performance targets. Not "fast" — specific numbers._

_Required fields:_

- _Response time: p50, p95, p99 targets for user-facing operations_
- _Throughput: requests/second or operations/minute at target load_
- _Data volume: expected max size of inputs, outputs, stored data_
- _Concurrent usage: how many simultaneous users/sessions supported_
- _Degradation behavior: what happens beyond targets (graceful slowdown vs hard refusal)_

### 3.2 Reliability Requirements

_Required fields:_

- _Uptime target (% availability)_
- _MTBF (mean time between failures) target_
- _Recovery time objective (RTO) — max time to recover from failure_
- _Recovery point objective (RPO) — max acceptable data loss window_
- _Failure modes explicitly tolerated vs prohibited_

### 3.3 Security Requirements

_Required fields:_

- _Authentication mechanism (if applicable)_
- _Authorization model (if applicable)_
- _Data in transit encryption_
- _Data at rest encryption_
- _Secret management approach_
- _Audit logging requirements_
- _Applicable security standards (OWASP Top 10, OWASP LLM Top 10 if LLM-integrated, CERT secure coding for language)_
- _Threat model summary or reference_

### 3.4 Privacy Requirements

_Required fields:_

- _Personal data collected/processed (categories)_
- _Applicable privacy regulations (GDPR, CCPA, COPPA, FERPA, etc.)_
- _Data minimization posture_
- _Retention policy_
- _User data rights supported (access, deletion, portability, correction)_
- _Cross-border data transfer handling_

### 3.5 Accessibility Requirements

_WCAG 2.1 AA is hardwired — not an optional requirement to negotiate. If additional standards apply (AAA where relevant, Section 508, EN 301 549 for EU, ARIA Authoring Practices for specific widgets), specify them._

_Required fields:_

- _Target compliance level (WCAG 2.1 AA minimum)_
- _Additional standards if any_
- _Keyboard navigation completeness target_
- _Screen reader compatibility targets (specific SR/browser combinations tested)_
- _Color contrast floors_
- _Motion/animation requirements (prefers-reduced-motion support)_
- _Automated testing tool (axe-core is default)_
- _Manual testing protocol (NVDA/JAWS/VoiceOver + keyboard-only)_

### 3.6 Maintainability Requirements

_Required fields:_

- _Expected lifespan of the codebase (months/years before planned deprecation)_
- _Team size that will maintain (solo / small / large)_
- _Code quality gates (cyclomatic complexity floor, coverage floor, linting rules)_
- _Documentation quality floor (every module documented, etc.)_

### 3.7 Portability Requirements

_Required fields:_

- _Target platforms (web browsers + versions, operating systems, mobile, etc.)_
- _Target runtime environments_
- _Deployment targets (cloud providers, on-prem, local-only)_
- _Binary size / bundle size constraints if any_

### 3.8 Observability Requirements

_If the system will be operated in production:_

- _Logging requirements (what gets logged, at what level, in what format)_
- _Metrics requirements (what's measured, what's reported)_
- _Tracing requirements (distributed tracing if applicable)_
- _Alerting requirements (thresholds, escalation paths)_

---

## 4. Integration Requirements

### 4.1 External Systems

_Every external service, API, or system the project integrates with. Required per integration:_

- _System name_
- _Integration purpose_
- _API or protocol used_
- _Data exchange patterns (sync/async, push/pull)_
- _Authentication / authorization for the integration_
- _Rate limits / quotas_
- _Fallback behavior if the integration is unavailable_

### 4.2 Internal Systems (If Applicable)

_Other internal systems or components this project integrates with._

### 4.3 Data Sources

_Every data source consumed. Required per source:_

- _Source name_
- _Update frequency_
- _Data format and schema_
- _Authority/ownership_
- _Staleness tolerance_
- _Licensing and terms of use_

---

## 5. Data Requirements

### 5.1 Data Entities And Schema

_Major data entities the system works with. Schema for each. Can reference external schema files._

### 5.2 Data Volume Expectations

_Required fields:_

- _Expected record counts (per entity)_
- _Expected data growth rate_
- _Peak data volumes (if burst patterns apply)_
- _Data retention timeline_

### 5.3 Data Sensitivity Classification

_Required fields:_

- _Sensitivity classification per entity (public / internal / confidential / restricted)_
- _Handling rules per classification_
- _Data subject to regulatory requirements flagged with applicable regulation_

### 5.4 Data Validation Requirements

_Required fields:_

- _Input validation rules_
- _Schema validation approach (Zod, Pydantic, JSON Schema, etc.)_
- _Invalid data handling (reject / quarantine / sanitize)_

---

## 6. Technical Constraints

### 6.1 Mandatory Technology Choices

_Technologies that MUST be used. Includes:_

- _Languages (if constrained)_
- _Frameworks (if constrained)_
- _Deployment targets (if constrained)_
- _Integration requirements that constrain the stack (e.g., "must use SDK X")_

_If no mandatory technology choices exist, write "None — Stage 00 research selects the stack on best-fit grounds."_

### 6.2 Prohibited Technology Choices

_Technologies that MUST NOT be used, with reasons. Can be for licensing, security, organizational policy, or principled reasons._

### 6.3 Platform Target

_Required:_

- _Platform(s) the product runs on (web / desktop / CLI / mobile / SDK / plugin form / etc.)_
- _Rationale for platform choice (from PRD or Stage 00 research)_

### 6.4 Hook Orchestration Requirements (D2R-Specific)

_The D2R skill requires hook orchestration at three layers (Claude Code hooks, git hooks, ASAE gate). This section specifies:_

- _Claude Code hooks the project requires installed in its `.claude/settings.json`_
- _Git hooks the project requires in `.githooks/`_
- _ASAE gate thresholds per stage type (default 2 for Stage 00, 3 for implementation, 5 for Stage QA)_
- _Any project-specific hook behavior_

### 6.5 Skill / Plugin Ecosystem Requirements

_Which skills or Claude Code plugins MUST be available during the build. Which skills or plugins would be beneficial but are not required. Which are explicitly excluded (if any, with reason)._

---

## 7. Assumptions And Dependencies

### 7.1 Technical Assumptions

_What is assumed to be true in the technical environment. Each assumption should be testable or have a fallback plan._

### 7.2 External Dependencies

_Dependencies on external services, data sources, or organizational decisions that must exist or be made for this project to proceed._

### 7.3 Timing Dependencies

_If certain other projects or decisions must complete before this can proceed._

---

## 8. Out Of Scope (Technical)

_Technical work explicitly deferred. Each item should have a rationale and, if applicable, a version/milestone for revisiting._

---

## 9. Open Technical Questions

_Unresolved technical decisions. Stage 00 research should address these or the TRD must be updated with resolutions before Stage 01._

---

## 10. Stakeholder Approvals

_Who has approved this TRD? Without documented approval, Stage 00 should not begin._

_Required format per stakeholder:_

- _Stakeholder name and role_
- _Approval date_
- _Approval notes (any conditions or flags)_

---

## Validation Checklist (Pre-Stage-00)

Before invoking `/dare-to-rise-code-plan`, verify:

- [ ] All required sections completed
- [ ] NA sections have one-line justifications
- [ ] Functional requirements stated in testable terms with acceptance criteria
- [ ] Non-functional requirements have specific numbers (not "fast", "secure", "reliable")
- [ ] WCAG 2.1 AA minimum accessibility declared; any additional standards specified
- [ ] Security requirements include applicable standards (OWASP, CERT, etc.)
- [ ] Privacy requirements address applicable regulations or explicitly justify NA
- [ ] Integration requirements complete for every external system
- [ ] Data sensitivity classification assigned to all major entities
- [ ] Technical constraints explicit; platform target declared
- [ ] Hook orchestration requirements specified (D2R prerequisite)
- [ ] Skill/plugin ecosystem requirements specified (D2R prerequisite)
- [ ] Assumptions documented with fallback plans
- [ ] Out-of-scope items named
- [ ] Stakeholder approval documented

A TRD missing any of these is not ready for D2R.

---

## Companion Documents

This TRD is one of three prerequisite inputs to `/dare-to-rise-code-plan`. The other two:

- **PRD (Product Requirements Document)** — what the product IS (must exist first)
- **TQCD (Testing & Quality Criteria Document)** — what success looks like quality-wise

See template files in the same `references/` directory.

## Downstream Use

This TRD feeds directly into:

- **Stage 00 Track 1:** Tech stack research scopes against the TRD's functional + non-functional + integration requirements
- **Stage 00 Track 2:** Applicable standards research scopes against the TRD's security, privacy, accessibility, performance requirements
- **Stage 00 Track 3:** Applicable benchmarks research scopes against the TRD's performance and maintainability targets
- **Stage 00 Track 4:** Language-depth-of-spec research scopes against the platform target and mandatory technology choices
- **Stage 00 Track 5:** Skill/plugin ecosystem research scopes against the skill/plugin requirements
- **Stage 01:** The authored D2R code plan is backwards-planned from the TRD's functional requirements + non-functional requirements + TQCD acceptance criteria
