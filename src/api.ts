import axios from 'axios';
import 'dotenv/config';
import OpenAI from 'openai';

import {apiProperties} from './state/apiDetails';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

interface Response {
  name: string;
  url: string;
  species: string;
  personality: string;
  gender: string;
  sign: string;
  quote: string;
  phrase: string;
}

export const fetchVillager = (name: string) => {
  const villagerProperties = apiProperties['villagers'];

  const options = {
    method: 'GET',
    url: 'https://api.nookipedia.com/' + villagerProperties.endpoint,
    params: {name: name},
    headers: {
      'X-API-KEY': process.env.NOOKIPEDIA_API_KEY,
      'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
    },
  };

  axios
    .request(options)
    .then(async ({data}: {data: Response}) => {
      const chatbotMessages = villagerProperties.gpt_message;
      chatbotMessages.push({
        role: 'user',
        content:
          'Give me a message that includes the following data about a villager: ' +
          JSON.stringify(data),
      });
      const completion = await openai.chat.completions.create({
        messages: chatbotMessages,
        model: 'gpt-3.5-turbo',
      });

      console.log(completion.choices[0].message);
    })
    .catch((error: any) => {
      console.error(error);
    });
};
