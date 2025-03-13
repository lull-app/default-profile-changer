import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  PropertyInspectorDidAppearEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { ServerClient } from "../lib/serverClient";

@action({ UUID: "com.trueferret.default-profile-changer.changer" })
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
      const profileNames = profiles.map(profile => profile.name || profile.id);

      await streamDeck.logger.info(`${profileNames}`);
      
      await streamDeck.settings.setGlobalSettings({ profiles: profileNames });

      const settings = await streamDeck.settings.getGlobalSettings();
      streamDeck.logger.info(settings)
      
      await streamDeck.logger.info(`Loaded ${profileNames.length} profiles`);

    } catch (error: any) {
      console.error("Error in onPropertyInspectorDidAppear:", error);
      await streamDeck.logger.error(`Error loading profiles: ${error.message}`);
    }
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
