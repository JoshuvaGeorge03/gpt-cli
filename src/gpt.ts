import dotenv from 'dotenv';
import fetch from 'node-fetch';
import type {
	CreateChatCompletionRequest,
	CreateChatCompletionResponse
} from 'openai';
import os from 'os';
import path from 'path';
import '../gpt.env';

dotenv.config({ path: path.resolve(__dirname, 'gpt.env'), debug: false });

const openAIBaseURL = `https://api.openai.com/v1/`;
const openAiKey = process.env.OPEN_API_KEY as string;

async function askGpt(question: string): Promise<CreateChatCompletionResponse> {
	const openAiChatUrl = `${openAIBaseURL}chat/completions`;
	const openAiPayload: CreateChatCompletionRequest = {
		messages: [
			{
				role: 'user',
				content: question,
				name: os.hostname()
			}
		],
		model: 'gpt-3.5-turbo',
		stream: true,
		temperature: 1.4
	};
	return fetch(openAiChatUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${openAiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(openAiPayload)
	})
		.then((gptRes) => {
			return gptRes.text();
		})
		.then((resObj) => {
			return parseEventStreamData(resObj);
		})
		.catch((err) => {
			console.warn('error', err);
			return err;
		});
}

function parseEventStreamData(eventText: string): string {
	console.log('event text', eventText);
	return eventText;
}

function getQuestionFromArgs(): string {
	const args = process.argv.slice(2);
	return args.join(' ');
}

const questionFromCli = getQuestionFromArgs();
console.log('question from cli', questionFromCli);

askGpt(questionFromCli)
	.then((aiValue) => {
		console.log('aiValue', aiValue);
	})
	.catch((err) => {
		console.error('err aivalue', err);
	});
