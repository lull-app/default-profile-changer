import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  JsonObject,
  KeyDownEvent,
  PropertyInspectorDidAppearEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { ServerClient } from "../lib/serverClient";

interface Profile {
  id: string;
  name: string;
  isdefault: boolean;
}

@action({ UUID: "com.lull.default-profile-changer.button" })
export class SwitchDefaultProfile extends SingletonAction<SwitchProfileSettings> {
  private serverClient: ServerClient;

  constructor() {
    super();
    this.serverClient = new ServerClient();
  }

  override async onPropertyInspectorDidAppear(ev: PropertyInspectorDidAppearEvent): Promise<void> {
    try {
      const isRunning = await this.serverClient.isServerRunning();

      if (!isRunning) {
        console.error("Server is not running");
        await streamDeck.logger.error("Server is not running. Cannot fetch profiles.");
        return;
      }

      const profiles = await this.serverClient.getAllProfiles();

      await streamDeck.settings.setGlobalSettings({
        profiles: profiles
      });
      

      await streamDeck.logger.info(`Loaded ${profiles.length} profiles`);
    } catch (error: any) {
      console.error("Error in onPropertyInspectorDidAppear:", error);
      await streamDeck.logger.error(`Error loading profiles: ${error.message}`);
    }
  }

  override async onKeyDown(
    ev: KeyDownEvent<SwitchProfileSettings>
  ): Promise<void> {
    try {
      // Get the selected profile from settings
      const settings = ev.payload.settings;
      
      if (!settings.newDefaultProfile) {
        await streamDeck.logger.error("No profile selected in settings.");
        return;
      }

      // Find the profile ID that matches the selected profile name
      const profiles = await this.serverClient.getAllProfiles();
      const selectedProfile = profiles.find(p => p.id === settings.newDefaultProfile);
      
      if (!selectedProfile) {
        await streamDeck.logger.error(`Profile ${profiles} not found.`);
        await streamDeck.logger.error(`Profile ${settings.newDefaultProfile} not found.`);
        await streamDeck.logger.error(`Profile ${selectedProfile} not found.`);
        return;
      }

      // Set the new default profile using the ID
      const success = await this.serverClient.setDefaultProfile(selectedProfile.id);
      
      if (success) {
        await streamDeck.logger.info(`Successfully changed default profile to ${settings.newDefaultProfile}`);
      } else {
        await streamDeck.logger.error("Failed to change default profile.");
      }
    } catch (error: any) {
      console.error("Error changing default profile:", error);
      await streamDeck.logger.error(`Error changing default profile: ${error.message}`);
    }
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<SwitchProfileSettings>
  ): Promise<void> {
    const settings = ev.payload.settings;

    if (settings && settings.newDefaultProfile) {
      const globalSettings = await streamDeck.settings.getGlobalSettings();
      const profiles = globalSettings.profiles as unknown as Profile[];

      if (profiles && profiles.length > 0) {
        const selectedProfile = profiles.find(p => p.id === settings.newDefaultProfile);

        if (selectedProfile) {
          const formattedTitle = selectedProfile.name.replace(/ /g, "\n");
          await streamDeck.actions.forEach((action) => {
            action.setTitle(formattedTitle);
          });
        } else {

          await streamDeck.actions.forEach((action) => {
            action.setTitle("Select\nProfile");
          });
        }
      } else {
        await streamDeck.actions.forEach((action) => {
          action.setTitle("Select\nProfile");
        });
      }
    } else {
      await streamDeck.actions.forEach((action) => {
        action.setTitle("Select\nProfile");
      });
    }
  }
}

type SwitchProfileSettings = {
  newDefaultProfile?: string;
  profiles?: string[];
};
