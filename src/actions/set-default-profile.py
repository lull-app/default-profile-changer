import os
import json
import sys

# TODO: only adds the default profile identifier.. but we also have to remove it from the old one

PROFILES_DIR = os.path.expanduser("~\\AppData\\Roaming\\Elgato\\StreamDeck\\ProfilesV2")

def set_default_profile(profile_name):
    profile_path = os.path.join(PROFILES_DIR, f"{profile_name}.json")

    if not os.path.exists(profile_path):
        print(json.dumps({"error": f"Profile {profile_name} not found"}))
        return

    # Load the profile JSON file
    with open(profile_path, "r", encoding="utf-8") as file:
        profile_data = json.load(file)

    # Modify the profile to set it as the default
    profile_data["AppIdentifier"] = "*"  # This makes it the default profile

    # Save the changes
    with open(profile_path, "w", encoding="utf-8") as file:
        json.dump(profile_data, file, indent=4)

    print(json.dumps({"success": f"Default profile set to {profile_name}"}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No profile name provided"}))
    else:
        set_default_profile(sys.argv[1])
