#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Type definitions for tool arguments
interface CreateAutomationArgs {
  name: string;
  description: string;
}

// Tool definitions
const createAutomationTool: Tool = {
  name: 'pinkfish_create_automation',
  description: 'Create a new automation in Pinkfish',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the automation',
      },
      description: {
        type: 'string',
        description: 'Description of the automation',
      },
    },
    required: ['name', 'description'],
  },
};

class PinkfishClient {
  private apiUrl: string;
  private headers: {
    'Authorization': string;
    'X-Selected-Org': string;
    'Content-Type': string;
  };

  constructor(cognitoToken: string, selectedOrg: string, baseUrl: string) {
    this.apiUrl = `https://app-api.${baseUrl}/api/automations`;
    this.headers = {
      'Authorization': cognitoToken,
      'X-Selected-Org': selectedOrg,
      'Content-Type': 'application/json',
    };
  }

  async createAutomation(name: string, description: string): Promise<any> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create automation: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }
}

async function main() {
  const cognitoToken = process.env.COGNITO_TOKEN;
  const selectedOrg = process.env.SELECTED_ORG;
  const baseUrl = process.env.BASE_URL || 'dev24.pinkfish.dev';

  if (!cognitoToken) {
    console.error('Please set COGNITO_TOKEN environment variable');
    process.exit(1);
  }

  if (!selectedOrg) {
    console.error('Please set SELECTED_ORG environment variable');
    process.exit(1);
  }

  console.error('Starting Pinkfish MCP Server...');
  const server = new Server(
    {
      name: 'Pinkfish MCP Server',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const pinkfishClient = new PinkfishClient(cognitoToken, selectedOrg, baseUrl);

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error('Received CallToolRequest:', request);
      try {
        if (!request.params.arguments) {
          throw new Error('No arguments provided');
        }

        switch (request.params.name) {
          case 'pinkfish_create_automation': {
            const args = request.params.arguments as unknown as CreateAutomationArgs;
            if (!args.name || !args.description) {
              throw new Error(
                'Missing required arguments: name and description'
              );
            }
            const response = await pinkfishClient.createAutomation(
              args.name,
              args.description
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error('Error executing tool:', error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('Received ListToolsRequest');
    return {
      tools: [
        createAutomationTool,
      ],
    };
  });

  const transport = new StdioServerTransport();
  console.error('Connecting server to transport...');
  await server.connect(transport);

  console.error('Pinkfish MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
