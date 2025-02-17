import {
  action,
  KeyDownEvent,
  PropertyInspectorDidAppearEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";

@action({ UUID: "com.lull.dynamic-default-profile.switch" })
export class SwitchDefaultProfile extends SingletonAction<SwitchProfileSettings> {
  override async onPropertyInspectorDidAppear?(
    ev: PropertyInspectorDidAppearEvent
  ): Promise<void> {
    
  }

  override async onKeyDown(
    ev: KeyDownEvent<SwitchProfileSettings>
  ): Promise<void> {

  }
}

type SwitchProfileSettings = {
  newDefaultProfile?: string;
};
