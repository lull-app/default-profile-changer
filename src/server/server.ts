import express from 'express';
import cors from 'cors';
import { ProfileManager } from './profileManager';
// import { StreamDeckReloader } from './streamDeckReloader';

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
        res.json({ success: true, profiles });
      } catch (error) {
        console.log('Error getting profiles:', error)
        res.status(500).json({ success: false, error: 'Failed to get profiles' });
      }
    });
    
    // Add more routes here
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