import * as fs from "fs";
import * as path from "path";

export interface Profile {
  id: string;
  name: string;
  isDefault?: boolean;
}

/**
 * The ProfileManager manages all of the profile File Logic
 */
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

          return {
            id: folder,
            name: String(data.Name),
            isDefault: data.AppIdentifier === "*", 
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
    const profiles = this.getAllProfiles();
    
    // Find the profile we want to make default
    const targetProfile = profiles.find(p => p.id === profileId);
    if (!targetProfile) {
      console.log(profiles)
      console.error(JSON.stringify({ error: `Profile with ID ${profileId} not found` }));
      return false;
    }
    
    // Update all profiles' manifest files
    for (const profile of profiles) {
      const manifestPath = path.join(
        this.configFilePath,
        profile.id,
        "manifest.json"
      );
      
      if (!fs.existsSync(manifestPath)) continue;
      
      try {
        // Read the manifest file
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        
        // Set or remove the IsDefault flag based on whether it's our target profile
        if (profile.id === profileId) {
          manifest.AppIdentifier = "*";
        } else if (manifest.AppIdentifier === "*") {
          // Remove the IsDefault flag from any other profile
          delete manifest.AppIdentifier;
        }
        
        // Write the updated manifest back to file
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
      } catch (error: any) {
        console.error(
          JSON.stringify({
            error: `Could not update ${profile.id}/manifest.json: ${error.message}`,
          })
        );
      }
    }
    
    return true;
  } catch (error: any) {
    console.error(JSON.stringify({ error: `Error setting default profile: ${error.message}` }));
    return false;
  }
}

  getDefaultProfile(): Profile | null {
    const profiles = this.getAllProfiles();
    return profiles.find((p) => p.isDefault) || null;
  }
}
