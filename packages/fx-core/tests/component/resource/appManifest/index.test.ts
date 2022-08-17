// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "mocha";
import * as chai from "chai";
import sinon from "sinon";
import path from "path";
import * as os from "os";
import fs from "fs-extra";
import _, { findLastKey } from "lodash";
import AdmZip from "adm-zip";
import {
  ContextV3,
  InputsWithProjectPath,
  Platform,
  ResourceContextV3,
  TeamsAppManifest,
  ok,
  InputResult,
  SingleSelectResult,
} from "@microsoft/teamsfx-api";
import { randomAppName, MockLogProvider, MockTools } from "../../../core/utils";
import { createContextV3 } from "../../../../src/component/utils";
import { setTools } from "../../../../src/core/globalVars";
import { AppManifest } from "../../../../src/component/resource/appManifest/appManifest";
import { AppStudioError } from "../../../../src/plugins/resource/appstudio/errors";
import { newEnvInfoV3 } from "../../../../src";
import { ComponentNames } from "../../../../src/component/constants";
import { AppStudioClient } from "../../../../src/plugins/resource/appstudio/appStudio";
import { Constants } from "../../../../src/plugins/resource/appstudio/constants";
import { autoPublishOption } from "../../../../src/plugins/resource/appstudio/questions";
import { PublishingState } from "../../../../src/plugins/resource/appstudio/interfaces/IPublishingAppDefinition";
import * as appstudio from "../../../../src/component/resource/appManifest/appStudio";
import * as utils from "../../../../src/component/resource/appManifest/utils";
import { getAzureProjectRoot } from "../../../plugins/resource/appstudio/helper";

describe("App-manifest Component", () => {
  const sandbox = sinon.createSandbox();
  const component = new AppManifest();
  const tools = new MockTools();
  const appName = randomAppName();
  const inputs: InputsWithProjectPath = {
    projectPath: getAzureProjectRoot(),
    platform: Platform.VSCode,
    "app-name": appName,
    appPackagePath: "fakePath",
  };
  const inputsWithoutUserProvidedZip: InputsWithProjectPath = {
    projectPath: getAzureProjectRoot(),
    platform: Platform.VSCode,
    "app-name": appName,
  };
  let context: ContextV3;
  setTools(tools);

  beforeEach(() => {
    context = createContextV3();
    context.envInfo = newEnvInfoV3();
    context.envInfo!.state["solution"] = {
      ["provisionSucceed"]: true,
    };
    context.envInfo!.state[ComponentNames.AppManifest] = {
      ["teamsAppUpdatedAt"]: undefined,
    };
    sandbox.stub(tools.tokenProvider.m365TokenProvider, "getAccessToken").resolves(ok("fakeToken"));

    const res: SingleSelectResult = {
      type: "success",
      result: autoPublishOption,
    };
    sandbox.stub(context.userInteraction, "selectOption").resolves(ok(res));

    context.logProvider = new MockLogProvider();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("validate manifest", async function () {
    sandbox.stub(appstudio, "getManifest").resolves(ok(new TeamsAppManifest()));
    const validationAction = await component.validate(context as ResourceContextV3, inputs);
    chai.assert.isTrue(validationAction.isOk());
  });

  it("validation manifest - without schema", async function () {
    const manifest = new TeamsAppManifest();
    manifest.$schema = undefined;
    sandbox.stub(appstudio, "getManifest").resolves(ok(manifest));
    const validationAction = await component.validate(context as ResourceContextV3, inputs);
    chai.assert.isTrue(validationAction.isErr());
    if (validationAction.isErr()) {
      chai.assert.equal(validationAction.error.name, AppStudioError.ValidationFailedError.name);
    }
  });

  it("build", async function () {
    const manifest = new TeamsAppManifest();
    manifest.id = "";
    sandbox.stub(appstudio, "getManifest").resolves(ok(manifest));
    sandbox.stub(fs, "pathExists").resolves(true);
    sandbox.stub(fs, "writeFile").resolves();
    sandbox.stub(fs, "chmod").resolves();

    const buildAction = await component.build(context as ResourceContextV3, inputs);
    chai.assert(buildAction.isOk());
  });

  it("deploy - filenotfound", async function () {
    const inputs2 = _.cloneDeep(inputs);
    inputs2.projectPath = path.join(os.homedir(), "TeamsApps", appName);
    const deployAction = await component.deploy(context as ResourceContextV3, inputs2);
    chai.assert.isTrue(deployAction.isErr());
    if (deployAction.isErr()) {
      chai.assert.equal(deployAction.error.name, AppStudioError.FileNotFoundError.name);
    }
  });

  it("deploy - preivew only", async function () {
    const manifest = new TeamsAppManifest();
    sandbox.stub(utils, "readAppManifest").resolves(ok(manifest));
    sandbox.stub(fs, "pathExists").resolves(true);
    sandbox.stub(fs, "readJSON").resolves(manifest);
    sandbox.stub(fs, "readFile").resolves(new Buffer(JSON.stringify(manifest)));
    sandbox.stub(context.userInteraction, "showMessage").resolves(ok("Preview only"));

    const deployAction = await component.deploy(context as ResourceContextV3, inputs);
    chai.assert.isTrue(deployAction.isErr());
    if (deployAction.isErr()) {
      chai.assert.equal(deployAction.error.name, AppStudioError.UpdateManifestCancelError.name);
    }
  });

  it.skip("deploy - succeed", async function () {
    const manifest = new TeamsAppManifest();
    sandbox.stub(utils, "readAppManifest").resolves(ok(manifest));
    sandbox.stub(fs, "pathExists").resolves(true);
    sandbox.stub(fs, "readJSON").resolves(manifest);
    sandbox.stub(fs, "readFile").resolves(new Buffer(JSON.stringify(manifest)));
    sandbox.stub(context.userInteraction, "showMessage").resolves(ok("Preview and update"));
    sandbox.stub(AppStudioClient, "importApp").resolves({ teamsAppId: "mockTeamsAppId" });

    const deployAction = await component.deploy(context as ResourceContextV3, inputs);
    if (deployAction.isErr()) {
      console.log(`Error response: ${JSON.stringify(deployAction.error)}`);
    }
    chai.assert.isTrue(deployAction.isOk());
  });

  it("publish - filenotfound", async function () {
    const publishAction = await component.publish(context as ResourceContextV3, inputs);
    chai.assert.isTrue(publishAction.isErr());
    if (publishAction.isErr()) {
      chai.assert.equal(publishAction.error.name, AppStudioError.FileNotFoundError.name);
    }
  });

  it("publish - user cancel", async function () {
    const manifest = new TeamsAppManifest();
    manifest.id = "";
    manifest.icons.color = "resources/color.png";
    manifest.icons.outline = "resources/outline.png";

    sandbox.stub(utils, "readAppManifest").resolves(ok(manifest));
    sandbox.stub(fs, "pathExists").resolves(true);
    sandbox.stub(fs, "writeFile").resolves();
    sandbox.stub(fs, "chmod").resolves();
    sandbox.stub(fs, "readFile").callsFake(async () => {
      const zip = new AdmZip();
      zip.addFile(Constants.MANIFEST_FILE, Buffer.from(JSON.stringify(new TeamsAppManifest())));
      zip.addFile("color.png", new Buffer(""));
      zip.addFile("outlie.png", new Buffer(""));

      const archivedFile = zip.toBuffer();
      return archivedFile;
    });
    const state = {
      lastModifiedDateTime: new Date(),
      teamsAppId: "",
      displayName: appName,
      publishingState: PublishingState.submitted,
    };
    sandbox.stub(AppStudioClient, "getAppByTeamsAppId").resolves(state);
    sandbox.stub(context.userInteraction, "showMessage").resolves(ok("Cancel"));

    const publishAction = await component.publish(
      context as ResourceContextV3,
      inputsWithoutUserProvidedZip
    );
    chai.assert.isTrue(publishAction.isErr());
    if (publishAction.isErr()) {
      chai.assert.equal(publishAction.error.name, AppStudioError.TeamsAppPublishFailedError.name);
    }
  });
});