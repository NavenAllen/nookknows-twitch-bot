import * as tmi from 'tmi.js';
import 'dotenv/config';

import {fetchVillager} from './api';

// Define configuration options
const opts = {
  options: {debug: true},
  identity: {
    username: 'nookknows',
    password: process.env.OAUTH_TOKEN,
  },
  channels: ['nookknows'],
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(
  target: string,
  context: tmi.ChatUserstate,
  msg: string,
  self: Boolean
) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr: string, port: Number) {
  console.log(`* Connected to ${addr}:${port}`);
  console.log(fetchVillager('ribbot'));
}
