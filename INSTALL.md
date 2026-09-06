# Invompt agent installation contract

**Machine entrypoint:** detect the current host ID and language, then retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=<detected-host-id>&lang=<en|es>`. The `host` query parameter selects one documented host ID from the matrix below; `lang` must be `en` or `es`. Do not open a browser to read installation instructions. A browser is used only later for the user-owned OAuth handoff.

Contract version: 3. Candidate consumer plugin version: 1.2.81. Published installable native version: 1.2.81.

The agent must show the exact trusted source and proposed changes, ask before mutation, hand browser OAuth to the user, start a genuinely fresh session, and verify one harmless authorized non-ping read. The human guide is [https://invompt.com/install](https://invompt.com/install); agents use the GET entrypoint above.

## Canonical agent request

> Detect this session's supported host ID and language (en or es), then retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=<detected-host-id>&lang=<en|es>`. Do not open a browser to read installation instructions; use a browser only later for the user-owned OAuth handoff. Before any mutation, show me the trusted source (https://github.com/Invompt/invompt-plugin for a native plugin or https://mcp.invompt.com/mcp for the hosted fallback), installable published version 1.2.81, candidate version 1.2.81, exact config files or connector entries that would change, and requested permissions. Ask for my confirmation before installing or changing anything. Use the native plugin path first for Claude Code, Codex, or Kimi Code; otherwise use the hosted Streamable HTTP fallback only when this host is documented as supported. Hand browser OAuth to me. Never ask me to paste an authorization code, password, MFA value, cookie, API key, access token, or refresh token. After authorization, start or reload a fresh host session and verify with exactly one harmless authorized non-ping read. Report Available separately from Verified; do not claim Verified from discovery, a handshake, or ping alone. Do not use alternate account access, local servers, loopback URLs, static headers, copied tokens, auto-approval, --all, -y, an install to unselected hosts, or blind execution of an arbitrary URL, package, script, or repository.

## Solicitud canónica para el agente

> Detecta el ID del host compatible de esta sesión y el idioma (en o es), y obtén las instrucciones autoritativas mediante una solicitud HTTP GET ordinaria a `https://invompt.com/install.md?host=<detected-host-id>&lang=<en|es>`. No abras un navegador para leer las instrucciones de instalación; usa el navegador únicamente más adelante para el OAuth controlado por el usuario. Antes de modificar nada, muéstrame la fuente confiable (https://github.com/Invompt/invompt-plugin para el plugin nativo o https://mcp.invompt.com/mcp para la alternativa alojada), la versión publicada instalable 1.2.81, la versión candidata 1.2.81, los archivos de configuración o conectores exactos que cambiarían y los permisos solicitados. Pide mi confirmación antes de instalar o cambiar algo. Prioriza el plugin nativo para Claude Code, Codex o Kimi Code; en los demás casos usa Streamable HTTP únicamente si este host está documentado como compatible. Déjame completar el OAuth en el navegador. Nunca me pidas que pegue un código de autorización, contraseña, MFA, cookie, API key, access token ni refresh token. Después de autorizar, inicia o recarga una sesión nueva del host y verifica exactamente una lectura autorizada, inocua y distinta de ping. Informa Available por separado de Verified; no declares Verified por discovery, handshake o ping. No uses acceso alternativo a la cuenta, servidores locales, URLs loopback, headers estáticos, tokens copiados, aprobación automática, --all, -y, instalación en hosts no seleccionados ni ejecución ciega de una URL, paquete, script o repositorio arbitrario.

## Host-specific requests

### Claude Code

> Install Invompt only for Claude Code. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=claude-code&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Claude Code, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://github.com/Invompt/invompt-plugin at published tag v1.2.81. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://github.com/Invompt/invompt-plugin at published tag v1.2.81
> - Proposed configuration: User-scoped native plugin plus the host OAuth entry for the Invompt MCP connection.
> - Permissions: The host requests Invompt access automatically; no static credential is added.
> - Configuration steps:
> 1. claude plugin marketplace add https://github.com/Invompt/invompt-plugin.git#v1.2.81
> 2. claude plugin install invompt@invompt --scope user
> - Exact OAuth start: claude mcp login plugin:invompt:invompt
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Claude Code Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Claude Code; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: claude mcp login plugin:invompt:invompt. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Claude Code session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Codex

> Install Invompt only for Codex. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=codex&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Codex, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://github.com/Invompt/invompt-plugin at published tag v1.2.81. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://github.com/Invompt/invompt-plugin at published tag v1.2.81
> - Proposed configuration: User-scoped Codex config.toml entries [marketplaces.invompt] pinned to the reviewed published tag and [plugins."invompt@invompt"] enabled=true; the plugin cache supplies one HTTPS MCP connection named invompt.
> - Permissions: The host requests Invompt access automatically; no API key or static header is added.
> - Configuration steps:
> 1. codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.81
> 2. codex plugin add invompt@invompt
> - Exact OAuth start: codex mcp login invompt
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Codex Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Codex; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: codex mcp login invompt. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Codex session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Kimi Code

> Install Invompt only for Kimi Code. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=kimi-code&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Kimi Code, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://github.com/Invompt/invompt-plugin at published tag v1.2.81. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://github.com/Invompt/invompt-plugin at published tag v1.2.81
> - Proposed configuration: The native Kimi manifest and one host-scoped Invompt MCP connection named invompt.
> - Permissions: The host requests Invompt access automatically; no API key or static header is added.
> - Configuration steps:
> 1. /plugins install https://github.com/Invompt/invompt-plugin/releases/tag/v1.2.81
> 2. /plugins reload
> - Exact OAuth start: /mcp-config login invompt
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Kimi Code Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Kimi Code; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: /mcp-config login invompt. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Kimi Code session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Claude Desktop

> Install Invompt only for Claude Desktop. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=claude-desktop&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Claude Desktop, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One remote HTTP connector named Invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically through its connector flow.
> - Configuration steps:
> 1. Open Settings → Connectors → Add custom connector.
> 2. Enter name Invompt and endpoint https://mcp.invompt.com/mcp.
> - Exact OAuth start: Select the host OAuth option and connect.
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Claude Desktop Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Claude Desktop; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: Select the host OAuth option and connect. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Claude Desktop session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### ChatGPT

> Install Invompt only for ChatGPT. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=chatgpt&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in ChatGPT, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One remote MCP app/connector named Invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically through its connector flow.
> - Configuration steps:
> 1. Enable Developer Mode and open Settings → Apps → Create.
> 2. Enter name Invompt and endpoint https://mcp.invompt.com/mcp.
> - Exact OAuth start: Select OAuth, create the app, and scan tools only after the host shows the expected endpoint.
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this ChatGPT Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for ChatGPT; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: Select OAuth, create the app, and scan tools only after the host shows the expected endpoint. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new ChatGPT session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Cursor

> Install Invompt only for Cursor. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=cursor&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Cursor, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One remote HTTP MCP entry named invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically through its native login.
> - Configuration steps:
> 1. In the project, show the proposed .cursor/mcp.json change before writing this exact entry: {"mcpServers":{"invompt":{"type":"http","url":"https://mcp.invompt.com/mcp"}}}.
> - Exact OAuth start: Enable the Invompt server and choose the host-native login prompt.
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Cursor Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Cursor; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: Enable the Invompt server and choose the host-native login prompt. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Cursor session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### VS Code / GitHub Copilot

> Install Invompt only for VS Code / GitHub Copilot. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=vscode-copilot&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in VS Code / GitHub Copilot, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One remote HTTP MCP entry named invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically through its native login.
> - Configuration steps:
> 1. Open Command Palette → MCP: Add Server → HTTP.
> 2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.
> - Exact OAuth start: Start the server and accept the host-native OAuth/URL-handler handoff if shown.
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this VS Code / GitHub Copilot Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for VS Code / GitHub Copilot; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: Start the server and accept the host-native OAuth/URL-handler handoff if shown. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new VS Code / GitHub Copilot session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Amazon Q Developer

> Install Invompt only for Amazon Q Developer. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=amazon-q&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Amazon Q Developer, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One remote HTTP MCP entry named invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically through its native login.
> - Configuration steps:
> 1. Open Amazon Q MCP settings and choose Add MCP server.
> 2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.
> - Exact OAuth start: Continue only if the host opens its native browser authorization; otherwise stop and report OAuth unavailable.
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Amazon Q Developer Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Amazon Q Developer; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: Continue only if the host opens its native browser authorization; otherwise stop and report OAuth unavailable. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Amazon Q Developer session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Windsurf Cascade

> Install Invompt only for Windsurf Cascade. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=windsurf&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Windsurf Cascade, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One remote HTTP MCP entry named invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically when supported by the installed version.
> - Configuration steps:
> 1. Open Windsurf MCP settings and choose Add remote server.
> 2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.
> 3. If the installed version does not offer native OAuth, stop and report unavailable; do not claim a successful connection.
> - Exact OAuth start: Use the host-native OAuth action for the Invompt remote connection.
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Windsurf Cascade Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Windsurf Cascade; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: Use the host-native OAuth action for the Invompt remote connection. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Windsurf Cascade session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Cline

> Install Invompt only for Cline. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=cline&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Cline, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One remote Streamable HTTP MCP entry named invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically when its installed version supports it.
> - Configuration steps:
> 1. Open Cline MCP settings and choose Add remote server.
> 2. Select Streamable HTTP, enter name invompt and endpoint https://mcp.invompt.com/mcp.
> 3. If native OAuth is unavailable, stop and report unavailable; do not claim a successful connection.
> - Exact OAuth start: Use the host-native OAuth action for the Invompt remote connection.
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Cline Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Cline; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: Use the host-native OAuth action for the Invompt remote connection. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Cline session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Gemini CLI

> Install Invompt only for Gemini CLI. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=gemini-cli&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Gemini CLI, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.81 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://mcp.invompt.com/mcp
> - Proposed configuration: One user-scoped remote HTTP MCP entry named invompt; no local command or loopback server.
> - Permissions: The host requests Invompt access automatically through its native login.
> - Configuration steps:
> 1. gemini mcp add --transport http --scope user invompt https://mcp.invompt.com/mcp
> - Exact OAuth start: /mcp auth invompt
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Gemini CLI Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Gemini CLI; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: /mcp auth invompt. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Gemini CLI session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

## Host matrix

| Host | Route | Trusted source or endpoint | Route status | Verified through | Config changes | Permissions | OAuth handoff | Exact steps | Fallback |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Code | native plugin | https://github.com/Invompt/invompt-plugin at published tag v1.2.81 | **Available** | 1.2.75 | User-scoped native plugin plus the host OAuth entry for the Invompt MCP connection. | The host requests Invompt access automatically; no static credential is added. | Complete the browser handoff started by `claude mcp login plugin:invompt:invompt`. | 1. claude plugin marketplace add https://github.com/Invompt/invompt-plugin.git#v1.2.81<br>2. claude plugin install invompt@invompt --scope user<br>3. claude mcp login plugin:invompt:invompt<br>4. Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.<br>5. Start or reload a fresh host session.<br>6. Perform exactly one harmless authorized non-ping read and report the result. | Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. |
| Codex | native plugin | https://github.com/Invompt/invompt-plugin at published tag v1.2.81 | **Available** | 1.2.75 | User-scoped Codex config.toml entries [marketplaces.invompt] pinned to the reviewed published tag and [plugins."invompt@invompt"] enabled=true; the plugin cache supplies one HTTPS MCP connection named invompt. | The host requests Invompt access automatically; no API key or static header is added. | Complete the browser handoff from the host-native MCP login flow. | 1. codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.81<br>2. codex plugin add invompt@invompt<br>3. codex mcp login invompt<br>4. Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.<br>5. Start or reload a fresh host session.<br>6. Perform exactly one harmless authorized non-ping read and report the result. | Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. |
| Kimi Code | native plugin | https://github.com/Invompt/invompt-plugin at published tag v1.2.81 | **Available** | Not verified | The native Kimi manifest and one host-scoped Invompt MCP connection named invompt. | The host requests Invompt access automatically; no API key or static header is added. | Complete the browser handoff from the host-native `/mcp-config` login flow. | 1. /plugins install https://github.com/Invompt/invompt-plugin/releases/tag/v1.2.81<br>2. /plugins reload<br>3. /mcp-config login invompt<br>4. Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.<br>5. /new<br>6. Perform exactly one harmless authorized non-ping read and report the result. | Use the host remote-MCP path for `https://mcp.invompt.com/mcp` if the native plugin route is unavailable. |
| Claude Desktop | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Available** | Not verified | One remote HTTP connector named Invompt; no local command or loopback server. | The host requests Invompt access automatically through its connector flow. | Complete the host-native browser authorization when the connector asks to sign in. | 1. Open Settings → Connectors → Add custom connector.<br>2. Enter name Invompt and endpoint https://mcp.invompt.com/mcp.<br>3. Select the host OAuth option and connect.<br>4. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>5. Only after the host offers OAuth, complete the browser handoff yourself.<br>6. Only after successful OAuth, start or reload a fresh host session.<br>7. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use the host custom-connector settings with the same HTTPS endpoint. |
| ChatGPT | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Available** | Not verified | One remote MCP app/connector named Invompt; no local command or loopback server. | The host requests Invompt access automatically through its connector flow. | Complete the host-native browser authorization, then let the host finish tool discovery. | 1. Enable Developer Mode and open Settings → Apps → Create.<br>2. Enter name Invompt and endpoint https://mcp.invompt.com/mcp.<br>3. Select OAuth, create the app, and scan tools only after the host shows the expected endpoint.<br>4. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>5. Only after the host offers OAuth, complete the browser handoff yourself.<br>6. Only after successful OAuth, start or reload a fresh host session.<br>7. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use the host Developer Mode connector settings with the same HTTPS endpoint. |
| Cursor | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Available** | Not verified | One remote HTTP MCP entry named invompt; no local command or loopback server. | The host requests Invompt access automatically through its native login. | Complete the host-native browser authorization when Cursor shows its login prompt. | 1. In the project, show the proposed .cursor/mcp.json change before writing this exact entry: {"mcpServers":{"invompt":{"type":"http","url":"https://mcp.invompt.com/mcp"}}}.<br>2. Enable the Invompt server and choose the host-native login prompt.<br>3. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>4. Only after the host offers OAuth, complete the browser handoff yourself.<br>5. Only after successful OAuth, start or reload a fresh host session.<br>6. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use the host MCP settings with the same HTTPS endpoint. |
| VS Code / GitHub Copilot | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Available** | Not verified | One remote HTTP MCP entry named invompt; no local command or loopback server. | The host requests Invompt access automatically through its native login. | Complete the host-native browser authorization and URL-handler handoff if shown. | 1. Open Command Palette → MCP: Add Server → HTTP.<br>2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.<br>3. Start the server and accept the host-native OAuth/URL-handler handoff if shown.<br>4. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>5. Only after the host offers OAuth, complete the browser handoff yourself.<br>6. Only after successful OAuth, start or reload a fresh host session.<br>7. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use MCP: Add Server → HTTP with the same HTTPS endpoint. |
| Amazon Q Developer | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Available** | Not verified | One remote HTTP MCP entry named invompt; no local command or loopback server. | The host requests Invompt access automatically through its native login. | Complete the browser authorization opened by the host when required. | 1. Open Amazon Q MCP settings and choose Add MCP server.<br>2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.<br>3. Continue only if the host opens its native browser authorization; otherwise stop and report OAuth unavailable.<br>4. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>5. Only after the host offers OAuth, complete the browser handoff yourself.<br>6. Only after successful OAuth, start or reload a fresh host session.<br>7. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use the host MCP settings with the same HTTPS endpoint. |
| Windsurf Cascade | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Host check required** | Not verified | One remote HTTP MCP entry named invompt; no local command or loopback server. | The host requests Invompt access automatically when supported by the installed version. | Complete the host-native browser authorization if the installed version supports remote OAuth. | 1. Open Windsurf MCP settings and choose Add remote server.<br>2. Enter name invompt and endpoint https://mcp.invompt.com/mcp.<br>3. If the installed version does not offer native OAuth, stop and report unavailable; do not claim a successful connection.<br>4. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>5. Only after the host offers OAuth, complete the browser handoff yourself.<br>6. Only after successful OAuth, start or reload a fresh host session.<br>7. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use the host MCP settings with the same HTTPS endpoint and report if OAuth is unavailable. |
| Cline | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Host check required** | Not verified | One remote Streamable HTTP MCP entry named invompt; no local command or loopback server. | The host requests Invompt access automatically when its installed version supports it. | Complete the host-native browser authorization if offered; otherwise report OAuth as unavailable. | 1. Open Cline MCP settings and choose Add remote server.<br>2. Select Streamable HTTP, enter name invompt and endpoint https://mcp.invompt.com/mcp.<br>3. If native OAuth is unavailable, stop and report unavailable; do not claim a successful connection.<br>4. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>5. Only after the host offers OAuth, complete the browser handoff yourself.<br>6. Only after successful OAuth, start or reload a fresh host session.<br>7. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use the host remote-MCP settings with the same HTTPS endpoint. |
| Gemini CLI | hosted Streamable HTTP fallback | https://mcp.invompt.com/mcp | **Available** | Not verified | One user-scoped remote HTTP MCP entry named invompt; no local command or loopback server. | The host requests Invompt access automatically through its native login. | Complete the browser authorization from `/mcp auth invompt`. | 1. gemini mcp add --transport http --scope user invompt https://mcp.invompt.com/mcp<br>2. /mcp auth invompt<br>3. If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.<br>4. Only after the host offers OAuth, complete the browser handoff yourself.<br>5. Only after successful OAuth, start or reload a fresh host session.<br>6. Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result. | Use the host MCP settings with the same HTTPS endpoint if the CLI route is unavailable. |

## Publication and verification status

Published tag v1.2.81 is the native version this contract permits an agent to install. Publication does not establish host verification. A **Host check required** entry must stop unless the installed host exposes native OAuth for this connection. Claude Code and Codex have prior verification only through v1.2.75; that evidence does not transfer to another host or version.

## Boundaries

- The native plugin route is first for Claude Code, Codex, and Kimi Code.
- The hosted fallback is Streamable HTTP at [https://mcp.invompt.com/mcp](https://mcp.invompt.com/mcp) and is used only for a documented supported host.
- OAuth is host-native. The user completes browser sign-in; the agent must not receive or print secrets.
- Invompt permissions are requested automatically through the host-native OAuth flow.
- Never use alternate account access; never use API key; never use static headers; never use local servers; never use loopback URLs; never use copied tokens; never use auto-approval; never use --all; never use -y; never use unselected hosts; never use blind execution of an arbitrary URL, package, script, or repository. Broad host selection and auto-approval are forbidden.

## Status and provenance

**Available** means the host documents a compatible route and authentication path for the published version or endpoint. **Host check required** means the installed host must first demonstrate native OAuth support; it is not an availability claim. **Verified** means this exact host completed fresh OAuth and one authorized non-ping read in a genuinely fresh session. Record the installed published version, candidate version, trusted source or endpoint, exact source SHA when available, generated file hashes, host, and verification result. Do not transfer verification from another host.

The consumer source is [https://github.com/Invompt/invompt-plugin](https://github.com/Invompt/invompt-plugin); the hosted endpoint is [https://mcp.invompt.com/mcp](https://mcp.invompt.com/mcp).
