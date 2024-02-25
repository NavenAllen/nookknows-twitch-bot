import axios from "axios"
import 'dotenv/config'

interface Response {
    name: string,
    url: string,
    species: string,
    personality: string,
    gender: string,
    sign: string,
    quote: string,
    phrase: string,
}

export const fetchVillager = (name: string) => {
    const options = {
		method: 'GET',
		url: 'https://api.nookipedia.com/' + "villagers",
		params: { name: name },
		headers: {
			'X-API-KEY': process.env.NOOKIPEDIA_API_KEY,
			'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
		},
	};

    axios
        .request(options)
        .then(function ({ data }: { data: Response }) {
            console.log(data);
        })
        .catch(function (error: any) {
            console.error(error);
        });
}