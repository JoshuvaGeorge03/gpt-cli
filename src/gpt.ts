#! /usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import type {
	CreateChatCompletionRequest,
	CreateChatCompletionResponse
} from 'openai';
import os from 'os';
import path from 'path';
import '../gpt.env';

dotenv.config({path: path.resolve(process.cwd(), 'gpt.env')});

const openAIBaseURL = `https://api.openai.com/v1/`;
const openAiKey: string = process.env.OPEN_API_KEY as string;
console.log('openai key', openAiKey);
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
		.then(async (gptRes) => {
			console.log('gptres', await gptRes.text());
			return gptRes.text();
		})
		.then((resObj) => {
			console.log('josh', resObj);
			return resObj;
		})
		.catch((err) => {
			console.warn('error', err);
			return err;
		});
}

askGpt('how to do a string manipulation in js?')
	.then((aiValue) => {
		console.log('aiValue', aiValue);
	})
	.catch((err) => {
		console.error('err aivalue', err);
	});
