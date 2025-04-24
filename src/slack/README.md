# Slack MCP Server

MCP Server for the Slack API via proxy, enabling Claude to interact with Slack workspaces.

## Tools

1. `slack_list_channels`
   - List public or pre-defined channels in the workspace
   - Optional inputs:
     - `limit` (number, default: 100, max: 200): Maximum number of channels to return
     - `cursor` (string): Pagination cursor for next page
   - Returns: List of channels with their IDs and information

2. `slack_post_message`
   - Post a new message to a Slack channel
   - Required inputs:
     - `channel_id` (string): The ID of the channel to post to
     - `text` (string): The message text to post
   - Returns: Message posting confirmation and timestamp

3. `slack_reply_to_thread`
   - Reply to a specific message thread
   - Required inputs:
     - `channel_id` (string): The channel containing the thread
     - `thread_ts` (string): Timestamp of the parent message
     - `text` (string): The reply text
   - Returns: Reply confirmation and timestamp

4. `slack_add_reaction`
   - Add an emoji reaction to a message
   - Required inputs:
     - `channel_id` (string): The channel containing the message
     - `timestamp` (string): Message timestamp to react to
     - `reaction` (string): Emoji name without colons
   - Returns: Reaction confirmation

5. `slack_get_channel_history`
   - Get recent messages from a channel
   - Required inputs:
     - `channel_id` (string): The channel ID
   - Optional inputs:
     - `limit` (number, default: 10): Number of messages to retrieve
   - Returns: List of messages with their content and metadata

6. `slack_get_thread_replies`
   - Get all replies in a message thread
   - Required inputs:
     - `channel_id` (string): The channel containing the thread
     - `thread_ts` (string): Timestamp of the parent message
   - Returns: List of replies with their content and metadata


7. `slack_get_users`
   - Get list of workspace users with basic profile information
   - Optional inputs:
     - `cursor` (string): Pagination cursor for next page
     - `limit` (number, default: 100, max: 200): Maximum users to return
   - Returns: List of users with their basic profiles

8. `slack_get_user_profile`
   - Get detailed profile information for a specific user
   - Required inputs:
     - `user_id` (string): The user's ID
   - Returns: Detailed user profile information

## Setup

This version of the Slack MCP server uses a proxy service to interact with Slack, so you don't need to create a Slack app or configure OAuth scopes. You just need to obtain a runtime token for authentication.

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

#### NPX

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@sankalpgunturi/server-slack"
      ],
      "env": {
        "RUNTIME_TOKEN": "your-runtime-token",
        "PC_CONNECTION_ID": "your-connection-id"
      }
    }
  }
}
```

#### Docker

```json
{
  "mcpServers": {
    "slack": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "RUNTIME_TOKEN",
        "-e",
        "PC_CONNECTION_ID",
        "mcp/slack"
      ],
      "env": {
        "RUNTIME_TOKEN": "your-runtime-token",
        "PC_CONNECTION_ID": "your-connection-id"
      }
    }
  }
}
```

### Usage with VS Code

For manual installation, add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by pressing `Ctrl + Shift + P` and typing `Preferences: Open Settings (JSON)`.

Optionally, you can add it to a file called `.vscode/mcp.json` in your workspace. This will allow you to share the configuration with others.

> Note that the `mcp` key is not needed in the `.vscode/mcp.json` file.

#### NPX

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "runtime_token",
        "description": "Runtime Token for Slack proxy",
        "password": true
      },
      {
        "type": "promptString",
        "id": "pc_connection_id",
        "description": "Connection ID for Slack proxy"
      }
    ],
    "servers": {
      "slack": {
        "command": "npx",
        "args": ["-y", "@sankalpgunturi/server-slack"],
        "env": {
          "RUNTIME_TOKEN": "${input:runtime_token}",
          "PC_CONNECTION_ID": "${input:pc_connection_id}"
        }
      }
    }
  }
}
```

#### Docker

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "runtime_token",
        "description": "Runtime Token for Slack proxy",
        "password": true
      },
      {
        "type": "promptString",
        "id": "pc_connection_id",
        "description": "Connection ID for Slack proxy"
      }
    ],
    "servers": {
      "slack": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "mcp/slack"],
        "env": {
          "RUNTIME_TOKEN": "${input:runtime_token}",
          "PC_CONNECTION_ID": "${input:pc_connection_id}"
        }
      }
    }
  }
}
```

### Environment Variables

1. `RUNTIME_TOKEN`: Required. The authentication token for the Slack proxy service.
2. `PC_CONNECTION_ID`: Optional. The connection ID for the Slack proxy service. If not provided, a default value will be used.
3. `PROXY_PATH`: Optional. Alternative name for PC_CONNECTION_ID, maintained for backward compatibility.
4. `SLACK_CHANNEL_IDS`: Optional. Comma-separated list of channel IDs to limit channel access (e.g., "C01234567, C76543210"). If not set, all public channels will be listed.

## Build

To build and publish this package:

```bash
cd src/slack
npm install
npm run build
npm publish --access public
```

To use Docker:

```bash
docker build -t mcp/slack -f src/slack/Dockerfile .
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
