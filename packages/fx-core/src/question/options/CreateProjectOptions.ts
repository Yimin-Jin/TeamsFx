// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/****************************************************************************************
 *                            NOTICE: AUTO-GENERATED                                    *
 ****************************************************************************************
 * This file is automatically generated by script "./src/question/generator.ts".        *
 * Please don't manually change its contents, as any modifications will be overwritten! *
 ***************************************************************************************/

import { CLICommandOption, CLICommandArgument } from "@microsoft/teamsfx-api";

export const CreateProjectOptions: CLICommandOption[] = [
  {
    name: "runtime",
    type: "string",
    description: "Teams Toolkit: select runtime for your app",
    default: "node",
    hidden: true,
    choices: ["node", "dotnet"],
  },
  {
    name: "addin-office-capability",
    type: "string",
    description: "Select to create an Outlook, Word, Excel, or PowerPoint Add-in",
    choices: ["outlook-addin-type", "word", "excel", "powerpoint"],
  },
  {
    name: "capability",
    questionName: "capabilities",
    type: "string",
    shortName: "c",
    description: "Specifies the Microsoft Teams App capability.",
    required: true,
    choices: [
      "bot",
      "notification",
      "command-bot",
      "workflow-bot",
      "tab-non-sso",
      "sso-launch-page",
      "dashboard-tab",
      "tab-spfx",
      "search-app",
      "collect-form-message-extension",
      "search-message-extension",
      "link-unfurling",
      "copilot-plugin-new-api",
      "copilot-plugin-existing-api",
      "custom-copilot-basic",
      "custom-copilot-assistant",
      "message-extension",
      "BotAndMessageExtension",
      "TabNonSsoAndBot",
      "taskpane",
    ],
    choiceListCommand: "teamsapp list templates",
  },
  {
    name: "bot-host-type-trigger",
    type: "string",
    shortName: "t",
    description: "Specifies the trigger for `Chat Notification Message` app template.",
    default: "http-restify",
    choices: [
      "http-restify",
      "http-webapi",
      "http-and-timer-functions",
      "http-functions",
      "timer-functions",
    ],
  },
  {
    name: "spfx-solution",
    type: "string",
    shortName: "s",
    description: "Create a new or import an existing SharePoint Framework solution.",
    default: "new",
    choices: ["new", "import"],
  },
  {
    name: "spfx-install-latest-package",
    type: "boolean",
    description: "Install the latest version of SharePoint Framework.",
    default: true,
  },
  {
    name: "spfx-framework-type",
    type: "string",
    shortName: "k",
    description: "Framework.",
    default: "react",
    choices: ["react", "minimal", "none"],
  },
  {
    name: "spfx-webpart-name",
    type: "string",
    shortName: "w",
    description: "Name for SharePoint Framework Web Part.",
    default: "helloworld",
  },
  {
    name: "spfx-folder",
    type: "string",
    description: "Directory or Path that contains the existing SharePoint Framework solution.",
  },
  {
    name: "addin-host",
    type: "string",
    description: "Add-in Host",
    default: "No Options",
  },
  {
    name: "me-architecture",
    type: "string",
    shortName: "m",
    description: "Architecture of Search Based Message Extension.",
    default: "new-api",
    choices: ["new-api", "api-spec", "bot-plugin", "bot"],
  },
  {
    name: "openapi-spec-location",
    type: "string",
    shortName: "a",
    description: "OpenAPI description document location.",
  },
  {
    name: "api-operation",
    type: "array",
    shortName: "o",
    description: "Select Operation(s) Teams Can Interact with.",
  },
  {
    name: "api-me-auth",
    type: "string",
    description: "The authentication type for the API.",
    default: "none",
    choices: ["none", "api-key"],
  },
  {
    name: "custom-copilot-assistant",
    type: "string",
    description: "AI Agent",
    default: "custom-copilot-assistant-new",
    choices: ["custom-copilot-assistant-new", "custom-copilot-assistant-assistantsApi"],
  },
  {
    name: "programming-language",
    type: "string",
    shortName: "l",
    description: "Programming Language",
    default: "javascript",
    choices: ["javascript", "typescript", "csharp", "python"],
  },
  {
    name: "llm-service",
    type: "string",
    description: "Service for Large Language Model (LLM)",
    default: "llm-service-azureOpenAI",
    choices: ["llm-service-azureOpenAI", "llm-service-openAI"],
  },
  {
    name: "azureOpenAI-key",
    type: "string",
    description: "Azure OpenAI Key",
  },
  {
    name: "azureOpenAI-endpoint",
    type: "string",
    description: "Azure OpenAI Endpoint",
  },
  {
    name: "openAI-key",
    type: "string",
    description: "OpenAI Key",
  },
  {
    name: "folder",
    type: "string",
    shortName: "f",
    description: "Directory where the project folder will be created in.",
    required: true,
    default: "./",
  },
  {
    name: "app-name",
    type: "string",
    shortName: "n",
    description: "Application Name",
    required: true,
  },
];
export const CreateProjectArguments: CLICommandArgument[] = [];
