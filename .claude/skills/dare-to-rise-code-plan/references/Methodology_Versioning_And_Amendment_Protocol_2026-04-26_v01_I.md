# Methodology Versioning and Amendment Protocol

**Document ID:** Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I
**Status:** Initial (I)
**Owner:** Krystal Stahl (krystal@stahlsystems.com)
**Last Updated:** 2026-04-25

---

## 1. Purpose

The Dare-to-Rise code-plan methodology is itself a versioned artifact. Templates, references, and the heading-prefix grammar all evolve over time. This document defines:

1. How methodology artifacts are versioned (what counts as a major vs. minor change).
2. How amendments are proposed, reviewed, and applied.
3. How in-flight bundles relate to methodology versions (which version they were authored under, when they migrate).
4. How status codes (`I`, `R`, `A`, `S`, `D`) work for both methodology artifacts and bundles.

Without a stable amendment protocol, the methodology drifts: templates contradict each other, old bundles can't be re-validated, and the heading-prefix grammar fragments. This document is the lock that keeps the system coherent.

---

## 2. Scope

In scope:

- All artifacts under the `dare-to-rise-code-plan` skill: templates, references, the skill prompt itself.
- All bundles produced using those artifacts.
- The status lifecycle for both.

Out of scope:

- The internal versioning of source code produced from a bundle (governed by the project's own SCM).
- Tooling versions (link-checker, index-rebuilder) — those track their own semver.
- Organizational governance (who has authority to approve amendments) — defaults to bundle owner; orgs MAY override.

---

## 3. Version grammar

Both methodology artifacts and bundles use the same version grammar:

```
v<NN>
```

Where `<NN>` is a two-digit, zero-padded integer starting at `01`. There is **no** semantic versioning (no `v1.2.3`). The two-digit cap (`v99`) is a soft limit; if exceeded, the artifact has almost certainly outlived its design and should be rewritten as a new artifact rather than amended again.

Combined with status, a full version tag looks like:

```
v<NN>_<status>
```

Examples: `v01_I`, `v02_R`, `v03_A`, `v01_S`.

### 3.1 Major vs. minor changes

The single integer `<NN>` collapses what semver splits into major/minor/patch. The rule:

- **Bump `<NN>`** for any change that alters the artifact's contract — that is, any change a downstream consumer (reader, tool, or other artifact) could observe. This includes:
  - Adding, removing, or renaming required sections.
  - Changing the heading-prefix grammar.
  - Changing the bundle-index schema's required columns.
  - Removing or relabeling status codes.
  - Any tombstone that removes a previously valid heading-prefix ID.

- **Do NOT bump `<NN>`** for purely editorial changes:
  - Typo fixes, grammar polish, clarifying examples.
  - Adding a worked example that does not change any rule.
  - Reformatting a table without changing its columns.

In place of a bump, editorial changes update the "Last Updated" front-matter field and append a dated entry to the change log. A reader scanning two files with the same `v<NN>` should see no contractual difference between them.

### 3.2 Why no minor versions

Two-digit single-integer versions are deliberately coarse. The methodology is small enough that a bump-everything-on-contract-change rule keeps cognitive overhead low. If the methodology ever grows large enough that this rule becomes painful, that itself is a signal to split it into multiple smaller artifacts, each with its own version stream — not to introduce semver.

---

## 4. Status lifecycle

Every methodology artifact and every bundle moves through the following status states:

```
        ┌───────┐  draft complete   ┌───────┐  approval   ┌───────┐
        │   I   │ ────────────────► │   R   │ ──────────► │   A   │
        │Initial│                   │Review │             │Approv-│
        └───────┘                   └───────┘             │  ed   │
                                                           └───┬───┘
                                                               │ next version
                                                               │ replaces this
                                                               ▼
                                                          ┌────────┐
                                                          │   S    │
                                                          │Super-  │
                                                          │ seded  │
                                                          └────────┘

  Any state can transition to D (Deprecated) if abandoned.
```

### 4.1 State definitions

| Code | Name        | Meaning                                                                                                       |
|------|-------------|---------------------------------------------------------------------------------------------------------------|
| `I`  | Initial     | First-pass draft. May be incomplete, contradictory, or under heavy churn. Not safe for downstream consumption. |
| `R`  | Review      | Author considers the draft complete. Open for review by collaborators / agents. No further author-driven edits without re-entering `I`. |
| `A`  | Approved    | Reviewed and accepted. Treat as authoritative. Edits require an amendment that bumps `<NN>`.                  |
| `S`  | Superseded  | A higher-`<NN>` version exists in `A` status and replaces this one. Kept for historical reference.            |
| `D`  | Deprecated  | Abandoned without replacement. Do not use. Kept for historical reference.                                     |

### 4.2 Allowed transitions

- `I → R` — author declares the draft ready for review.
- `R → I` — review surfaces issues; author re-enters drafting.
- `R → A` — review passes; artifact is approved.
- `A → S` — a successor version is approved.
- `* → D` — any state may be deprecated (but `A → D` is rare and notable).

Disallowed:

- `I → A` directly. Approval requires a review pass, even if a single reviewer.
- `A → I` or `A → R`. An approved artifact is immutable; changes require a new version.
- `S → *` or `D → *`. Terminal states.

### 4.3 Filename and front-matter

The status code appears in:

- The filename (`..._v01_I.md`).
- The front-matter "Status" field at the top of the artifact.

These MUST agree. A status transition therefore involves:

1. Renaming the file.
2. Updating the front-matter.
3. Appending a change-log entry naming the transition.
4. (For `A → S`) ensuring the successor version exists and is in `A`.

---

## 5. Amendment workflow

An **amendment** is a contractual change to an `A`-status artifact, producing a new `<NN>` version.

### 5.1 Steps

1. **Open.** Copy the current `vXX_A.md` file to `v<XX+1>_I.md`. The original stays untouched in `A` until the amendment is approved.
2. **Edit.** Make the changes in the new `_I` file. Update the front-matter status and "Last Updated".
3. **Log.** Append a change-log entry to the new file describing what changed and why. Reference any superseded heading-prefix IDs by tombstone.
4. **Cascade.** If the amendment changes a contract that other artifacts depend on (e.g., the heading-prefix grammar), open companion amendments for affected artifacts in the same change set. They may all sit in `I` together until the whole set is reviewed.
5. **Review.** Transition the new file(s) to `R`. Reviewers compare against the prior `A` version and the change log.
6. **Approve.** On approval, transition the new file(s) to `A`. **In the same step**, transition the prior `A` file(s) to `S`. The `A → S` of the predecessor and the `R → A` of the successor are atomic; there must never be two `A` versions of the same artifact.
7. **Migrate consumers.** Bundles authored under the prior version are NOT auto-migrated. See section 6.

### 5.2 Tombstones

When an amendment removes or renames a heading-prefix ID that may be referenced by external bundles, the heading is replaced with a tombstone rather than deleted:

```
## REF-3.2 [REMOVED in v02 — see REF-3.5]
```

The tombstone:

- Preserves the ID so old links don't 404 entirely (they land on a stub).
- Names the replacement section, if any.
- Names the version in which the removal happened.

Tombstones MAY be cleaned up on a much later major rewrite (e.g., the artifact is split or rewritten as `v01` of a new artifact), but never within the same numbered version stream.

### 5.3 Editorial corrections

Editorial corrections (typos, formatting) to an `A` artifact are made in place. They do not bump `<NN>`. They MUST:

- Update the "Last Updated" front-matter field.
- Append a dated entry to the change log marked `[editorial]`.

If a reviewer finds that what was filed as editorial actually altered a contract, the change is reverted and reissued as a proper amendment. Erring on the side of "this is contractual, bump the version" is preferred — over-bumping is harmless; under-bumping silently breaks consumers.

---

## 6. Bundles and methodology versions

A bundle is authored under a specific methodology version, recorded in its `BIDX-1 Bundle manifest` field "Methodology". For example:

```
| Methodology | Dare-to-Rise v01 (2026-04-26) |
```

### 6.1 No forced migration

When the methodology bumps (e.g., heading-prefix grammar `v01 → v02`), in-flight bundles are NOT required to migrate. They continue to validate against the methodology version they were opened under. The bundle index records its methodology version explicitly so tooling can pick the right validator.

### 6.2 Voluntary migration

A bundle MAY migrate to a newer methodology version. The migration:

1. Updates the "Methodology" field in `BIDX-1`.
2. Bumps the bundle's own `<NN>` (since this is a contractual change to the bundle).
3. Applies any mechanical transforms required by the new methodology (e.g., renaming heading prefixes).
4. Logs the migration in the bundle's change log, naming the from/to methodology versions.

### 6.3 Mandatory migration

A bundle MUST migrate when:

- The methodology version it was authored under is in `D` (deprecated). The bundle either migrates to a non-`D` version or is itself deprecated.
- A security-critical correction in a newer methodology version applies to it. (No such case exists at v01; this clause is reserved.)

Bundles in `S` or `D` are not subject to mandatory migration — they're frozen anyway.

### 6.4 Mixed-version cross-references

A bundle authored under methodology v01 MAY reference a reference document at v02, as long as the referenced section ID still exists (or has a tombstone). This is the load-bearing reason tombstones exist.

---

## 7. Roles and authority

Default authority model (organizations MAY override):

- **Author** — creates and edits artifacts in `I`. Promotes to `R`. May be the bundle owner or a delegate.
- **Reviewer** — examines `R`-status artifacts; approves to `A` or sends back to `I`. MUST be at least one person other than the author for bundle artifacts; MAY be the author themselves for solo-authored methodology artifacts (with the change log entry serving as the review record).
- **Owner** — accountable for the artifact's lifecycle. Named in front-matter. Has authority to deprecate.

For solo work (one human, one or more agents), the human is author + reviewer + owner. The change log entries serve as the audit trail in lieu of a multi-party review.

---

## 8. Change-log conventions

Every methodology artifact and every bundle artifact MUST end with a "Change log" section. Entries are reverse-chronological (newest first) and use the following format:

```
- **vNN (YYYY-MM-DD) [status]:** One-line summary of the change.
  - Optional bullet detail.
  - Optional bullet detail.
```

For editorial changes that don't bump version:

```
- **YYYY-MM-DD [editorial]:** Fixed typo in section X.Y.
```

Status transitions that don't accompany a content change still log:

```
- **2026-05-12 [status]:** I → R.
- **2026-05-15 [status]:** R → A.
```

The change log is THE primary historical record. Git history is supplementary; a reader with only the file in hand should be able to reconstruct the artifact's history from its change log alone.

---

## 9. Compliance checklist

A methodology artifact conforms to this protocol if and only if:

- [ ] Filename includes `v<NN>_<status>` matching the front-matter.
- [ ] Front-matter declares Document ID, Status, Owner, Last Updated.
- [ ] Change log is present, reverse-chronological, and includes the version's creation entry.
- [ ] Every contractual change since the prior version is reflected in a `<NN>` bump, not just an editorial entry.
- [ ] Tombstones (if any) name the removal version and the replacement section.
- [ ] Status transitions follow the allowed-transitions diagram.

A bundle conforms if and only if:

- [ ] `BIDX-1` names a specific methodology version.
- [ ] Bundle status and version are consistent across filename, front-matter, and `BIDX-1`.
- [ ] If the methodology version named is in `D`, a migration is in progress or the bundle is itself in `D` or `S`.

---

## 10. Open questions (parking lot)

These are deliberately not resolved in v01 and are tracked here for a future amendment:

1. **Multi-owner artifacts.** Current model assumes one owner. Co-ownership semantics (joint approval authority) are undefined.
2. **Cross-org bundles.** When a bundle spans organizations with different authority models, whose review counts? Out of scope for v01.
3. **Automated approval.** Whether an agent can hold "Reviewer" authority, and under what guardrails. Currently treated as advisory only — agent reviews are recorded in the change log but do not by themselves move a `R → A` transition.
4. **Tombstone garbage collection.** No formal rule for when tombstones can be removed. Currently: never within a version stream; possibly on rewrite. Could use a clearer policy.

---

## 11. Change log

- **v01 (2026-04-26):** Initial protocol. Single-integer version grammar. Five-state status lifecycle. No-forced-migration rule for bundles. Tombstone rule for removed heading-prefix IDs.
