import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  PropertyInspectorDidAppearEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { join } from "path";
import { readdir, readFile } from "fs/promises";
import { homedir } from "os";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
const { execFile } = require("child_process");

@action({ UUID: "com.lull.dynamic-default-profile.switch" })
export class SwitchDefaultProfile extends SingletonAction<SwitchProfileSettings> {
  override async onPropertyInspectorDidAppear(
    ev: PropertyInspectorDidAppearEvent
  ): Promise<void> {
    // TODO Call Server via the serverClient.ts to load the profiles
  }

  override async onKeyDown(
    ev: KeyDownEvent<SwitchProfileSettings>
  ): Promise<void> {
    // TODO Call tServer via the serverClient.ts to switch the default profile
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<SwitchProfileSettings>
  ): void {
    // Handle the settings changing in the property inspector (UI).
  }
}

type SwitchProfileSettings = {
  newDefaultProfile?: string;
  profiles?: string[];
};
