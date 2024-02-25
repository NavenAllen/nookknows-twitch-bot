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
  channel: string,
  context: tmi.ChatUserstate,
  msg: string,
  self: Boolean
) {
  const command = msg.split(' ');

  if (self) {
    return
  }

  console.log(channel)
  // If the command is known, let's execute it
  if(channel === '#nookknows') {
    if(command[0] === '!modaction') {
      const moderators = process.env.MODERATORS?.split(",")
      if(moderators!.includes(context.username!)) {
        if (command[1] === 'join') {
          if (command.length !== 3) {
            client.say(channel, 'Usage: !modaction join <channel_name>');
          } else {
            client.join(`#${command[2].toLowerCase()}`)
          }
          console.log(`* JOINED ${command[1]}`);
        } else if (command[1] === 'leave') {
          if (command.length !== 3) {
            client.say(channel, 'Usage: !modaction leave <channel_name>');
          } else {
            client.part(`#${command[2].toLowerCase()}`)
          }
          console.log(`* LEFT ${command[1]} :(`);
        } 
      } else {
        client.say(channel, "You do not have the permission to do that!!")
      }
    } else if (command[0] === '!join') {
      client.join(context.username!)
      console.log(`* JOINED ${context.username!}`);
    } else if (command[0] === '!leave') {
      client.part(context.username!)
      console.log(`* LEFT ${context.username!} :(`);
    }
    return
  }

  if (command[0] === '!villager') {
    if (command.length !== 2) {
      client.say(channel, 'Usage: !villager <villager_name>');
    } else {
      fetchVillager(command[1]).then((message: string) => {
        client.say(channel, message);
      });
    }
  } else {
    console.log(`* Unknown command ${command[0]}`);
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
  fetchVillager('ribbot').then((data: string) => console.log(data));
}
