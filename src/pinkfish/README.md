# Pinkfish MCP Server

MCP Server for the Pinkfish API, enabling Claude to interact with Pinkfish automations.

## Tools

1. `pinkfish_create_automation`
   - Create a new automation in Pinkfish
   - Required inputs:
     - `name` (string): The name of the automation
     - `description` (string): Description of the automation
   - Returns: The created automation object with ID and other metadata

2. `pinkfish_list_automations`
   - List all automations the user has access to
   - Optional inputs:
     - `adminAccess` (boolean): Whether to include automations accessible with admin privileges
   - Returns: A list of automation objects

3. `pinkfish_get_automation`
   - Get details of a specific automation by ID
   - Required inputs:
     - `automationId` (string): The ID of the automation to retrieve
   - Returns: The automation object with all its details

4. `pinkfish_update_automation`
   - Update an existing automation
   - Required inputs:
     - `automationId` (string): The ID of the automation to update
     - `version` (number): The current version of the automation (required for version control)
   - Optional inputs:
     - `name` (string): The new name of the automation
     - `description` (string): The new description of the automation
     - `inputs` (string): JSON string of inputs for the automation
   - Returns: The updated automation object

5. `pinkfish_get_automation_summary`
   - Get a detailed summary of an automation
   - Required inputs:
     - `automationId` (string): The ID of the automation to get the summary for
   - Returns: A summary of the automation including additional metadata

6. `pinkfish_clone_automation`
   - Create a copy of an existing automation
   - Required inputs:
     - `automationId` (string): The ID of the automation to clone
     - `name` (string): The name for the cloned automation
   - Optional inputs:
     - `targetOrgId` (string): Optional organization ID to clone the automation to
   - Returns: The newly created cloned automation object

7. `pinkfish_delete_automation_version`
   - Delete a specific version of an automation
   - Required inputs:
     - `automationId` (string): The ID of the automation
     - `automationVersion` (string): The version of the automation to delete
   - Returns: Confirmation of the deletion

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

Here are examples of how to use each tool once the MCP server is running:

### Create a new automation

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

### List all automations

```
use_mcp_tool(
  server_name="pinkfish",
  tool_name="pinkfish_list_automations",
  arguments={
    "adminAccess": true
  }
)
```

### Get a specific automation by ID

```
use_mcp_tool(
  server_name="pinkfish",
  tool_name="pinkfish_get_automation",
  arguments={
    "automationId": "d05vmgdiemec706te5eg"
  }
)
```

### Update an existing automation

```
use_mcp_tool(
  server_name="pinkfish",
  tool_name="pinkfish_update_automation",
  arguments={
    "automationId": "d05vmgdiemec706te5eg",
    "name": "Updated Automation Name",
    "description": "Updated description",
    "version": 1,
    "inputs": "{\"key\": \"value\"}"
  }
)
```

### Get a detailed summary of an automation

```
use_mcp_tool(
  server_name="pinkfish",
  tool_name="pinkfish_get_automation_summary",
  arguments={
    "automationId": "d05vmgdiemec706te5eg"
  }
)
```

### Clone an automation

```
use_mcp_tool(
  server_name="pinkfish",
  tool_name="pinkfish_clone_automation",
  arguments={
    "automationId": "d05vmgdiemec706te5eg",
    "name": "Cloned Automation",
    "targetOrgId": "584468929112"
  }
)
```

### Delete a specific version of an automation

```
use_mcp_tool(
  server_name="pinkfish",
  tool_name="pinkfish_delete_automation_version",
  arguments={
    "automationId": "d05vmgdiemec706te5eg",
    "automationVersion": "1"
  }
)
```

Each tool will return a JSON response with the relevant data or confirmation of the operation.

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
