import axios from 'axios';
import 'dotenv/config';
import OpenAI from 'openai';

import {apiProperties} from './state/apiDetails';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

interface Villager {
  name: string;
  url: string;
  species: string;
  personality: string;
  gender: string;
  sign: string;
  quote: string;
  phrase: string;
}

export const fetchVillager = async (name: string): Promise<string> => {
  const villagerProperties = apiProperties['villagers'];
  let message: string | null = '';

  const options = {
    method: 'GET',
    url: 'https://api.nookipedia.com/' + villagerProperties.endpoint,
    params: {name: name},
    headers: {
      'X-API-KEY': process.env.NOOKIPEDIA_API_KEY,
      'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
    },
  };

  await axios
    .request(options)
    .then(async ({data}: {data: Villager[]}) => {
      if (data.length) {
        const response: Villager = {
          name: data[0].name,
          url: data[0].url,
          species: data[0].species,
          personality: data[0].personality,
          gender: data[0].gender,
          sign: data[0].sign,
          quote: data[0].quote,
          phrase: data[0].phrase,
        };
        const chatbotMessages = villagerProperties['gpt_message'];
        chatbotMessages.push({
          role: 'user',
          content:
            'Give me a message that includes the following data about a villager. Capitalize the personality: ' +
            JSON.stringify(response),
        });

        const completion = await openai.chat.completions.create({
          messages: chatbotMessages,
          model: 'gpt-3.5-turbo',
        });
        message = completion.choices[0].message.content;
      } else {
        message =
          'A villager with that name was not found! Maybe try again? :(';
      }
    })
    .catch((error: any) => {
      message =
        'Oops! Nook ran into trouble trying to fetch data. Maybe contact the admin?';
    });

  return message;
};
