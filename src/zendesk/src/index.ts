#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the Python package
const pythonPackagePath = join(__dirname, '..', 'python');

// Check if Python is installed
async function checkPythonInstallation() {
  try {
    const pythonProcess = spawn('python3', ['--version']);
    return new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error('Python 3 is not installed'));
        }
      });
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error('Failed to check Python installation: ' + errorMessage);
  }
}

// Install Python dependencies if needed
async function installPythonDependencies() {
  console.error('Installing Python dependencies...');
  return new Promise((resolve, reject) => {
    const pip = spawn('pip3', ['install', '-e', pythonPackagePath]);
    
    pip.stdout.on('data', (data) => {
      console.error(`pip stdout: ${data}`);
    });
    
    pip.stderr.on('data', (data) => {
      console.error(`pip stderr: ${data}`);
    });
    
    pip.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error(`pip install failed with code ${code}`));
      }
    });
  });
}

// Run the Zendesk MCP server
async function runZendeskServer() {
  console.error('Starting Zendesk MCP Server...');
  
  const zendesk = spawn('python3', ['-m', 'zendesk_mcp_server']);
  
  // Connect stdin/stdout
  process.stdin.pipe(zendesk.stdin);
  zendesk.stdout.pipe(process.stdout);
  
  // Log errors to stderr
  zendesk.stderr.on('data', (data) => {
    console.error(`Zendesk MCP Server: ${data}`);
  });
  
  // Handle process exit
  zendesk.on('close', (code) => {
    console.error(`Zendesk MCP Server exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle parent process exit
  process.on('SIGINT', () => {
    zendesk.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    zendesk.kill('SIGTERM');
  });
}

// Main function
async function main() {
  try {
    await checkPythonInstallation();
    await installPythonDependencies();
    await runZendeskServer();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error:', errorMessage);
    process.exit(1);
  }
}

main();
