---
name: invompt-health
description: |
  Check, diagnose, and safely report the active Invompt MCP connection. Use
  when the user asks whether Invompt is connected, reachable, authenticated,
  or healthy. Do not start a repository checkout or local runtime.
---

# Invompt MCP Health

Treat the Invompt MCP provider already exposed by the host as the only runtime
dependency. Never inspect a repository, configuration file, environment
variable, process, or URL as a fallback, and never switch to another endpoint.

## Check the active provider

1. Find the active provider from host MCP provenance. Prefer the logical name
   `invompt`, but do not guess when more than one registration is plausible.
2. Let the host initialize the provider and discover its live tools.
3. Resolve the provider tool whose server-side name is `ping`, read its live
   schema, and invoke it with only schema-valid arguments.
4. Treat the result as healthy only when transport, protocol, and tool result
   all succeed and any explicit health status is positive.
5. If the initialized provider advertises resources, read
   `invompt://docs/getting-started` only when that exact public resource is
   listed. A missing optional resource does not fail a successful `ping`.

Do not list or read invoices, clients, settings, or other business data for a
health check. Do not call mutations. `ping` is required health evidence and is
not a substitute for the separate user-acceptance test of a real read-only
business operation.

## Classify the result

Use the most specific leading summary:

- `MCP connected and healthy`
- `MCP connected, but authentication is required`
- `MCP connected but a capability check failed`
- `MCP is not configured`
- `MCP is unreachable`

An OAuth/sign-in challenge or `401` is `authentication is required`, not
unreachable. A `429` proves the server responded; report it as connected but
rate limited. An ambiguous provider, incompatible MCP version, missing `ping`,
schema mismatch, protocol error, negative status, or malformed result is never
healthy.

## Protect private data

Return only the classification, advertised Invompt tool names, whether `ping`
passed, whether the optional public resource passed or was skipped, and a
sanitized failure category. Never repeat raw configuration, URLs, headers,
credentials, tokens, cookies, tool payloads, resource bodies, identifiers,
stack traces, or private environment names. Never ask the user to paste a
credential.

For recovery, use only the active host's native connection and authentication
controls. When authentication is required, direct the user to the OAuth or
sign-in action advertised by the provider. Never fall back to an alternate static header,
API key, local endpoint, repository script, or a second provider.
