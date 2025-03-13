import * as fs from "fs";
import * as path from "path";

export interface Profile {
  id: string;
  name: string;
  isDefault?: boolean;
}

export class ProfileManager {
  private streamDeckPath: string;
  private configFilePath: string;

  constructor() {
    if (process.platform === "win32") {
      this.streamDeckPath = path.join(
        process.env.APPDATA || "",
        "Elgato/StreamDeck"
      );
    } else if (process.platform === "darwin") {
      this.streamDeckPath = path.join(
        process.env.HOME || "",
        "Library/Application Support/com.elgato.StreamDeck"
      );
    } else {
      this.streamDeckPath = "";
    }

    this.configFilePath = path.join(this.streamDeckPath, "ProfilesV2");
  }

  getAllProfiles(): Profile[] {
    if (!fs.existsSync(this.configFilePath)) {
      console.error(JSON.stringify({ error: "Profiles directory not found" }));
      return [];
    }

    return fs
      .readdirSync(this.configFilePath)
      .map((folder) => {
        const manifestPath = path.join(
          this.configFilePath,
          folder,
          "manifest.json"
        );
        if (!fs.existsSync(manifestPath)) return null;

        try {
          const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
          if (!data.Name) return null;

          console.log(data)

          return {
            id: folder,
            name: String(data.Name),
            isDefault: Boolean(data.IsDefault),
          } as Profile;
        } catch (error: any) {
          console.error(
            JSON.stringify({
              error: `Could not read ${folder}/manifest.json: ${error.message}`,
            })
          );
          return null;
        }
      })
      .filter((profile): profile is Profile => profile !== null);
  }

  setDefaultProfile(profileId: string): boolean {
    try {
      //TODO fiks setting the default profile
      return true;
    } catch (error) {
      console.error("Error setting default profile:", error);
      return false;
    }
  }

  getDefaultProfile(): Profile | null {
    const profiles = this.getAllProfiles();
    return profiles.find((p) => p.isDefault) || null;
  }
}
