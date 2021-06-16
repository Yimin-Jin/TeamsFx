// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { ConfigMap, Inputs, PluginConfig, ProjectSettings, ReadonlySolutionConfig, SolutionConfig } from "./types";
 
import { VsCode } from "./vscode";
import { TeamsAppManifest } from "./manifest";
import {
    GraphTokenProvider,
    LogProvider,
    TelemetryReporter,
    AzureAccountProvider,
    AppStudioTokenProvider,
    Dialog,
    TreeProvider
} from "./utils"; 
import { Platform } from "./constants";
import { UserInteraction } from "./qm";

/*
 * Context will be generated by Core and carry necessary information to
 * develop a Teams APP.
 */
export interface Context {
    
    root: string;

    dialog?: Dialog;

    logProvider?: LogProvider;

    telemetryReporter?: TelemetryReporter;

    azureAccountProvider?: AzureAccountProvider;

    graphTokenProvider?: GraphTokenProvider;

    appStudioToken?: AppStudioTokenProvider;

    treeProvider?: TreeProvider;

    answers?: Inputs;
    
    projectSettings?:ProjectSettings;
    
    ui?: UserInteraction;
}

export interface SolutionContext extends Context {
    // dotVsCode?: VsCode;

    // app: TeamsAppManifest;

    config: SolutionConfig;
}

export interface PluginContext extends Context {
    // A readonly view of other plugins' config
    // FolderProvider: FolderProvider;

    // A readonly view of other plugins' config
    configOfOtherPlugins: ReadonlySolutionConfig;

    // A mutable config for current plugin
    config: PluginConfig;

    // A readonly of view of teams manifest. Useful for bot plugin.
    app: Readonly<TeamsAppManifest>;
}
