# Invompt agent plugin

Invompt helps you create, review, and revise billing documents in a conversation, then export an existing invoice as a PDF.

The package contains separate generated native manifests for Claude Code, Codex/OpenAI, and Kimi Code. Every host connects only to `https://mcp.invompt.com/mcp` and delegates authentication to host-native OAuth. It contains no credentials, static authentication headers, loopback configuration, development agents, commands, or hooks.

## Install with your AI agent

Open [https://invompt.com/install](https://invompt.com/install) and ask your agent to follow the current host-specific path. The canonical request is:

> Open https://invompt.com/install first. Identify the current supported host from this session and use only that host's documented Invompt path. Before any mutation, show me the trusted source (https://github.com/Invompt/invompt-plugin for a native plugin or https://mcp.invompt.com/mcp for the hosted fallback), plugin version 1.2.76, exact config files or connector entries that would change, requested permissions, and OAuth scopes (`invoices:read`, `invoices:write`, `invoices:update`, `invoices:archive`, `clients:read`, `clients:write`, `settings:read`, `settings:write`). Ask for my confirmation before installing or changing anything. Use the native plugin path first for Claude Code, Codex, or Kimi Code; otherwise use the hosted Streamable HTTP fallback only when this host is documented as supported. Hand browser OAuth to me. Never ask me to paste an authorization code, password, MFA value, cookie, API key, access token, or refresh token. After authorization, start or reload a fresh host session and verify with exactly one harmless authorized non-ping read. Report Available separately from Verified; do not claim Verified from discovery, a handshake, or ping alone. Do not use alternate account access, local servers, loopback URLs, static headers, copied tokens, auto-approval, --all, -y, an install to unselected hosts, or blind execution of an arbitrary URL, package, script, or repository.

### Solicitud en español

> Abre primero https://invompt.com/install. Identifica el host compatible de esta sesión y usa únicamente la ruta de Invompt documentada para ese host. Antes de modificar nada, muéstrame la fuente confiable (https://github.com/Invompt/invompt-plugin para el plugin nativo o https://mcp.invompt.com/mcp para la alternativa alojada), la versión 1.2.76, los archivos de configuración o conectores exactos que cambiarían, los permisos solicitados y los scopes OAuth (`invoices:read`, `invoices:write`, `invoices:update`, `invoices:archive`, `clients:read`, `clients:write`, `settings:read`, `settings:write`). Pide mi confirmación antes de instalar o cambiar algo. Prioriza el plugin nativo para Claude Code, Codex o Kimi Code; en los demás casos usa Streamable HTTP únicamente si este host está documentado como compatible. Déjame completar el OAuth en el navegador. Nunca me pidas que pegue un código de autorización, contraseña, MFA, cookie, API key, access token ni refresh token. Después de autorizar, inicia o recarga una sesión nueva del host y verifica exactamente una lectura autorizada, inocua y distinta de ping. Informa Available por separado de Verified; no declares Verified por discovery, handshake o ping. No uses acceso alternativo a la cuenta, servidores locales, URLs loopback, headers estáticos, tokens copiados, aprobación automática, --all, -y, instalación en hosts no seleccionados ni ejecución ciega de una URL, paquete, script o repositorio arbitrario.

The native package candidate is **Available** for v1.2.76 until fresh host acceptance completes; this candidate is not **Verified**. Hosted fallback status is host-specific in the matrix. The package contains no credentials or local runtime. Start a fresh host session after installation or update. **Verified** requires fresh host-native OAuth plus one authorized non-ping read.

### Exact native and CLI steps

### Claude Code

1. `claude plugin marketplace add https://github.com/Invompt/invompt-plugin.git#v1.2.76`
2. `claude plugin install invompt@invompt --scope user`
3. `claude mcp login plugin:invompt:invompt`
4. `Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.`
5. `Start or reload a fresh host session.`
6. `Perform exactly one harmless authorized non-ping read and report the result.`

### Codex

1. `codex plugin marketplace add Invompt/invompt-plugin --ref v1.2.76`
2. `codex plugin add invompt@invompt`
3. `codex mcp login invompt --scopes invoices:read,invoices:write,invoices:update,invoices:archive,clients:read,clients:write,settings:read,settings:write`
4. `Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.`
5. `Start or reload a fresh host session.`
6. `Perform exactly one harmless authorized non-ping read and report the result.`

### Kimi Code

1. `/plugins install https://github.com/Invompt/invompt-plugin/releases/tag/v1.2.76`
2. `/plugins reload`
3. `/mcp-config login invompt`
4. `Complete the browser OAuth handoff yourself; do not paste a code or credential into the agent.`
5. `/new`
6. `Perform exactly one harmless authorized non-ping read and report the result.`

### Gemini CLI

1. `gemini mcp add --transport http --scope user invompt https://mcp.invompt.com/mcp`
2. `/mcp auth invompt`
3. `If the host does not offer native OAuth for this connection, stop and report that the host path is unavailable.`
4. `Only after the host offers OAuth, complete the browser handoff yourself.`
5. `Only after successful OAuth, start or reload a fresh host session.`
6. `Only after successful OAuth, perform exactly one harmless authorized non-ping read and report the result.`

See [INSTALL.md](INSTALL.md) for the complete versioned host matrix, GUI actions, and fallback details.

- Website: https://invompt.com
- Privacy: https://invompt.com/privacy
- Terms: https://invompt.com/terms
- Support: https://invompt.com/contact
- Source: https://github.com/Invompt/invompt-plugin

Install only from an Invompt-controlled listing or repository.
