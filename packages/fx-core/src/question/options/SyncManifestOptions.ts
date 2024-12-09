// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/****************************************************************************************
 *                            NOTICE: AUTO-GENERATED                                    *
 ****************************************************************************************
 * This file is automatically generated by script "./src/question/generator.ts".        *
 * Please don't manually change its contents, as any modifications will be overwritten! *
 ***************************************************************************************/

import { CLICommandOption, CLICommandArgument } from "@microsoft/teamsfx-api";

export const SyncManifestOptions: CLICommandOption[] = [
  {
    name: "projectPath",
    type: "string",
    description: "Project Path",
    required: true,
    default: "./",
  },
  {
    name: "env",
    type: "string",
    description: "Target Teams Toolkit Environment",
    required: true,
  },
  {
    name: "teams-app-id",
    type: "string",
    description: "Teams App ID (optional)",
    required: true,
  },
];
export const SyncManifestArguments: CLICommandArgument[] = [];