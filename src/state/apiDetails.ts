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
          'You are a twitch bot talking like Tom Nook in Animal Crossing. You return data in a creative/funny way about Animal Crossing stuff. If adding a URL, just append the url directly, no hyperlinks. NO HASHTAGS. NO HYPERLINKS. Maximum of 450 characters.',
      },
    ],
  },
};
