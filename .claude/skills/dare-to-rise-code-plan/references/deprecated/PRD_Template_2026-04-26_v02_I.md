---
name: Product Requirements Document — Template
description: Reusable template for authoring a PRD as a prerequisite input to /dare-to-rise-code-plan. Defines what the product is, who it serves, what problem it solves, and what success looks like. Filled-in instances feed into Stage 00 research.
type: template
skill: dare-to-rise-code-plan
version: v02_I
date: 2026-04-26
---

# Product Requirements Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_PRD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run. Incomplete PRDs produce degraded plans.

Every section has instructions (italic) and a placeholder format. Replace instructions with the filled-in content. Keep the section headers.

---

## 1. Product Identity

### 1.1 Product Name

_State the product's name. If the product is part of a family or suite, name the family too._

### 1.2 Version

_Version this PRD applies to. Use semantic versioning (v0.1, v1.0, etc.) or a version milestone descriptor (MVP, v0.2, v1.0, etc.)._

### 1.3 One-Line Description

_State the product in a single sentence. Describe what it does in outcome terms, not implementation terms. If you can't describe the product in one sentence, the product is not ready for a PRD._

---

## 2. Users And Problem

### 2.1 Primary Users

_Who is this product for? Describe the primary user segment specifically. Not "everyone." Not "developers." Something specific enough that you could name three real people who fit the description._

_Required fields per user segment:_

- _Segment name_
- _Representative user description (role, context, constraints they operate under)_
- _What they currently do without this product_
- _What they struggle with currently_

### 2.2 Secondary Users

_Optional. If the product has additional user segments with different needs, describe them here. Mark NA if not applicable._

### 2.3 Problem Statement

_What specific problem does this product solve? Describe the problem in the users' terms, not in solution terms. Include evidence that the problem is real (user research, personal experience, documented pain points, relevant statistics)._

### 2.4 Why Now

_Why is this the right time to build this product? What has changed in the environment, technology, market, or user population that makes this solvable now when it wasn't before?_

---

## 3. Goals

### 3.1 Primary Goals

_What must the product achieve to be considered successful? Each goal must be specific and measurable. Not "users love it" — "users export reports at least twice per week in the first month."_

_Required format per goal:_

- _Goal statement_
- _Measurable criterion_
- _Timeframe to achievement_

### 3.2 Secondary Goals

_Optional. Goals that would be nice to achieve but are not required for the product to be considered successful. Mark NA if not applicable._

### 3.3 Non-Goals

_What is explicitly NOT in scope for this product, or at least not for this version? Naming non-goals prevents scope creep during Stage 01 planning and during implementation._

---

## 4. User Journeys

### 4.1 Primary User Journeys

_Walk through the key flows a user takes through the product. Each journey describes a user's goal, the steps they take, and the outcome. Describe journeys from the user's perspective, not the system's._

_Required format per journey:_

- _Journey name_
- _User goal entering the journey_
- _Step-by-step narrative (high-level, not technical)_
- _Outcome achieved_
- _Pain points this journey is designed to eliminate_

### 4.2 Edge Case Journeys

_Optional. Journeys that handle unusual situations (errors, edge cases, recovery flows). Mark NA if all recovery flows are trivial._

---

## 5. Success Criteria

### 5.1 Measurable Outcomes

_How will you know the product is working? What specific measurable outcomes would indicate success vs. failure?_

_Required format per outcome:_

- _Outcome name_
- _Metric definition_
- _Target value_
- _Measurement method_
- _Measurement frequency_

### 5.2 Qualitative Success Signals

_Optional. Qualitative signals that would indicate the product is working beyond the quantitative metrics. User testimonials, adoption patterns, organic usage behaviors._

---

## 6. Constraints

### 6.1 Business Constraints

_Budget limits, timeline requirements, resource availability, organizational constraints._

### 6.2 Regulatory Constraints

_Applicable regulations (GDPR, HIPAA, FERPA, EU AI Act, state laws, etc.). Required for products operating in regulated domains. Mark NA if not applicable (and justify)._

### 6.3 Technical Constraints

_Platforms, stacks, or technologies that MUST be used or MUST NOT be used. Includes constraints imposed by integration partners, existing infrastructure, or organizational standards. Mark NA if no binding technical constraints exist._

### 6.4 Accessibility Constraints

_WCAG 2.1 AA compliance is hardwired — not a constraint to negotiate. If additional accessibility standards apply (Section 508, EN 301 549, etc.), list them here._

### 6.5 Cost Constraints (Track 17 Applicability Gate)

_Determines whether D2R Stage 00 Track 17 (Cost Modeling & FinOps) runs for this product. Required answer (one of):_

- _"Track 17 APPLICABLE — non-trivial infrastructure spend expected at MVP or planned within first 12 months."_
  - _Expected monthly infrastructure spend ceiling at MVP: [USD]_
  - _Cost-driving components anticipated: [compute / storage / egress / third-party APIs / AI inference / etc.]_
  - _Unit-economics target if commercial: [cost per active user / per request / per transaction]_
- _"Track 17 NA — [justification]."_
  - _Valid justifications: personal/local-only app with no hosted infra; static-site product with negligible serving cost; product where infra spend is bundled into a parent product's existing budget and out-of-scope here._
  - _NA without justification is not permitted: cost is a real constraint for any production-deployable system, and silent skips produce launches with surprise infra bills._

This applicability decision feeds into TRD §3.10 (Cost Requirements). Track 17 outputs land in TRD §3.10 + TQCD §7.5 (Cost Gates).

### 6.6 Locale & Language Scope (Track 18 Applicability Gate)

_Determines whether D2R Stage 00 Track 18 (Internationalization & Localization) runs for this product. Required answer (one of):_

- _"Track 18 APPLICABLE — product targets multiple locales, non-English users, or RTL-language users."_
  - _Initial supported locales (BCP-47, e.g., `en-US`, `es-ES`, `ja-JP`): [list]_
  - _Locales planned for next 12 months: [list]_
  - _RTL support required (yes/no — `ar`, `he`, `fa`, `ur` etc.): [yes/no]_
  - _Locale-aware formatting required (date/time/number/currency): [yes/no, with detail]_
- _"Track 18 NA — [justification]."_
  - _Valid justifications: product is intentionally and durably single-locale through planned lifespan; product audience is internal-English-only and there is no realistic path to localization; product is a developer tool with English-only API/CLI surface._
  - _NA without justification is not permitted: retrofitting i18n after launch is significantly more expensive than designing for it; the decision must be explicit, not silent._

This applicability decision feeds into TRD §3.11 (Internationalization Requirements). Track 18 outputs land in TRD §3.11 + TQCD §7.6 (i18n Gates).

---

## 7. Assumptions

_What are you treating as given? Assumptions that, if wrong, would invalidate the PRD. Each assumption should be testable or have a fallback plan._

_Required format per assumption:_

- _Assumption statement_
- _Why this is treated as given_
- _What would invalidate it_
- _Fallback if invalidated_

---

## 8. Open Questions

_What decisions are not yet made? Document them here so Stage 00 research can address them or Stage 01 can flag them for user decision._

---

## 9. Out Of Scope (Deferred)

_What features or capabilities have been considered and explicitly deferred? Name each, and note the version or milestone at which they might become in-scope._

---

## 10. Stakeholder Approvals

_Who has approved this PRD? Without documented approval, Stage 00 should not begin._

_Required format per stakeholder:_

- _Stakeholder name and role_
- _Approval date_
- _Approval notes (any conditions or flags)_

---

## Validation Checklist (Pre-Stage-00)

Before invoking `/dare-to-rise-code-plan`, verify:

- [ ] All required sections completed
- [ ] NA sections have one-line justifications
- [ ] Users described specifically (not "everyone" or "developers")
- [ ] Problem statement has evidence (not only intuition)
- [ ] Goals are measurable with targets and timeframes
- [ ] Non-goals explicitly named
- [ ] User journeys written from user perspective
- [ ] Success criteria quantitative where possible
- [ ] Regulatory constraints assessed (or NA justified)
- [ ] Accessibility constraints acknowledged (WCAG 2.1 AA minimum)
- [ ] §6.5 Cost applicability gate answered (Track 17 APPLICABLE or NA-with-justification)
- [ ] §6.6 Locale & language applicability gate answered (Track 18 APPLICABLE or NA-with-justification)
- [ ] Stakeholder approval documented

A PRD missing any of these is not ready for D2R.

---

## Companion Documents

This PRD is one of FIVE prerequisite inputs to `/dare-to-rise-code-plan`:

- **TRD (Technical Requirements Document)** — what the system must do technically
- **AVD (Architecture Vision Document)** — system architecture, components, data flow
- **TQCD (Testing & Quality Criteria Document)** — what success looks like quality-wise
- **UXD (User Experience Document)** — visual design system + interaction polish criteria

See template files in the same `references/` directory.
