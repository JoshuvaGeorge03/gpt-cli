import dotenv from 'dotenv';
import fetch from 'node-fetch';
import type { CreateChatCompletionRequest } from 'openai';
import os from 'os';
import path from 'path';
import '../gpt-config.env';

dotenv.config({
	path: path.resolve(__dirname, 'gpt-config.env'),
	debug: false
});

const openAIBaseURL = `https://api.openai.com/v1/`;
const openAiKey = process.env.OPEN_API_KEY as string;

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
				const textDecoderFromTypedArray = new TextDecoder('UTF-8');
				const decodedData = textDecoderFromTypedArray.decode(data);
				try {
					parseEventStreamData(decodedData);
				} catch (error) {
					console.error('error', error);
				}
			});

			gptRes.body.on('end', () => {
				console.log('\n');
				console.log('%cQuery Successful', 'color:green;font-size:20px');
				console.log('\n');
			});
		})
		.catch((err) => {
			console.error('error in askGpt', err);
			return err;
		});
}

function parseEventStreamData(decodedData: string): void {
	const regexToSplitIncomingEventStream = /\n|\r\n|\r/; // because multiple server side data events can be send together in one flow, so we have to account for it, ex) data: "{"id": "jos"}\ndata: "{id:jso}""
	decodedData.split(regexToSplitIncomingEventStream).forEach((chunkValue) => {
		if (Boolean(chunkValue.length) && chunkValue !== 'data: [DONE]') {
			sanitizeEventValue(chunkValue);
		}
	});
}

function sanitizeEventValue(chunkValue: string): void {
	const santizedValue = chunkValue.replace(/data: /, '').trim();
	const sanitizedStreamData = JSON.parse(santizedValue);
	const sanitizedStreamDataContent =
		sanitizedStreamData.choices[0].delta.content;
	outputDataToStdOutStream(sanitizedStreamDataContent);
}

function outputDataToStdOutStream(eventText: string): void {
	if (eventText?.length > 0) {
		process.stdout.write(eventText);
	}
}

function getQuestionFromArgs(): string {
	const args = process.argv.slice(2);
	return args.join(' ');
}

const questionFromCli = getQuestionFromArgs();

askGpt(questionFromCli).catch((err) => {
	console.error('err aivalue', err);
});
