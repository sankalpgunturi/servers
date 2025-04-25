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

interface ListAutomationsArgs {
  adminAccess?: boolean;
}

interface GetAutomationArgs {
  automationId: string;
}

interface UpdateAutomationArgs {
  automationId: string;
  name?: string;
  description?: string;
  version: number;
  inputs?: string;
}

interface GetAutomationSummaryArgs {
  automationId: string;
}

interface CloneAutomationArgs {
  automationId: string;
  name: string;
  targetOrgId?: string;
}

interface DeleteAutomationVersionArgs {
  automationId: string;
  automationVersion: string;
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

const listAutomationsTool: Tool = {
  name: 'pinkfish_list_automations',
  description: 'List all automations the user has access to',
  inputSchema: {
    type: 'object',
    properties: {
      adminAccess: {
        type: 'boolean',
        description: 'Whether to include automations accessible with admin privileges',
      },
    },
    required: [],
  },
};

const getAutomationTool: Tool = {
  name: 'pinkfish_get_automation',
  description: 'Get details of a specific automation by ID',
  inputSchema: {
    type: 'object',
    properties: {
      automationId: {
        type: 'string',
        description: 'The ID of the automation to retrieve',
      },
    },
    required: ['automationId'],
  },
};

const updateAutomationTool: Tool = {
  name: 'pinkfish_update_automation',
  description: 'Update an existing automation',
  inputSchema: {
    type: 'object',
    properties: {
      automationId: {
        type: 'string',
        description: 'The ID of the automation to update',
      },
      name: {
        type: 'string',
        description: 'The new name of the automation',
      },
      description: {
        type: 'string',
        description: 'The new description of the automation',
      },
      version: {
        type: 'number',
        description: 'The current version of the automation (required for version control)',
      },
      inputs: {
        type: 'string',
        description: 'JSON string of inputs for the automation',
      },
    },
    required: ['automationId', 'version'],
  },
};

const getAutomationSummaryTool: Tool = {
  name: 'pinkfish_get_automation_summary',
  description: 'Get a detailed summary of an automation',
  inputSchema: {
    type: 'object',
    properties: {
      automationId: {
        type: 'string',
        description: 'The ID of the automation to get the summary for',
      },
    },
    required: ['automationId'],
  },
};

const cloneAutomationTool: Tool = {
  name: 'pinkfish_clone_automation',
  description: 'Create a copy of an existing automation',
  inputSchema: {
    type: 'object',
    properties: {
      automationId: {
        type: 'string',
        description: 'The ID of the automation to clone',
      },
      name: {
        type: 'string',
        description: 'The name for the cloned automation',
      },
      targetOrgId: {
        type: 'string',
        description: 'Optional organization ID to clone the automation to',
      },
    },
    required: ['automationId', 'name'],
  },
};

const deleteAutomationVersionTool: Tool = {
  name: 'pinkfish_delete_automation_version',
  description: 'Delete a specific version of an automation',
  inputSchema: {
    type: 'object',
    properties: {
      automationId: {
        type: 'string',
        description: 'The ID of the automation',
      },
      automationVersion: {
        type: 'string',
        description: 'The version of the automation to delete',
      },
    },
    required: ['automationId', 'automationVersion'],
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

  async listAutomations(adminAccess?: boolean): Promise<any> {
    const url = new URL(this.apiUrl);
    if (adminAccess) {
      url.searchParams.append('adminAccess', 'true');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list automations: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async getAutomation(automationId: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/${automationId}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get automation: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async updateAutomation(automationId: string, data: UpdateAutomationArgs): Promise<any> {
    const response = await fetch(`${this.apiUrl}/${automationId}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        version: data.version,
        inputs: data.inputs,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update automation: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async getAutomationSummary(automationId: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/${automationId}/summary`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get automation summary: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async cloneAutomation(automationId: string, name: string, targetOrgId?: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/${automationId}/clone`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name,
        ...(targetOrgId && { targetOrgId }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to clone automation: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async deleteAutomationVersion(automationId: string, automationVersion: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/${automationId}/v/${automationVersion}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete automation version: ${response.status} ${response.statusText} - ${errorText}`);
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

          case 'pinkfish_list_automations': {
            const args = request.params.arguments as unknown as ListAutomationsArgs;
            const response = await pinkfishClient.listAutomations(args.adminAccess);
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'pinkfish_get_automation': {
            const args = request.params.arguments as unknown as GetAutomationArgs;
            if (!args.automationId) {
              throw new Error('Missing required argument: automationId');
            }
            const response = await pinkfishClient.getAutomation(args.automationId);
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'pinkfish_update_automation': {
            const args = request.params.arguments as unknown as UpdateAutomationArgs;
            if (!args.automationId || args.version === undefined) {
              throw new Error('Missing required arguments: automationId and version');
            }
            const response = await pinkfishClient.updateAutomation(args.automationId, args);
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'pinkfish_get_automation_summary': {
            const args = request.params.arguments as unknown as GetAutomationSummaryArgs;
            if (!args.automationId) {
              throw new Error('Missing required argument: automationId');
            }
            const response = await pinkfishClient.getAutomationSummary(args.automationId);
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'pinkfish_clone_automation': {
            const args = request.params.arguments as unknown as CloneAutomationArgs;
            if (!args.automationId || !args.name) {
              throw new Error('Missing required arguments: automationId and name');
            }
            const response = await pinkfishClient.cloneAutomation(
              args.automationId,
              args.name,
              args.targetOrgId
            );
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'pinkfish_delete_automation_version': {
            const args = request.params.arguments as unknown as DeleteAutomationVersionArgs;
            if (!args.automationId || !args.automationVersion) {
              throw new Error('Missing required arguments: automationId and automationVersion');
            }
            const response = await pinkfishClient.deleteAutomationVersion(
              args.automationId,
              args.automationVersion
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
        listAutomationsTool,
        getAutomationTool,
        updateAutomationTool,
        getAutomationSummaryTool,
        cloneAutomationTool,
        deleteAutomationVersionTool,
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
