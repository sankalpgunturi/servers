# Pinkfish MCP Server

MCP Server for the Pinkfish API, enabling Claude to interact with Pinkfish automations.

## Tools

1. `pinkfish_create_automation`
   - Create a new automation in Pinkfish
   - Required inputs:
     - `name` (string): The name of the automation
     - `description` (string): Description of the automation
   - Returns: The created automation object with ID and other metadata

## Setup

This MCP server requires environment variables for authentication with the Pinkfish API.

### Environment Variables

1. `COGNITO_TOKEN`: Required. The JWT token for authentication with the Pinkfish API.
2. `SELECTED_ORG`: Required. The organization ID for the X-Selected-Org header.
3. `BASE_URL`: Optional. The base URL for the Pinkfish API (default: "dev24.pinkfish.dev"). This allows you to switch between different environments:
   - Development: "dev24.pinkfish.dev"
   - Staging: "staging.pinkfish.dev"
   - Production: "app.pinkfish.dev"

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pinkfish": {
      "command": "node",
      "args": [
        "/path/to/servers/src/pinkfish/dist/index.js"
      ],
      "env": {
        "COGNITO_TOKEN": "your-cognito-token",
        "SELECTED_ORG": "your-org-id",
        "BASE_URL": "dev24.pinkfish.dev"
      }
    }
  }
}
```

### Usage with VS Code

For manual installation, add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by pressing `Ctrl + Shift + P` and typing `Preferences: Open Settings (JSON)`.

Optionally, you can add it to a file called `.vscode/mcp.json` in your workspace. This will allow you to share the configuration with others.

> Note that the `mcp` key is not needed in the `.vscode/mcp.json` file.

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "cognito_token",
        "description": "Cognito Token for Pinkfish API",
        "password": true
      },
      {
        "type": "promptString",
        "id": "selected_org",
        "description": "Organization ID for Pinkfish API"
      },
      {
        "type": "promptString",
        "id": "base_url",
        "description": "Base URL for Pinkfish API",
        "default": "dev24.pinkfish.dev"
      }
    ],
    "servers": {
      "pinkfish": {
        "command": "node",
        "args": ["/path/to/servers/src/pinkfish/dist/index.js"],
        "env": {
          "COGNITO_TOKEN": "${input:cognito_token}",
          "SELECTED_ORG": "${input:selected_org}",
          "BASE_URL": "${input:base_url}"
        }
      }
    }
  }
}
```

## Build

To build this package:

```bash
cd src/pinkfish
npm install
npm run build
```

## Example Usage

Once the MCP server is running, you can use the `pinkfish_create_automation` tool to create a new automation:

```
use_mcp_tool(
  server_name="pinkfish",
  tool_name="pinkfish_create_automation",
  arguments={
    "name": "My New Automation",
    "description": "This is a test automation created via MCP"
  }
)
```

The response will include the created automation object with its ID and other metadata.

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
