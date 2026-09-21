# Install Invompt

Identify the AI app you are running in and use one matching section below. If you cannot identify it, show the user the available apps and ask which one they use.

## Claude Code

Set up Invompt for me in Claude Code.

Run these commands in the terminal. The plugin includes the Invompt MCP connection:
1. claude plugin marketplace add https://github.com/Invompt/invompt-plugin.git#v1.2.84
2. claude plugin install invompt@invompt --scope user

Start login with: claude mcp login plugin:invompt:invompt

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Claude Code. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. If that is unavailable, show me the other supported apps.

If this is not Claude Code, use the matching host instructions instead.

## Codex

Set up Invompt for me in Codex.

Run these commands in the terminal. The plugin includes the Invompt MCP connection:
1. codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.84
2. codex plugin add invompt@invompt

Start login with: codex mcp login invompt

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to quit and reopen Codex Desktop, or restart the Codex CLI process. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. If that is unavailable, show me the other supported apps.

If this is not Codex, use the matching host instructions instead.

## Kimi Code

Set up Invompt for me in Kimi Code.

Run these setup steps in Kimi Code:
1. /plugins install https://github.com/Invompt/invompt-plugin/releases/tag/v1.2.84
2. /plugins reload

Start login with: /mcp-config login invompt

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to start a new Kimi Code session with `/new`. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. If that is unavailable, show me the other supported apps.

If this is not Kimi Code, use the matching host instructions instead.

## Claude Desktop

Set up Invompt for me in Claude Desktop.

Add the Invompt MCP connection with these steps:
1. Open Settings → Connectors → Add custom connector.
2. Enter name Invompt and endpoint https://mcp.invompt.com/mcp.

Start login with: Select the host OAuth option and connect.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh Claude Desktop. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host custom-connector settings with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not Claude Desktop, use the matching host instructions instead.

## ChatGPT

Set up Invompt for me in ChatGPT.

Add the Invompt MCP connection with these steps:
1. Enable Developer Mode and open Settings → Apps → Create.
2. Enter name Invompt and endpoint https://mcp.invompt.com/mcp.

Start login with: Select OAuth, create the app, and scan tools only after the host shows the expected endpoint.

OAuth is required. During the connection flow, choose Continue without an account, Sign in, Create account, or Deny. Guide me through the browser connection and wait until I finish. Tell me to restart or refresh ChatGPT. In the fresh session, verify that Invompt works with a read-only `list_invoices` call.

If something fails, explain the error and retry only the failed step. If I want another option, offer this documented alternative: Use the host Developer Mode connector settings with the same HTTPS endpoint. If that is unavailable, show me the other supported apps.

If this is not ChatGPT, use the matching host instructions instead.

## Cursor

Set up Invompt for me in Cursor.

Add the Invompt MCP connection with these steps:
1. In the project, show the proposed .cursor/mcp.json change before writing this exact entry: {"mcpServers":{"invompt":{"type":"http","url":"https://mcp.invompt.com/mcp"}}}.

Start login with: Enable the Invompt server and choose the host-native login prompt.

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
