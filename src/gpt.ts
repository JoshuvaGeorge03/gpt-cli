import dotenv from 'dotenv';
import fetch from 'node-fetch';
import type { CreateChatCompletionRequest } from 'openai';
import os from 'os';
import path from 'path';
import '../gpt-config.env';
import logger from './log';
import { getTypeOf } from './utils';

dotenv.config({ path: path.resolve(__dirname, 'gpt-config.env'), debug: true });

const openAIBaseURL = `https://api.openai.com/v1/`;
const openAiKey = process.env.OPEN_API_KEY as string;
console.log('value', openAiKey);

// let gptResponse = '';

async function askGpt(question: string): Promise<void> {
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
			gptRes.body.on('data', (data) => {
				// parseEventStreamData();
				logger(getTypeOf(data), 'data type');
				// const textDecoderFromTypedArray = new TextDecoder('UTF-8');
				// const decodedData = textDecoderFromTypedArray.decode(data);
				// logger(decodedData, 'decoded data');
				// logger(getTypeOf(decodedData), 'type of decoded data');
				// JSON.parse(decodedData);
				// logger(Buffer.from(data).toJSON(), 'buffer data');
			});

			gptRes.body.on('end', () => {
				console.log('response completed');
			});
		})
		.catch((err) => {
			console.warn('error', err);
			return err;
		});
}

function parseEventStreamData(eventText: string): void {
	console.log('event text', eventText);
	eventText.split(/\n|\r\n|\r/).forEach((chunkValue) => {
		if (chunkValue?.length > 0) {
			const streamDataObj = JSON.parse(JSON.stringify(`{${chunkValue}}`));
			console.log('streamDataObj', streamDataObj, typeof streamDataObj);
			// const streamObjectContent = streamDataObj.choices[0].delta.content;
			console.log(
				'streamObjectContent',
				typeof streamDataObj,
				Object.values(streamDataObj)
			);
		}
	});
}

function getQuestionFromArgs(): string {
	const args = process.argv.slice(2);
	return args.join(' ');
}

const questionFromCli = getQuestionFromArgs();
console.log('question from cli', questionFromCli);

askGpt(questionFromCli)
	.then((aiValue) => {
		// console.log('aiValue', gptResponse);
	})
	.catch((err) => {
		console.error('err aivalue', err);
	});
