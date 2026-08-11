---
snapshot_id: invoml-v1
format_version: "1.0"
package: "@invompt/invoml"
package_version: "1.0.0-alpha.14"
source_commit: "c292abdcc127f970f015e80be1bee50b4422004f"
source_forward_package_version: "1.0.0-alpha.20"
source_forward_source_commit: "de31bc3550c4baef4866f5630a41b96c9d9644e2"
mcp_source_package: "invompt-mcp"
mcp_source_package_version: "0.9.5"
mcp_source_commit: "5e15d46e74ea339a676d90a9451e6b7388356f07"
captured: "2026-08-04"
---

# Bundled InvoML v1 Drafting Reference

This concise snapshot is packaged with the Invompt skill so an invoice can be drafted without
downloading a manual or locating a source checkout. It records the authorable document contract;
Invompt still validates, calculates, renders, persists, versions, and hosts the result.

Use this file first. It is an authoring compatibility baseline condensed from
`@invompt/invoml@1.0.0-alpha.14`. The schemas and
resources exposed by the configured Invompt MCP server are final when they add or constrain fields
beyond this snapshot. Read `invompt://spec/invoml/v1` only when the user requests an advanced field
not covered here or validation indicates drift. An unavailable resource does not invalidate this
baseline.

## Contents

- Minimal valid document
- Authoring contract
- MCP boundary
- Provenance and update contract

## Minimal Valid Document

```json
{
  "$invoml": "1.0",
  "meta": {
    "documentType": "invoice",
    "number": "INV-1007",
    "issueDate": "2026-07-31",
    "currency": "USD",
    "locale": "en-US"
  },
  "to": {
    "content": "**Example Client**\nbilling@example.test"
  },
  "items": [
    {
      "description": "Consulting services",
      "quantity": 8,
      "unitPrice": 120,
      "unit": "hours"
    }
  ]
}
```

Required author input is `"$invoml": "1.0"`, `meta.documentType`, `meta.number`,
`meta.issueDate`, `meta.currency`, and at least one item with `description`, `quantity`, and
`unitPrice`. `meta.locale` is optional but should be a BCP 47 tag when known. Omit unknown optional
facts rather than inserting placeholders.

## Authoring Contract

- `meta.documentType` accepts `invoice`, `quote`, `estimate`, `receipt`, or `credit_note`. Use
  `quote` for a pro forma. A credit note also requires `meta.creditNoteReference`.
- Dates are ISO `YYYY-MM-DD`. Use `dueDate` for invoice payment due dates and `expiryDate` for
  quote or estimate validity. Do not invent aliases such as `validUntil`.
- `meta.number` is exact authored data. Never invent a sequence or temporary `DRAFT-*` value.
- Currency uses an ISO 4217 code. Preserve the user's content language independently from locale.
- For maximum portability, author `from` and `to` as `{ "content": "markdown" }`. Structured
  address representation differs between portable and source-forward runtimes; do not mix
  `content` with structured fields.
- Line items contain billable work. `quantity` and `unitPrice` are numbers; an explicitly stated
  flat amount uses quantity `1`. Preserve an explicit negative adjustment rather than silently
  changing its sign.
- An item discount is a percentage string such as `"10%"` or a discount object. Root
  `discounts` entries use `{ "type": "percentage"|"fixed", "value": number, "label"?: string }`.
- Tax belongs in `meta.tax`. Omit it when the user supplied no tax. A simple tax is
  `{ "label": "VAT", "rate": 10, "inclusive"?: true }`; follow a newer live schema for advanced
  category tax.
- Never author `totals`, `items[].amount`, or `items[].taxAmount`. Invompt recalculates them.
  Explicit prior payment belongs only in root `prepaidAmount`.
- Put ordinary payment instructions in root `payment`. The portable baseline does not author
  `paymentAdvice`; when the user explicitly requests a detachable remittance stub, use it only if
  the live InvoML resource documents it.
- `sections` is a map of stable keys to `{ "title": string, "content": string }`. Use separate
  sections or plain text for subordinate groups; the portable baseline does not author headings.
- The portable Markdown baseline is bold, italic, HTTP(S) or `mailto:` links, and
  ordered/unordered lists. Markdown tables and headings are not part of this baseline.
- Style is presentation-only. The portable baseline authors only `template`, `order`, and
  `hidden`. Templates shared by the portable and source-forward contracts are `minimal` and
  `professional`.
- Do not author `dateFormat`, `style.properties`, `style.blocks`, or `style.pageFooter` from this
  baseline. Those surfaces can differ between this compatibility snapshot and the configured live
  contract. If the user requests an advanced style that needs one of them — such
  as custom page-number footer text or hiding the page-number footer (`pageFooter.show`) —
  consult the advertised live InvoML resource and follow that exact contract.
- `style.hidden` hides data without deleting it. Use block, meta, column, or `section:<key>`
  selectors documented by the live schema.
- Promise semantic fidelity for representable data, not a pixel-identical clone.

## MCP Boundary

`clientId`, `idempotencyKey`, `expectedVersion`, `numberCorrection`, and template overrides are
tool inputs, not InvoML fields. Send only inputs present in the discovered live tool schema; the
configured runtime may expose a smaller surface than the source provenance contract.

- Search saved clients for a named recipient when that capability is exposed. Auto-select only one
  exact unique match; ask on ambiguity; ask before saving an unmatched client.
- When a mutation schema exposes or requires `idempotencyKey`, use a stable value that satisfies
  its live constraints and reuse it only for the identical retry. Never invent that argument for a
  schema that does not expose it.
- Update/archive/restore operations use the latest canonical version as `expectedVersion` when the
  live schema requires it.
- Ordinary updates preserve the canonical number. When exposed by the live schema, a correction
  uses complete corrected InvoML plus audited
  `numberCorrection: { "from": currentNumber, "reason": explanation }`.
- Return only allowlisted invoice facts and the hosted URL. Never reveal internal workspace references, device
  identifiers, credentials, tokens, headers, raw errors, or private environment values.
- Treat a non-error creation result by its discovered output schema. A minimal
  `{ "invoiceId", "url", "quota"? }` result is sufficient; richer canonical fields and
  `get_invoice` verification are conditional on advertised, authorized capabilities. Never retry a
  successful or ambiguous non-idempotent creation merely because richer fields are absent.

## Provenance And Update Contract

The authoring compatibility baseline was condensed from published `@invompt/invoml`
`1.0.0-alpha.14` at source commit `c292abdcc127f970f015e80be1bee50b4422004f`. Newer
source-forward evidence is
`@invompt/invoml@1.0.0-alpha.20` at commit
`de31bc3550c4baef4866f5630a41b96c9d9644e2`. The MCP boundary was checked against unpublished
`invompt-mcp@0.9.5` source at commit `5e15d46e74ea339a676d90a9451e6b7388356f07`.
The recorded `0.9.5` MCP value is historical snapshot provenance, not the current package release.
These source versions are maintainer provenance, not permission to send unsupported inputs. The
live runtime schema and advertised InvoML resource always win. Documents still use
`"$invoml": "1.0"`.

The 2026-08-05 release checkpoint preserves the then-current `invompt-mcp@0.10.0` and InvoML
alpha.21 state as history. Current public distribution is `invompt-mcp@0.10.3` and unscoped
`invoml@1.0.0-alpha.23` on the `next` dist-tag. The product candidate remains on scoped/vendored
alpha.20; this bundled snapshot is not silently promoted by an independent package publication.

When the package or served v1 resource changes, maintainers must compare the normative spec, public
types, product prompt contract, and MCP create/update schemas; update this compact reference and
its frontmatter in the same change; and run link, packaging, provenance, and drafting-contract
tests. Do not copy the full normative manual into the plugin. Sibling repositories are update
evidence only and are never an installed runtime dependency.
