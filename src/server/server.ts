import express from 'express';
import cors from 'cors';
import { ProfileManager } from './profileManager';
import { resetStreamDeck } from './streamDeckReloader';

/**
 * All of the API endpoints and server setup
 */
export class Server {
  private app: express.Application;
  private server: any;
  private port: number;
  private profileManager: ProfileManager;
  
  constructor(port: number = 37337) {
    this.port = port;
    this.app = express();
    this.profileManager = new ProfileManager();
    
    this.setupMiddleware();
    this.setupRoutes();
  }
  
  private setupMiddleware() {
    // Enable CORS for plugin requests
    this.app.use(cors());
    this.app.use(express.json());
    
    // Log requests
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`)
      next();
    });
  }
  
  private setupRoutes() {
    // Define API endpoints
    this.app.get('/profiles', (req, res) => {
      try {
        const profiles = this.profileManager.getAllProfiles();
        console.log(profiles)
        res.json({ success: true, profiles });
      } catch (error) {
        console.log('Error getting profiles:', error)
        res.status(500).json({ success: false, error: 'Failed to get profiles' });
      }
    });

    // Get default profile
    this.app.get('/profiles/default', (req, res) => {
      try {
        const defaultProfile = this.profileManager.getDefaultProfile();
        if (defaultProfile) {
          res.json({ success: true, profile: defaultProfile });
        } else {
          res.json({ success: true, profile: null });
        }
      } catch (error) {
        console.log('Error getting default profile:', error);
        res.status(500).json({ success: false, error: 'Failed to get default profile' });
      }
    });
    
    // Set default profile
    this.app.post('/profiles/:id/default', async (req, res) => {
      try {
        const profileId = req.params.id;
        const success = this.profileManager.setDefaultProfile(profileId);
        if (success) {
          console.log("Setted the new Defualt profile")
          await resetStreamDeck();
          res.json({ success: true });
        } else {
          res.status(404).json({ success: false, error: 'Profile not found or could not be set as default' });
        }
      } catch (error) {
        console.log('Error setting default profile:', error);
        res.status(500).json({ success: false, error: 'Failed to set default profile' });
      }
    });
   
    /**
     * Reset Stream Deck (restart and clear cache)
     */
    this.app.post('/streamdeck/reset', async (req, res) => {
      try {
        const success = await resetStreamDeck();
        if (success) {
          res.json({ success: true, message: 'Stream Deck has been reset' });
        } else {
          res.status(500).json({ success: false, error: 'Failed to reset Stream Deck' });
        }
      } catch (error) {
        console.log('Error resetting Stream Deck:', error);
        res.status(500).json({ success: false, error: 'Failed to reset Stream Deck' });
      }
    });
  }
  
  public start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Profile manager server running on port ${this.port}`)
    });
    
    return this.server;
  }
  
  public stop() {
    if (this.server) {
      this.server.close();
      console.log('Server shit down')
    }
  }
}