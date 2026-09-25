# Install Invompt

Choose the matching setup path for your AI app. Claude Code and Codex use the primary plugin paths; compatible remote MCP hosts connect to `https://mcp.invompt.com/mcp`. Authentication happens in the browser connection flow. No API key is used for the product path.

Identify the AI app you are running in and use one matching section below. If you cannot identify it, show the user the available apps and ask which one they use.

## Claude Code

Set up Invompt for me in Claude Code.

Run these commands in the terminal. The plugin includes the Invompt MCP connection:
1. claude plugin marketplace add https://github.com/Invompt/invompt-plugin.git#v1.2.85
2. claude plugin install invompt@invompt --scope user

Start login with: claude mcp login plugin:invompt:invompt

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Claude Code. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. If that is unavailable, show me the other supported apps.

If this is not Claude Code, use the matching host instructions instead.

## Codex

Set up Invompt for me in Codex.

Inspect the current Codex state, then use exactly one matching branch:
1. Before any install or update, run each command separately with shell pipefail enabled. Every readback must receive nonempty valid JSON, pass jq -e structural and required-field checks, and exit successfully; a failed CLI command, empty output, malformed JSON, unexpected shape, or missing required field is an error and must stop the workflow.
1. set -o pipefail; codex plugin marketplace list --json | jq -e 'if type != "object" or (.marketplaces | type) != "array" or ([.marketplaces[] | select((.name | type) != "string")] | length) != 0 then error("unexpected marketplace JSON or missing entry name") else [.marketplaces[] | select(.name == "invompt") | if (.marketplaceSource | type) == "object" and (.marketplaceSource.source | type) == "string" then {name, source: .marketplaceSource.source} else error("missing Invompt marketplace fields") end] end'
2. set -o pipefail; codex plugin list --available --json | jq -e 'if type != "object" or (.installed | type) != "array" or (.available | type) != "array" or ([.installed[], .available[] | select((.pluginId | type) != "string")] | length) != 0 then error("unexpected plugin JSON or missing plugin ID") else [(.installed + .available)[] | select(.pluginId == "invompt@invompt") | if (.marketplaceName | type) == "string" and (.version | type) == "string" and (.installed | type) == "boolean" and (.enabled | type) == "boolean" then {pluginId, marketplaceName, version, installed, enabled} else error("missing Invompt plugin fields") end] end'
3. set -o pipefail; codex mcp list --json | jq -e 'if type != "array" or ([.[] | select((.name | type) != "string")] | length) != 0 then error("unexpected MCP JSON or missing server name") else [.[] | select(.name == "invompt") | if (.enabled | type) == "boolean" and (.transport | type) == "object" and (.transport.type | type) == "string" and (.transport.url | type) == "string" and (.auth_status | type) == "string" then {name, enabled, transport_type: .transport.type, url: .transport.url, auth_status} else error("missing Invompt MCP fields") end] end'
4. Only if the MCP array contains exactly one Invompt entry, run set -o pipefail; codex mcp get invompt --json | jq -e 'if type != "object" or .name != "invompt" or (.enabled | type) != "boolean" or (.transport | type) != "object" or (.transport.type | type) != "string" or (.transport.url | type) != "string" then error("unexpected Invompt MCP detail JSON") else {name, enabled, transport_type: .transport.type, url: .transport.url} end'.
Do not inspect, remove, replace, disable, upgrade, or otherwise mutate any other marketplace or plugin. Stop without mutation on duplicates, an unexpected source/version/transport/URL/auth state, missing fields, or any other ambiguous state.
2. First-install branch: only if the filtered readback proves there is no `invompt` marketplace, no `invompt@invompt` plugin, and no `invompt` MCP entry, show the proposed change and obtain explicit confirmation. Other marketplaces and plugins are out of scope and do not affect this branch. After confirmation, run exactly `codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.85 --json`, then `codex plugin add invompt@invompt --json`, then `codex mcp login invompt`.
3. Existing-install branch: require exactly one canonical `invompt` marketplace with source `https://github.com/Invompt/invompt-plugin.git`, exactly one installed and enabled `invompt@invompt` plugin, and exactly one enabled `invompt` MCP entry using `streamable_http` at `https://mcp.invompt.com/mcp` with auth_status `o_auth` or `not_logged_in`. If the official plugin is already v1.2.85, do not run install or update commands. If it is exactly one of the official prior versions v1.2.81, v1.2.82, v1.2.83, or v1.2.84, show the proposed non-atomic update and obtain explicit confirmation, then run exactly `codex plugin marketplace remove invompt --json`, `codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.85 --json`, and `codex plugin add invompt@invompt --json`. Do not infer support for any other version. Never run `codex mcp logout`, `codex mcp remove`, or a raw `codex mcp add`; preserve existing OAuth and run `codex mcp login invompt` only when auth_status is `not_logged_in`. After any mutation, repeat the filtered readback and require the exact canonical v1.2.85 state. If any step fails, stop and report the filtered state without deleting caches, touching any other marketplace or plugin, or improvising a rollback.
4. When the host exposes provenance, compare the active task's resolved Invompt skill source/version with the installed plugin inventory. Require v1.2.85; if it is stale or cannot be established, stop and do not claim Verified.

Only when the selected branch requires login because auth_status is not_logged_in, start it with: codex mcp login invompt

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to quit and reopen Codex Desktop, or restart the Codex CLI process. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If any setup or update step fails, stop, repeat only the filtered readback, report the exact Invompt state, and do not retry a mutation or improvise a rollback. If I want another option, offer this documented alternative: Stop and report that the native plugin path is unavailable. Do not add a raw Codex MCP entry or modify configuration outside the native plugin workflow. If that is unavailable, show me the other supported apps.

If this is not Codex, use the matching host instructions instead.

## Kimi Code

Set up Invompt for me in Kimi Code.

Run these setup steps in Kimi Code:
1. /plugins install https://github.com/Invompt/invompt-plugin/releases/tag/v1.2.85
2. /plugins reload

Start login with: /mcp-config login invompt

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to start a new Kimi Code session with `/new`. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. If that is unavailable, show me the other supported apps.

If this is not Kimi Code, use the matching host instructions instead.

## Claude Desktop

Set up Invompt for me in Claude Desktop.

Add the Invompt MCP connection with these steps:
1. On individual Free, Pro, or Max, open Customize → Connectors, select + → Add custom connector. Free supports one custom connector.
2. On Team or Enterprise, an Owner or Primary Owner must first open Organization settings → Connectors, select Add → Custom → Web, and add the connector for the organization.
3. Enter name Invompt and endpoint https://mcp.invompt.com/mcp, select Add, then select Connect and complete browser authorization. Enable Invompt for a conversation from + → Connectors.

Start login with: Select Connect for Invompt and complete the browser authorization.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Enable Invompt for this conversation from + → Connectors. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host custom-connector settings with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not Claude Desktop, use the matching host instructions instead.

## ChatGPT

Set up Invompt for me in ChatGPT.

Add the Invompt MCP connection with these steps:
1. Continue only on ChatGPT web in a Business or Enterprise/Edu workspace where Developer Mode access is enabled; Pro read/fetch-only access is insufficient for the complete Invompt workflow.
2. Enable Developer Mode and open Settings → Apps → Create.
3. Enter name Invompt and endpoint https://mcp.invompt.com/mcp, choose OAuth, select Scan Tools, complete authorization, wait for the scan to finish, then select Create.

Start login with: Select Scan Tools, complete browser authorization, wait for the scan, then select Create.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Open a new chat on the web and select the draft Invompt app from the tools menu. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host Developer Mode connector settings with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not ChatGPT, use the matching host instructions instead.

## Cursor

Set up Invompt for me in Cursor.

Add the Invompt MCP connection with these steps:
1. In the project, show the proposed .cursor/mcp.json change before writing this exact entry: {"mcpServers":{"invompt":{"type":"http","url":"https://mcp.invompt.com/mcp"}}}.
2. Enable Invompt and complete the browser authorization opened by Cursor. Do not add an API key or static headers.

Start login with: Enable Invompt and complete Cursor's browser authorization.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Cursor. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host MCP settings with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not Cursor, use the matching host instructions instead.

## VS Code / GitHub Copilot

Set up Invompt for me in VS Code / GitHub Copilot.

Add the Invompt MCP connection with these steps:
1. Open Command Palette → MCP: Add Server → HTTP.
2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.

Start login with: Start the server and accept the host-native OAuth/URL-handler handoff if shown.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh VS Code / GitHub Copilot. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use MCP: Add Server → HTTP with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not VS Code / GitHub Copilot, use the matching host instructions instead.

## Amazon Q Developer

Set up Invompt for me in Amazon Q Developer.

Add the Invompt MCP connection with these steps:
1. Open Amazon Q MCP settings and choose Add MCP server.
2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.

Start login with: Continue only if the host opens its native browser authorization; otherwise stop and report OAuth unavailable.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Amazon Q Developer. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host MCP settings with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not Amazon Q Developer, use the matching host instructions instead.

## Windsurf Cascade

Set up Invompt for me in Windsurf Cascade.

Add the Invompt MCP connection with these steps:
1. Open Windsurf MCP settings and choose Add remote server.
2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.
3. If the installed version does not offer native OAuth, stop and report unavailable; do not claim a successful connection.

Start login with: Use the host-native OAuth action for the Invompt remote connection.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Windsurf Cascade. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host MCP settings with the same HTTPS endpoint and report if OAuth is unavailable. If that is unavailable, show me the other supported apps.

If this is not Windsurf Cascade, use the matching host instructions instead.

## Cline

Set up Invompt for me in Cline.

Add the Invompt MCP connection with these steps:
1. Open Cline MCP settings and choose Add remote server.
2. Select Streamable HTTP, enter name invompt and endpoint https://mcp.invompt.com/mcp.
3. If native OAuth is unavailable, stop and report unavailable; do not claim a successful connection.

Start login with: Use the host-native OAuth action for the Invompt remote connection.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Cline. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host remote-MCP settings with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not Cline, use the matching host instructions instead.

## Gemini CLI

Set up Invompt for me in Gemini CLI.

Add the Invompt MCP connection with these steps:
1. gemini mcp add --transport http --scope user invompt https://mcp.invompt.com/mcp

Start login with: /mcp auth invompt

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Gemini CLI. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host MCP settings with the same HTTPS endpoint if the CLI route is unavailable. If that is unavailable, show me the other supported apps.

If this is not Gemini CLI, use the matching host instructions instead.
