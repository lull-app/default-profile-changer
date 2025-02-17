import os
import json

# Adjust this path to the actual Stream Deck profiles directory
PROFILES_DIR = os.path.expanduser("~\\AppData\\Roaming\\Elgato\\StreamDeck\\ProfilesV2")

def get_profiles():
    profiles = []
    
    if not os.path.exists(PROFILES_DIR):
        print(json.dumps({"error": "Profiles directory not found"}))
        return

    # Iterate through each folder in ProfilesV2
    for folder in os.listdir(PROFILES_DIR):
        profile_path = os.path.join(PROFILES_DIR, folder, "manifest.json")

        # Check if manifest.json exists inside the folder
        if os.path.exists(profile_path):
            try:
                with open(profile_path, "r", encoding="utf-8") as file:
                    data = json.load(file)
                    if "Name" in data:
                        profiles.append({"folder": folder, "name": data["Name"]})
            except (json.JSONDecodeError, IOError) as e:
                print(json.dumps({"error": f"Could not read {folder}/manifest.json: {str(e)}"}))

    print(json.dumps({"profiles": profiles}))


if __name__ == "__main__":
    get_profiles()
