---
name: Architecture Vision Document — Template
description: Reusable template for authoring an AVD as a prerequisite input to /dare-to-rise-code-plan. Defines the high-level system shape, component boundaries, data flow, and deployment architecture. Filled-in instances feed into Stage 00 research.
type: template
skill: dare-to-rise-code-plan
version: v01_I
date: 2026-04-17
---

# Architecture Vision Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_AVD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

The AVD is downstream of the PRD (what the product IS) and TRD (what it MUST DO), and parallel to the TQCD (what success looks like quality-wise). The AVD describes the system's HIGH-LEVEL SHAPE before Stage 00 research picks specific libraries and before Stage 01 writes the implementation plan.

For simple projects (e.g., a library with a single consumer), the AVD may be short — components, data flow, deployment, done. For complex projects (multi-surface platforms, distributed systems, cross-app ecosystems), the AVD is the document that keeps architectural decisions coherent across stages.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run.

---

## 1. Document Identity

### 1.1 Project Name And Version

_Project name matching PRD/TRD. Version matching PRD/TRD._

### 1.2 PRD And TRD References

_Cite the PRD and TRD this AVD is downstream of._

### 1.3 Revision History

| Version | Date | Changes | Reviewer |
| ------- | ---- | ------- | -------- |

---

## 2. System Shape

### 2.1 One-Paragraph System Description

_In 3-5 sentences, describe the system's shape at the highest level. Not what it does (that's the PRD). Not what it must do technically (that's the TRD). Its architectural shape — client-server, static site, CLI, library + consumers, distributed workers, event-driven, etc._

### 2.2 Architectural Style

_Name the architectural style(s) the system uses:_

- _Monolithic / Microservices / Serverless / Static Site / CLI / Library / Hybrid_
- _Synchronous / Asynchronous / Event-Driven / Request-Response_
- _Stateful / Stateless_
- _Client-Side / Server-Side / Hybrid_

_For each: one-line rationale._

### 2.3 Surface Layers

_What surfaces does the system expose to consumers? For each surface:_

- _Name_
- _Consumer type (human user via UI, developer via API, developer via CLI, etc.)_
- _Relationship to other surfaces (are they all wrappers around one core? Independent? Dependent?)_

---

## 3. Components And Boundaries

### 3.1 Component Inventory

_Every major component of the system. Required per component:_

- _Component name_
- _Responsibility (one sentence)_
- _Inputs (from which other components or external sources)_
- _Outputs (to which other components or external sinks)_
- _Interfaces exposed (public API surface)_

### 3.2 Boundaries

_Where are the hard boundaries between components?_

- _Process boundaries (separate processes, separate services)_
- _Language / runtime boundaries (TypeScript vs Rust vs Python sidecar, etc.)_
- _Trust boundaries (which components can be trusted with which data)_
- _Release boundaries (which components ship together vs independently)_

### 3.3 Component Diagram

_Narrative description of component relationships (since this is a markdown doc, describe in prose or include a link to a separate diagram file). Required: every component in the inventory must appear; every arrow must have a direction and a label._

---

## 4. Data Flow

### 4.1 Primary Data Flows

_The main data journeys through the system. Required per flow:_

- _Flow name_
- _Trigger_
- _Steps: data enters at X → transformed by Y → stored in Z (or transmitted to W)_
- _Output: what the consumer sees / receives_
- _Latency expectations (from TRD)_

### 4.2 Secondary Data Flows

_Background jobs, scheduled tasks, error-recovery flows._

### 4.3 Data Persistence Points

_Where does data persist?_

- _Location (database type, file system, client-side storage, etc.)_
- _Lifetime (session / persistent / archival)_
- _Consistency model (strong / eventual / last-write-wins)_

---

## 5. Deployment Architecture

### 5.1 Deployment Targets

_Every deployment target. Required per target:_

- _Target name (production web, desktop release, npm package, plugin marketplace, etc.)_
- _Hosting / distribution mechanism_
- _Build process (source → artifact)_
- _Release cadence_

### 5.2 Runtime Environments

_For each deployment target, the runtime environment it assumes:_

- _Browser versions / OS versions / Node versions / etc._
- _Resource constraints (memory, CPU, disk)_
- _Network assumptions_

### 5.3 Configuration And Secrets

_How is configuration delivered to each runtime? Where do secrets live? How are they rotated?_

### 5.4 Deployment Topology

_If the system spans multiple deployment targets, describe the topology:_

- _Which targets talk to which_
- _Authentication between targets_
- _Data replication or sync patterns_

---

## 6. Cross-Cutting Concerns

### 6.1 Logging And Observability

_Which components emit logs? What format? Where do they aggregate? (Cross-reference TRD Section 3.8.)_

### 6.2 Error Handling Strategy

_System-wide error handling: thrown exceptions vs Result types vs error channels. Error propagation between components._

### 6.3 Concurrency Model

_How does the system handle concurrent operations? Event loop, worker threads, async/await patterns, message queues, etc._

### 6.4 Security Architecture

_High-level: where is authentication enforced? Where is authorization enforced? Where does data encryption happen? (Cross-reference TRD Section 3.3.)_

### 6.5 Accessibility Architecture

_If the system has UI surfaces: how is accessibility architecturally enforced? Component library choice? Testing integration? (Cross-reference TRD Section 3.5 and TQCD Section 6.)_

---

## 7. Architectural Decisions (Mini-ADRs)

_For each significant architectural decision, record:_

_Required format per decision:_

- _Decision ID (AD-NN)_
- _Title (one-line)_
- _Status (Proposed / Accepted / Deprecated / Superseded)_
- _Context: what problem was being solved_
- _Options considered (with one-line summary each)_
- _Decision: which option was chosen_
- _Rationale: why this option_
- _Consequences: what this decision locks in and what it forecloses_

_Examples of decisions that warrant an AD:_

- _Language choice when multiple were viable_
- _Framework choice_
- _Sync vs async architectural choice_
- _Monolithic vs service-oriented_
- _Database choice_
- _Client-side vs server-side_
- _Custom library vs OSS adoption_

---

## 8. Technical Debt And Known Compromises

_Architectural compromises made in this version. Named so they're visible when decisions are revisited._

_Required per item:_

- _Compromise description_
- _Why it was made_
- _What it costs_
- _When/whether to revisit_

---

## 9. Open Architectural Questions

_Unresolved architectural decisions. Stage 00 research should address these or Stage 01 must flag them for user decision._

---

## 10. Stakeholder Approvals

_Who has approved this AVD?_

_Required per stakeholder: name, role, approval date, notes._

---

## Validation Checklist (Pre-Stage-00)

- [ ] All required sections completed
- [ ] NA sections have one-line justifications
- [ ] Every component has inputs, outputs, responsibility named
- [ ] Every primary data flow traced end-to-end
- [ ] Every deployment target has runtime environment + build process documented
- [ ] Mini-ADRs present for every significant architectural decision
- [ ] Cross-cutting concerns addressed (or explicitly NA)
- [ ] Open questions named for Stage 00 to resolve
- [ ] Stakeholder approval documented

A project does not require an AVD if:

- The system is trivially simple (single file, no cross-component boundaries, no architectural choices to make)
- In which case Stage 00 documents the AVD-skipped status with justification

## Companion Documents

This AVD is one of four prerequisite inputs to `/dare-to-rise-code-plan`. The others:

- **PRD (Product Requirements Document)** — what the product IS
- **TRD (Technical Requirements Document)** — what it MUST DO technically
- **TQCD (Testing & Quality Criteria Document)** — what success looks like quality-wise

All four templates live in `.claude/skills/dare-to-rise-code-plan/references/` and each has a corresponding authorship skill (`/write-prd`, `/write-trd`, `/write-avd`, `/write-tqcd`).

## Downstream Use

This AVD feeds directly into:

- **Stage 00 Track 1:** Tech stack research scopes against the AVD's architectural style and component inventory
- **Stage 00 Track 4:** Language-depth-of-spec research scopes against the component boundaries and runtime environments
- **Stage 00 Track 5:** Skill/plugin ecosystem research scopes against cross-cutting concerns (which plugins help with accessibility, security, observability architecturally)
- **Stage 01a:** Skeleton authorship maps components to implementation stages
- **Stage 01b:** Full plan authorship writes Deep-spec content consistent with the AVD's component boundaries and data flows
