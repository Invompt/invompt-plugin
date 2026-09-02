# Invompt agent plugin

Invompt helps you create, review, and revise billing documents in a conversation, then export an existing invoice as a PDF.

The package contains separate generated native manifests for Claude Code, Codex/OpenAI, and Kimi Code. Every host connects only to `https://mcp.invompt.com/mcp` and delegates authentication to host-native OAuth. It contains no credentials, static authentication headers, loopback configuration, development agents, commands, or hooks.

## Install with your AI agent

Ask your agent to detect its host ID and language, then retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=<detected-host-id>&lang=<en|es>`. The agent must not open a browser to read installation instructions; the browser is only for the later user-owned OAuth handoff. The canonical request is:

> Detect this session's supported host ID and language (en or es), then retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=<detected-host-id>&lang=<en|es>`. Do not open a browser to read installation instructions; use a browser only later for the user-owned OAuth handoff. Before any mutation, show me the trusted source (https://github.com/Invompt/invompt-plugin for a native plugin or https://mcp.invompt.com/mcp for the hosted fallback), installable published version 1.2.78, candidate version 1.2.78, exact config files or connector entries that would change, and requested permissions. Ask for my confirmation before installing or changing anything. Use the native plugin path first for Claude Code, Codex, or Kimi Code; otherwise use the hosted Streamable HTTP fallback only when this host is documented as supported. Hand browser OAuth to me. Never ask me to paste an authorization code, password, MFA value, cookie, API key, access token, or refresh token. After authorization, start or reload a fresh host session and verify with exactly one harmless authorized non-ping read. Report Available separately from Verified; do not claim Verified from discovery, a handshake, or ping alone. Do not use alternate account access, local servers, loopback URLs, static headers, copied tokens, auto-approval, --all, -y, an install to unselected hosts, or blind execution of an arbitrary URL, package, script, or repository.

### Solicitud en español

> Detecta el ID del host compatible de esta sesión y el idioma (en o es), y obtén las instrucciones autoritativas mediante una solicitud HTTP GET ordinaria a `https://invompt.com/install.md?host=<detected-host-id>&lang=<en|es>`. No abras un navegador para leer las instrucciones de instalación; usa el navegador únicamente más adelante para el OAuth controlado por el usuario. Antes de modificar nada, muéstrame la fuente confiable (https://github.com/Invompt/invompt-plugin para el plugin nativo o https://mcp.invompt.com/mcp para la alternativa alojada), la versión publicada instalable 1.2.78, la versión candidata 1.2.78, los archivos de configuración o conectores exactos que cambiarían y los permisos solicitados. Pide mi confirmación antes de instalar o cambiar algo. Prioriza el plugin nativo para Claude Code, Codex o Kimi Code; en los demás casos usa Streamable HTTP únicamente si este host está documentado como compatible. Déjame completar el OAuth en el navegador. Nunca me pidas que pegue un código de autorización, contraseña, MFA, cookie, API key, access token ni refresh token. Después de autorizar, inicia o recarga una sesión nueva del host y verifica exactamente una lectura autorizada, inocua y distinta de ping. Informa Available por separado de Verified; no declares Verified por discovery, handshake o ping. No uses acceso alternativo a la cuenta, servidores locales, URLs loopback, headers estáticos, tokens copiados, aprobación automática, --all, -y, instalación en hosts no seleccionados ni ejecución ciega de una URL, paquete, script o repositorio arbitrario.

The installable native plugin version is the published tag **v1.2.78**. Version v1.2.78 is published and installable; host verification remains separate. Hosted fallback status is host-specific in the matrix. The package contains no credentials or local runtime. Start a genuinely fresh host session after installation or update. **Verified** requires fresh host-native OAuth plus one authorized non-ping read.

### Exact native and CLI steps

### Claude Code

1. `claude plugin marketplace add https://github.com/Invompt/invompt-plugin.git#v1.2.78`
2. `claude plugin install invompt@invompt --scope user`
3. `claude mcp login plugin:invompt:invompt`
4. `Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.`
5. `Start or reload a fresh host session.`
6. `Perform exactly one harmless authorized non-ping read and report the result.`

Agent request:

> Install Invompt only for Claude Code. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=claude-code&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Claude Code, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://github.com/Invompt/invompt-plugin at published tag v1.2.78. Version v1.2.78 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://github.com/Invompt/invompt-plugin at published tag v1.2.78
> - Proposed configuration: User-scoped native plugin plus the host OAuth entry for the Invompt MCP connection.
> - Permissions: The host requests Invompt access automatically; no static credential is added.
> - Configuration steps:
> 1. claude plugin marketplace add https://github.com/Invompt/invompt-plugin.git#v1.2.78
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

1. `codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.78`
2. `codex plugin add invompt@invompt`
3. `codex mcp login invompt`
4. `Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.`
5. `Start or reload a fresh host session.`
6. `Perform exactly one harmless authorized non-ping read and report the result.`

Agent request:

> Install Invompt only for Codex. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=codex&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Codex, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://github.com/Invompt/invompt-plugin at published tag v1.2.78. Version v1.2.78 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://github.com/Invompt/invompt-plugin at published tag v1.2.78
> - Proposed configuration: User-scoped Codex config.toml entries [marketplaces.invompt] pinned to the reviewed published tag and [plugins."invompt@invompt"] enabled=true; the plugin cache supplies one HTTPS MCP connection named invompt.
> - Permissions: The host requests Invompt access automatically; no API key or static header is added.
> - Configuration steps:
> 1. codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.78
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

1. `/plugins install https://github.com/Invompt/invompt-plugin/releases/tag/v1.2.78`
2. `/plugins reload`
3. `/mcp-config login invompt`
4. `Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.`
5. `/new`
6. `Perform exactly one harmless authorized non-ping read and report the result.`

Agent request:

> Install Invompt only for Kimi Code. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=kimi-code&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Kimi Code, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://github.com/Invompt/invompt-plugin at published tag v1.2.78. Version v1.2.78 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
> 
> 2. Concrete approval. Before changing anything, show me this summary:
> - Source: https://github.com/Invompt/invompt-plugin at published tag v1.2.78
> - Proposed configuration: The native Kimi manifest and one host-scoped Invompt MCP connection named invompt.
> - Permissions: The host requests Invompt access automatically; no API key or static header is added.
> - Configuration steps:
> 1. /plugins install https://github.com/Invompt/invompt-plugin/releases/tag/v1.2.78
> 2. /plugins reload
> - Exact OAuth start: /mcp-config login invompt
> Explain which user files or entries will change and that unrelated existing configuration will be preserved. Then ask exactly: "Proceed with this Kimi Code Invompt installation?" Do not continue until I confirm.
> 
> 3. Confirmed installation. Only after my confirmation, run the configuration steps above in order and only for Kimi Code; do not start OAuth yet. Do not use --all, -y, auto-approval, static headers, local servers, loopback URLs, or an improvised fallback. If a command is unavailable or the host cannot offer native OAuth, stop and report the exact state.
> 
> 4. User-owned OAuth. Start OAuth only with this step: /mcp-config login invompt. Hand the browser flow to me. Never request or accept authorization codes, passwords, MFA values, cookies, API keys, access tokens, or refresh tokens. Wait for me to report that the browser flow finished; opening a URL is not success.
> 
> 5. Fresh verification. After OAuth, tell me to open a genuinely new Kimi Code session; the current session does not count. In that session perform exactly one authorized read-only list_invoices call, without creating, updating, or archiving anything. Claim Verified only if that real call succeeds. Report published-route Available, installation/configuration, OAuth, and verification separately. Discovery, a handshake, or ping does not count as Verified.

### Gemini CLI

1. `gemini mcp add --transport http --scope user invompt https://mcp.invompt.com/mcp`
2. `/mcp auth invompt`
3. `If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.`
4. `Only after the host offers OAuth, complete the browser handoff yourself.`
5. `Only after successful OAuth, start or reload a fresh host session.`
6. `Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result.`

Agent request:

> Install Invompt only for Gemini CLI. First retrieve the authoritative instructions with an ordinary HTTP GET request to `https://invompt.com/install.md?host=gemini-cli&lang=en`. Do not open a browser to read installation instructions; use a browser only in phase 4 for the user-owned OAuth handoff. If this session is not running in Gemini CLI, stop without changing anything and explain the mismatch.
> 
> 1. Read-only review. Do not run setup commands or change configuration yet. Verify by read-only inspection that the exact source exists: https://mcp.invompt.com/mcp. Version v1.2.78 is published and is the only native tag permitted by this request. If the published source is missing or this host cannot provide native OAuth for this connection, stop without changes.
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

See [INSTALL.md](INSTALL.md) for the complete versioned host matrix, GUI actions, and fallback details. The human guide remains available at [https://invompt.com/install](https://invompt.com/install).

- Website: https://invompt.com
- Privacy: https://invompt.com/privacy
- Terms: https://invompt.com/terms
- Support: https://invompt.com/contact
- Source: https://github.com/Invompt/invompt-plugin

Install only from an Invompt-controlled listing or repository.
