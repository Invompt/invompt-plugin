---
name: invompt-export
description: |
  Export an existing online Invompt invoice as a PDF after the user explicitly asks to download or save it. Use the fresh hosted invoice link. Do not use it to create, edit, view, or send an invoice, take payment, or fetch an arbitrary URL.
---

# Invompt Online PDF Export

This is the sole explicit read-only PDF GET and local-filesystem exception in the Invompt agent
workflow. The Web product remains the only invoice renderer and the MCP server remains
business-operation-only.

Use this skill only when the user explicitly asks to save, download, or export an existing
Invompt invoice to a local PDF file. Examples include “Export invoice IV00052 as PDF into
`./exports`” and “Guarda la factura IV00052 como PDF en `./exports`”. Do not trigger for “show
me the invoice”, “create an invoice”, “print this”, “make a Markdown copy”, or a request that
only contains a URL.

## Procedure

1. Discover the active Invompt MCP connection and its live schemas. Continue only when its endpoint
   is exactly `https://mcp.invompt.com/mcp`. Refuse a loopback, project-development, or unknown
   endpoint; this consumer skill has no transport selector or fallback. Call `get_invoice` for the
   identified invoice immediately before export so the returned hosted URL is fresh. If the tool
   is unavailable, the invoice is missing, or the link is expired/revoked, report that safe category
   and stop.
2. Accept only the trusted `url` field returned by that `get_invoice` result. Never accept,
   fetch, concatenate, or substitute a user-supplied URL. Require the exact
   `https://invompt.com` preview origin and
   `/preview/{43-character-base64url-token}` path, then append only the literal `/pdf` suffix.
   Treat the MCP tool result and the host's private tool-input transcript as sensitive trusted
   execution state. Never copy the opaque token or URL into user-visible conversation, command
   arguments, environment variables, debug output, errors, temporary files, or result JSON. Do
   not export or share the private host transcript.
3. Resolve the packaged launcher as the absolute `scripts/invoke-export-pdf.mjs` sibling of the
   `SKILL.md` that the current host actually loaded. Never resolve it from the checkout, current
   working directory, an invented environment variable, or a different installed plugin version.
   If the loaded skill path is unavailable, stop instead of guessing.
4. Start that fixed launcher with Node and no command arguments, no TTY, no shell interpolation,
   and a sanitized environment with `NODE_DEBUG` and `NODE_OPTIONS` absent. Attach one JSON object
   directly to its stdin pipe with exactly `destination`, `url`, and optional `overwrite` fields.
   The launcher and downloader are fixed to the online origin and reject any other origin. The host
   process API must pass raw stdin bytes and must not echo or log them;
   if it only accepts a constructed shell command or a TTY, stop. The launcher validates the
   structure and uses an argv array to invoke the downloader, so neither the user-controlled path
   nor the capability URL crosses a shell parser. If the user gives no destination, use `exports/`
   under the current workspace. The downloader creates missing destination directories, preserves
   received bytes, refuses collisions by default, and returns JSON containing an absolute path and
   byte count only after atomic finalization. Set `overwrite` only when the user explicitly
   authorizes overwriting that exact `.pdf` file; never use it for a directory destination.
5. Parse the launcher's JSON and report the absolute final path and byte count. Never report the capability token, raw URL,
   response body, credentials, headers, or stack trace. Never claim success until the downloader
   confirms the final file.

The downloader performs one bounded GET with no automatic retry. It follows no redirects, sends
`Accept: application/pdf`, validates status, MIME, `%PDF-` signature, size, and safe
`Content-Disposition`, and uses a same-directory restrictive temporary file with atomic
finalization and failure/interruption cleanup.

Never render locally, launch Chromium/Puppeteer/Playwright, call a REST mutation or fallback,
write PDF bytes through MCP, or export automatically after `create_invoice`.
