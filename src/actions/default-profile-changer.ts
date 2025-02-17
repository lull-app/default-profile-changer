import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  PropertyInspectorDidAppearEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { exec } from "child_process";

@action({ UUID: "com.lull.dynamic-default-profile.switch" })
export class SwitchDefaultProfile extends SingletonAction<SwitchProfileSettings> {
  override async onPropertyInspectorDidAppear?(
    ev: PropertyInspectorDidAppearEvent
  ): Promise<void> {
    exec("python ./src/actions/get-all-profiles.py", async (error, stdout) => {
      streamDeck.logger.info("The Script has ran");
      if (error) {
        streamDeck.logger.info("ERROR RUNNING PY SCRIPT");
        console.error("Error fetching profiles:", error);
        return;
      }

      try {
        const data = JSON.parse(stdout);
        if (data.profiles) {
          const profileNames = data.profiles.map(
            (profile: { name: string }) => profile.name
          );
          console.log("Profiles loaded:", profileNames);

          // Store profiles in Stream Deck settings
          await ev.action.setSettings({ profiles: profileNames });
        } else {
          console.error("No profiles found:", data.error);
        }
      } catch (err) {
        console.error("Invalid JSON from get-all-profiles.py:", stdout);
      }
    });
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


  override onDidReceiveSettings(ev: DidReceiveSettingsEvent<SwitchProfileSettings>): void {
		// Handle the settings changing in the property inspector (UI).
	}
}

type SwitchProfileSettings = {
  newDefaultProfile?: string;
  profiles?: string[];
};
