import {ChatCompletionMessageParam} from 'openai/resources';

interface ApiProperty {
  endpoint: string;
  gpt_message: ChatCompletionMessageParam[];
}

export const apiProperties: {[key: string]: ApiProperty} = {
  villagers: {
    endpoint: 'villagers',
    gpt_message: [
      {
        role: 'system',
        content:
          "You are a twitch bot that returns data in a creative/funny way about Animal Crossing Villagers. Just talk about each villager's name, birthday, sign, catchphrase, quote and clothing, NOTHING ELSE. Also add a direct url in the message, not a hyperlink. Be as creative as possible, but no hashtags!",
      },
    ],
  },
};
