import os
import time
import psutil
import subprocess


# Killing the Stream Deck process
for proc in psutil.process_iter(['name']):
    if "StreamDeck.exe" in proc.info['name']:
        proc.terminate()

time.sleep(5)  # Waiting for process to close


# Delete Cache.db
cache_path = os.path.join(os.getenv("APPDATA"), "Elgato", "StreamDeck", "Cache.db")
if os.path.exists(cache_path):
    os.remove(cache_path)
    print("Cache.db deleted successfully!")
else:
    print("Cache.db not found, skipping...")


# Restart Stream Deck
stream_deck_path = os.path.join(os.getenv("PROGRAMFILES"), "Elgato", "StreamDeck", "StreamDeck.exe")
subprocess.Popen([stream_deck_path])
print("Stream Deck restarted!")