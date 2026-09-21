# Invompt agent plugin

Create invoices from your AI assistant and review them before sending.

Start without creating an account. Create one later and keep all your invoices.

## Install

1. Open the [installation guide](https://invompt.com/install) and choose your AI assistant.
2. Complete the required OAuth connection in your browser. Choose **Continue without an account**, **Sign in**, or **Create account**. **Deny** remains available.
3. Return to your assistant and describe the invoice you need.

The plugin connects to Invompt's hosted MCP service at `https://mcp.invompt.com/mcp`. OAuth is required; you do not need to run a local server or supply an API key.

## Features

- Create invoices, quotes, estimates, and pro formas from a conversation.
- Review a hosted link and request changes to the selected document.
- Reuse saved clients and settings.
- Open an existing hosted invoice to download its PDF.

## Try it

> Create an invoice for Alex: 10 hours of design work at $80 per hour.

> Show me the invoice so I can review it.

> Change the payment terms to 14 days.

## Accounts and access

Use the link from your current connection to create an account and keep your existing invoices. Invompt can then attach that connection's invoices to the account you create; it does not discover or merge unrelated histories. Sending invoices by email requires a registered account.

## Security

OAuth is completed in your browser. Never share passwords, credentials, or private invoice links in chat.

## Resources

- [Installation guide](https://invompt.com/install)
- [Invompt](https://www.invompt.com)
- [MCP repository](https://github.com/Invompt/invompt-mcp)
- [Support](https://www.invompt.com/contact)
- [Privacy](https://www.invompt.com/privacy)

## License

[MIT](https://github.com/Invompt/invompt-plugin/blob/main/LICENSE).
