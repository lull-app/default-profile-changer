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
    interface Profile {
      folder: string;
      name: string;
    }

    interface ProfileResponse {
      profiles?: Profile[];
      error?: string;
    }

    interface ManifestData {
      Name: string;
      [key: string]: unknown;
    }

    const PROFILES_DIR = join(
      homedir(),
      "AppData",
      "Roaming",
      "Elgato",
      "StreamDeck",
      "ProfilesV2"
    );

    try {
      // Check if profiles directory exists
      if (!existsSync(PROFILES_DIR)) {
        return;
      }

      // Get all folders in ProfilesV2 directory
      const folders = await readdir(PROFILES_DIR);
      const profiles: Profile[] = [];

      // Process each folder
      await Promise.all(
        folders.map(async (folder) => {
          const manifestPath = join(PROFILES_DIR, folder, "manifest.json");

          // Skip if manifest doesn't exist
          if (!existsSync(manifestPath)) {
            return;
          }

          try {
            // Read and parse manifest file
            const manifestContent = await readFile(manifestPath, "utf-8");
            const manifestData = JSON.parse(manifestContent) as ManifestData;

            if (manifestData.Name) {
              profiles.push({
                folder,
                name: manifestData.Name,
              });
            }
          } catch (error) {
            console.error(`Error reading ${folder}/manifest.json:`, error);
            // Continue processing other folders even if one fails
          }
        })
      );

      // Sort profiles by name for consistency
      profiles.sort((a, b) => a.name.localeCompare(b.name));

      const profileNames = profiles?.map((profile) => profile.name) ?? [];
      await ev.action.setSettings({ profiles: profileNames });
    } catch (error) {
      return;
    }
  }

  override async onKeyDown(
    ev: KeyDownEvent<SwitchProfileSettings>
  ): Promise<void> {
    const { settings } = ev.payload;

    if (!settings.newDefaultProfile) {
      console.error("No profile selected.");
      return;
    }

    console.log(`Switching to profile: ${settings.newDefaultProfile}`);
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
