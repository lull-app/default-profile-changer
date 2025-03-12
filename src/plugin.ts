import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { SwitchDefaultProfile } from "./actions/default-profile-changer";
import { ServerClient } from "./lib/serverClient";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Constant
const SERVER_PORT = 37337;

const serverClient = new ServerClient(SERVER_PORT);


// Register the increment action.
streamDeck.actions.registerAction(new SwitchDefaultProfile());


// Finally, connect to the Stream Deck.
streamDeck.connect().then(() => {
  streamDeck.logger.info('Plugin connected to Stream Deck');
}).catch(err => {
  streamDeck.logger.error('Failed to connect to Stream Deck:', err);
});
