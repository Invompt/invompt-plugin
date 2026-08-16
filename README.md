# Invompt agent plugin

Invompt helps you create, review, and revise billing documents in a conversation, then export an existing invoice as a PDF.

The package contains separate generated native manifests for Claude Code, Codex/OpenAI, and Kimi Code. Every host connects only to `https://mcp.invompt.com/mcp` and delegates authentication to host-native OAuth. It contains no credentials, static authentication headers, loopback configuration, development agents, commands, or hooks.

## Install in Claude Code

```sh
claude plugin marketplace add Invompt/invompt-plugin
claude plugin install invompt@invompt --scope user
```

## Install in Kimi Code

Run these slash commands in Kimi Code:

```text
/plugins install https://github.com/Invompt/invompt-plugin
/plugins reload
/mcp-config login invompt
/new
```

The repository's `kimi.plugin.json` and `.kimi-plugin/plugin.json` are byte-identical native Kimi manifests. Kimi Work marketplace submission is a separate Plugin Builder and review workflow. This package is **Available** source material; it is not **Verified** until a fresh Kimi host proves OAuth and one authorized non-ping operation.

- Website: https://invompt.com
- Privacy: https://invompt.com/privacy
- Terms: https://invompt.com/terms
- Support: https://invompt.com/contact
- Source: https://github.com/Invompt/invompt-plugin

Install only from an Invompt-controlled listing or repository. Start a fresh host session after installation or update.
