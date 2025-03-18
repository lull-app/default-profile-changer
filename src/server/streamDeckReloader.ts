import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

/**
 * Script to kill the Stream Deck process, delete the cache file, and restart Stream Deck
 */
export async function resetStreamDeck(): Promise<boolean> {
  console.log("Starting Stream Deck reset process...");
  
  try {
    // Killing the Stream Deck process
    if (process.platform === 'win32') {
      console.log("Attempting to kill StreamDeck.exe...");
      child_process.execSync('taskkill /F /IM "StreamDeck.exe" /T', { stdio: 'ignore' });
    } else if (process.platform === 'darwin') { // darwin is MacOs <3
      console.log("Attempting to kill Stream Deck on macOS...");
      child_process.execSync('pkill -f "Stream Deck"', { stdio: 'ignore' });
    } else {
      console.error("Unsupported platform. This script only works on Windows and macOS.");
      return false;
    }
    
    // Wait for the process to fully close
    console.log("Waiting for process to close...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Deleting Cache.db
    let cachePath = '';
    if (process.platform === 'win32') {
      cachePath = path.join(process.env.APPDATA || '', 'Elgato', 'StreamDeck', 'Cache.db');
    } else if (process.platform === 'darwin') {
      cachePath = path.join(process.env.HOME || '', 'Library/Application Support/com.elgato.StreamDeck/Cache.db');
    }
    
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      console.log("Cache.db deleted successfully!");
    } else {
      console.log("Cache.db not found, skipping...");
    }
    
    // Restart Stream Deck
    let streamDeckPath = '';
    if (process.platform === 'win32') {
      streamDeckPath = path.join(process.env.PROGRAMFILES || '', 'Elgato', 'StreamDeck', 'StreamDeck.exe');
    } else if (process.platform === 'darwin') {
      streamDeckPath = '/Applications/Stream Deck.app';
    }
    
    if (fs.existsSync(streamDeckPath)) {
      if (process.platform === 'win32') {
        child_process.spawn(streamDeckPath, [], { detached: true, stdio: 'ignore' }).unref();
      } else if (process.platform === 'darwin') {
        child_process.spawn('open', [streamDeckPath], { detached: true, stdio: 'ignore' }).unref();
      }
      console.log("Stream Deck restarted!");
      return true;
    } else {
      console.error("Stream Deck executable not found at:", streamDeckPath);
      return false;
    }
    
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
}

// Run the function
resetStreamDeck().catch(console.error);