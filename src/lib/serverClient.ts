
export class ServerClient {
  private baseUrl: string;
  
  constructor(port = 37337) {
    this.baseUrl = `http://localhost:${port}`;
  }
  
  /**
   * Check if the server is running
   */
  async isServerRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('Server check failed:', error);
      return false;
    }
  }
 
  /**
   * Get all profiles from the server
   */
  async getAllProfiles(): Promise<any[]> {
    try {
      console.log("Fetching profiles");
      const response = await fetch(`${this.baseUrl}/profiles`);
     
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
     
      const data: any = await response.json();
      return data.profiles || [];
    } catch (error) {
      console.error('Error getting profiles from server:', error);
      return [];
    }
  }

  /**
   * Get the default profile
   */
  async getDefaultProfile(): Promise<any | null> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles/default`);
     
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
     
      const data: any = await response.json();
      return data.profile || null;
    } catch (error) {
      console.error('Error getting default profile:', error);
      return null;
    }
  }
  
  /**
   * Set the default profile
   */
  async setDefaultProfile(profileId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles/${profileId}/default`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data: any = await response.json();
      return data.success || false;
    } catch (error) {
      console.error('Error setting default profile:', error);
      return false;
    }
  }

 /**
   * Reset the Stream Deck application (restart and clear cache)
   *
  async resetStreamDeck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/streamdeck/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
     
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
     
      const data: any = await response.json();
      return data.success || false;
    } catch (error) {
      console.error('Error resetting Stream Deck:', error);
      return false;
    }
  }
  */
}

