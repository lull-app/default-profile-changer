import { Server } from './server';

/**
 * Creating and starting the server
 */
const server = new Server(37337);
server.start();

console.log('Profile manager server started on port 37337');

// Handeling shutdown (when pressing ctrl+c for example)
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.stop();
  process.exit(0);
});