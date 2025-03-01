import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { SwitchDefaultProfile } from "./actions/default-profile-changer";
import { Server } from "./server/server";
import { ServerClient } from "./lib/serverClient";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Constant
const SERVER_PORT = 37337;

const server = new Server(SERVER_PORT);
const serverClient = new ServerClient(SERVER_PORT);

server.start();

// Register the increment action.
streamDeck.actions.registerAction(new SwitchDefaultProfile());

// Finally, connect to the Stream Deck.
streamDeck.connect();

process.on("exit", () => {
  if (server) {
    server.stop();
  }
});
