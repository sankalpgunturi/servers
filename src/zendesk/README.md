# Zendesk MCP Server

A Model Context Protocol server for Zendesk.

This server provides a comprehensive integration with Zendesk. It offers:

- Tools for retrieving and managing Zendesk tickets and comments
- Specialized prompts for ticket analysis and response drafting
- Full access to the Zendesk Help Center articles as knowledge base

## Installation

You can use this package directly with npx:

```bash
npx -y @sankalpgunturi/server-zendesk
```

Or install it globally:

```bash
npm install -g @sankalpgunturi/server-zendesk
```

## Configuration

### Environment Variables

The following environment variables are required:

- `ZENDESK_SUBDOMAIN`: Your Zendesk subdomain (e.g., `mycompany` for `mycompany.zendesk.com`)
- `ZENDESK_EMAIL`: Your Zendesk email address
- `ZENDESK_API_KEY`: Your Zendesk API key

You can set these in a `.env` file or directly in your environment.

### Claude Desktop Configuration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "zendesk": {
      "command": "npx",
      "args": ["-y", "@sankalpgunturi/server-zendesk"],
      "env": {
        "ZENDESK_SUBDOMAIN": "your-subdomain",
        "ZENDESK_EMAIL": "your-email",
        "ZENDESK_API_KEY": "your-api-key"
      }
    }
  }
}
```

### VS Code Configuration

For VS Code, add the following to your settings:

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "zendesk_subdomain",
        "description": "Zendesk subdomain",
        "default": ""
      },
      {
        "type": "promptString",
        "id": "zendesk_email",
        "description": "Zendesk email"
      },
      {
        "type": "promptString",
        "id": "zendesk_api_key",
        "description": "Zendesk API key",
        "password": true
      }
    ],
    "servers": {
      "zendesk": {
        "command": "npx",
        "args": ["-y", "@sankalpgunturi/server-zendesk"],
        "env": {
          "ZENDESK_SUBDOMAIN": "${input:zendesk_subdomain}",
          "ZENDESK_EMAIL": "${input:zendesk_email}",
          "ZENDESK_API_KEY": "${input:zendesk_api_key}"
        }
      }
    }
  }
}
```

## Docker Usage

You can also run the server using Docker:

```bash
docker run -i --rm \
  -e ZENDESK_SUBDOMAIN=your-subdomain \
  -e ZENDESK_EMAIL=your-email \
  -e ZENDESK_API_KEY=your-api-key \
  sankalpgunturi/server-zendesk
```

## Features

### Resources

- `zendesk://knowledge-base`: Get access to the whole help center articles.

### Prompts

#### analyze-ticket

Analyze a Zendesk ticket and provide a detailed analysis of the ticket.

#### draft-ticket-response

Draft a response to a Zendesk ticket.

### Tools

#### get_ticket

Retrieve a Zendesk ticket by its ID

- Input:
  - `ticket_id` (integer): The ID of the ticket to retrieve

#### get_ticket_comments

Retrieve all comments for a Zendesk ticket by its ID

- Input:
  - `ticket_id` (integer): The ID of the ticket to get comments for

#### create_ticket_comment

Create a new comment on an existing Zendesk ticket

- Input:
  - `ticket_id` (integer): The ID of the ticket to comment on
  - `comment` (string): The comment text/content to add
  - `public` (boolean, optional): Whether the comment should be public (defaults to true)

## Requirements

- Python 3.12 or higher
- Node.js 18 or higher

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
