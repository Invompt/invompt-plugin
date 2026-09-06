---
name: invompt-invoice
description: |
  Create or manage an Invompt invoice from a natural-language request. Quote and estimate documents are typed InvoML documents handled by the invoice-named tools; a pro forma uses documentType quote. Use to create, find, review, revise, archive, or restore a billing document, create, find, revise, or archive a saved client, or list, inspect, preview, and explicitly save an existing invoice as a reusable template. List and get summaries are invoice-shaped; documentType and expiryDate require canonical invomlContent. There are no separate type-specific quote, estimate, or pro-forma tools, Web generators, selectors, or first-class editor fields. Do not use for general pricing advice, sending email, taking payment, or unrelated writing.
---

# Invompt Invoice Workflow

Use the configured Invompt MCP connection. Discover the connection and its advertised tools through
the active host; never assume an endpoint, authentication mode, provider label, wrapper-qualified
tool name, fixed tool count, or local repository. If the host exposes more than one Invompt
registration and cannot identify the active one from provenance or explicit user selection, stop
instead of choosing by name. Match semantic intent rather than requiring the word “Invompt”, an
English command, or a fixed keyword list. Respond in the user's language unless they request
another language.

Load the bundled [InvoML v1 reference](references/invoml-v1.md) with this skill. It is the fast,
offline drafting baseline shipped in the plugin. The connected server's live tool schemas remain
the final capability contract. Read `invompt://spec/invoml/v1` only when the user requests an
advanced field outside the portable baseline or validation indicates drift. Do not download a
specification from the Web or search for an Invompt checkout.

Quotes and estimates are typed InvoML documents created through the invoice-named MCP tools. A pro
forma is represented with `meta.documentType: "quote"`; there are no separate type-specific quote,
estimate, or pro-forma tools, Web generators, selectors, or first-class editor fields.
`list_invoices` and `get_invoice` return invoice-shaped summaries; read `documentType` or
`expiryDate` from canonical `invomlContent` when it is supplied.

## Route The Request

| Intent | Action |
|---|---|
| Price, cost, or budgeting advice without a document request | Answer normally; do not call Invompt. |
| Create an invoice, quote, estimate, or pro forma | Follow the creation workflow. |
| Convert earlier conversation into a billing document | Reuse relevant earlier facts and create it. |
| Find or inspect saved clients | Use `list_clients` and `get_client` when exposed. |
| Save or revise a client | Use `create_client` or `update_client` only after resolving duplicates and user intent. |
| Archive a saved client | Confirm the target and authorization, then use `archive_client`. |
| Find or read existing documents | Use `list_invoices` and `get_invoice` when exposed. |
| Find or inspect reusable invoice templates | Use `list_invoice_templates` and `get_invoice_template` when exposed. |
| Save an existing invoice as a reusable template | Use `preview_invoice_template_extraction`, show the exclusions, and call `save_invoice_as_template` only after explicit confirmation of the exact preview. |
| Revise, translate, correct, or restyle an existing document | Use `update_invoice` when exposed. |
| Renew an expired hosted link | Use `renew_invoice_link` when exposed. |
| Archive an existing document | Confirm the target and authorization, then use `archive_invoice`. |
| Restore an archived document | Confirm the target, then use `unarchive_invoice` when exposed. |
| Read account defaults | Use `get_settings` only when exposed and account defaults matter. |
| Change account defaults | Use `update_settings` with only user-supplied fields and only the mutation controls exposed by its live schema. |
| Check connection | Use `ping`; do not call it as a normal creation preflight. |

Treat live MCP tool and resource schemas as the final capability contract. Discovery does not prove
call-time authorization unless the server supplies explicit permission metadata. If a management
tool is absent or rejects the current identity, report that capability or authentication gap
without creating a duplicate or switching to another artifact tool.

## Manage Reusable Invoice Templates

Template application to invoice creation is not supported by this skill yet. Do not invent or pass
`savedTemplateId`, and do not use a template to call `create_invoice` until the live schema and
product contract explicitly support that workflow.

- To find templates, use `list_invoice_templates` with only the live filter fields it exposes. Use
  `get_invoice_template` for a selected template when the user asks to inspect its details.
- To save an existing invoice as a template, identify the invoice and current revision first, then
  call `preview_invoice_template_extraction` as a read-only step. `includeLineItems` defaults to
  `false`; set it to `true` only when the user explicitly asks to include line items.
- The preview is the only source for the proposed template body. Never reuse raw `get_invoice`
  InvoML as a template, silently copy an invoice body, or infer that an existing template ID is
  reusable. Show the proposed name, type, included fields, excluded fields with reasons, and the
  projection checksum before asking for confirmation.
- Use the safe preset unless the live schema documents a narrower supported choice. It excludes
  issuer and recipient/client parties, payment data, free-form notes and sections, and rendered
  HTML, CSS, or assets. Only validated semantic defaults (for example currency, locale, tax, or
  date format) may be retained when the preview explicitly reports them.
- Call `save_invoice_as_template` only after the user explicitly confirms the exact preview
  checksum, name, and options. Never silently save, apply, archive, or replace a template. If the
  save result is ambiguous and the live schema has no idempotent retry control, stop and report it.
- Return the saved template ID, version, and name when supplied. Do not claim invoice creation or
  template application linkage; that capability is not part of this contract yet.

## Create A Document

### One-pass creation preflight

Before asking for billing details, reading account defaults, or drafting any create request, make
one effective-provider preflight in the active host:

1. Use the host's MCP provenance and one `tools/list` result to identify the effective Invompt
   provider and its advertised `create_invoice` tool. Discovery happens once for this request; do
   not loop, retry discovery, or use `ping` as a creation preflight.
2. If no effective Invompt provider is present, stop and report `MCP is not configured`.
3. If the effective Codex provider is present but reports `not_logged_in`, an OAuth-required
   challenge, or an equivalent unauthenticated state, stop before asking billing questions or
   drafting. Report `MCP connected, but authentication is required`, then give this exact safe
   recovery: run `codex mcp login invompt`, complete browser
   authorization without sharing secrets, then start a genuinely fresh Codex task because open
   tasks do not hot-reload auth. Do not make a mutation, draft, or speculative tool call before
   recovery. On another host, follow only that host's native authentication action and require a
   fresh task when its provider says the current task cannot refresh credentials.
4. If the provider does not expose a reliable authenticated state, stop before drafting and report
   that authentication could not be verified. Do not infer authorization from tool discovery.
5. Only after authentication is known to be valid, if `create_invoice` is absent, stop and report
   `MCP connected but the create capability is unavailable`. Authentication takes precedence when
   both the unauthenticated state and an empty tool list are observed. Do not fall back to another
   provider, endpoint, static header, API key, local runtime, or repository script.
6. Continue only when the provider is effective, authenticated, and advertises `create_invoice`.
   Use its live input schema for the request. Do not repeat the preflight after a clarification;
   the already resolved provider and tool remain authoritative for this request.

1. Start from the bundled InvoML reference. If `invompt://docs/getting-started` is advertised,
   read it once per session only when the live schemas indicate workflow changes.
   A missing resource is not a blocker when the required tool schema is available.
2. Reuse relevant facts from earlier turns, even when the current message is a short follow-up or
   uses a different language.
3. When account defaults matter and `get_settings` is exposed, read them instead of asking for
   values the configured workspace already supplies. Never change defaults during creation unless
   the user asks.
4. When the user names a recipient and managed client tools are exposed, call `list_clients`
   before creating the document:
   - select and pass `clientId` only when the response reports one exact unique match;
   - when matches are ambiguous, ask which saved client to use;
   - when none match, ask one consolidated question: save and assign the client, or use the
     recipient data only for this document;
   - call `create_client` only after the user chooses to save, using an idempotency key only when
     its live schema exposes or requires one, then pass the returned `clientId`;
   - never create a saved client silently as a side effect of `create_invoice`.
5. Ask one consolidated question only when a required or ambiguous value is genuinely missing,
   such as the final authored number, currency, quantity, price, or the year in a validity date.
   Optional identity, tax, address, contact, payment, and notes fields never block creation.
6. Draft sparse valid InvoML from the bundled reference and the live schema:
   - preserve the user's language and use a BCP 47 `meta.locale` when known;
   - use the current local date when no issue date is provided;
   - treat `meta.number` as exact final authored data; ask rather than inventing a sequence or
     persisting a `DRAFT-*` number;
   - use `quote` for pro formas and put explicit quote/estimate validity in `meta.expiryDate`;
   - keep billable work in `items`, use quantity `1` for an explicit flat amount, and never author
     computed `totals`;
   - put an explicitly paid amount only in root `prepaidAmount`;
   - put ordinary payment instructions in `payment`; add `paymentAdvice` for an explicitly
     requested detachable remittance stub only when the live InvoML resource documents it;
   - omit unknown identities, rates, tax data, addresses, payment data, and legal text;
   - omit style unless the user requests a supported presentation change.
7. Call the discovered `create_invoice` tool with serialized InvoML and the selected `clientId`
   when applicable. Include `idempotencyKey` only when the live input schema exposes or requires
   it; follow its live constraints and reuse the key only for an identical retry. Never place
   either value inside the InvoML document or send an argument absent from the live schema.
8. Treat a structurally valid, non-error `create_invoice` result as successful according to its
   discovered live output schema. Return the allowlisted fields it actually supplies; the
   configured runtime may return only `invoiceId`, hosted `url`, and quota metadata.
   Verify the authored number and perform canonical `get_invoice` read-back only when the create
   result and the advertised, authorized read capability support those checks. Never mark a valid
   creation failed—or retry a non-idempotent creation—merely because optional canonical fields or
   read-back are unavailable. If returned, use the friendly workspace name. Never expose an
   internal workspace reference, device ID, credential, quota internals, or raw response payload.

## Manage Existing Documents

- Retrieve canonical InvoML before editing when the current conversation does not already contain
  the latest document.
- Use `update_invoice`, not `create_invoice`, for revisions to an identified document.
- Ordinary updates preserve the canonical invoice number. Correct a wrong persisted number only
  with full corrected InvoML and explicit audited `numberCorrection: { from, reason }`.
- Pass a saved `clientId` to `update_invoice` to assign or explicitly resync that invoice from the
  current client record. Editing a saved client never rewrites historical invoice snapshots.
- Pass `clientId: null` only when the user explicitly wants to detach the saved-client reference;
  the invoice's existing recipient snapshot remains intact.
- Send the complete revised InvoML and preserve fields the user did not ask to change.
- Send `expectedVersion` and `idempotencyKey` for update, archive, and restore only when exposed or
  required by the live schema. Use the latest canonical version, obey the live key constraints, and
  read the canonical document again before retrying a version conflict.
- Treat a structurally valid, non-error `update_invoice` result as successful according to its
  discovered output schema; the configured runtime may return only `invoiceId`. Return
  richer canonical fields and verify with `get_invoice` only when its advertised schema and
  call-time authorization support that read. Never mark a valid update failed because optional
  fields or read-back are unavailable, and never retry an ambiguous non-idempotent update.
- If `get_invoice` reports no active hosted link, use `renew_invoice_link` when exposed with a
  stable idempotency key only when its live schema exposes or requires one. Renewal rotates the
  public capability without revising the invoice.
- Treat archive as destructive even when implemented as a soft delete. Require an identified target
  and clear user authorization.
- For saved-client writes, send idempotency and expected-version controls only when the live schema
  exposes them. Use the latest client version and reuse a key only for the same retry.
- Settings updates are partial: send only user-supplied fields. Omission means unchanged; use
  explicit null only where the live schema documents clearing behavior.

## Error Recovery

- Correct one obvious InvoML validation error and retry once. When the error indicates snapshot
  drift and the server advertises `invompt://spec/invoml/v1`, read that resource before retrying.
- When `create_invoice` does not expose an idempotency input, never retry after an ambiguous
  transport outcome; report that the result is unknown so the user can check before creating
  another document.
- If required billing values remain missing, ask one concise consolidated question.
- If the MCP endpoint or required tool is unavailable, report the connection or capability error.
- Never expose API keys, OAuth tokens, headers, cookies, stack traces, internal workspace references, device
  identifiers, or private environment values.

## Hard Boundaries

- Never bypass MCP with direct Invompt REST calls.
- Never create a replacement PDF, document, site, code artifact, or filesystem output. An explicit
  request to save an existing invoice as PDF is routed to the separate `invompt-export` skill;
  this invoice skill never exports automatically after creation or mutation.
- Never launch Chromium, Puppeteer, or a PDF CLI for this workflow.
- Never silently switch to another MCP server or environment.
- Return Invompt's hosted URL; the Web product owns preview and download/print.

The export skill is the sole explicit read-only PDF GET/filesystem exception. It must refresh
through `get_invoice`, trust only the returned URL, and use the canonical preview PDF route.
