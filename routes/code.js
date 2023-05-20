const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const Question = require('../database/models/questionModel');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
	const code = req.body.code;
	const questionIndex = req.body.questionIndex;
	const language = req.query.language;
	const level = req.query.level;

	console.log('CODE QUESTION INDEX:', questionIndex);
	console.log('CODE LANGUAGE:', language);
	console.log('CODE LEVEL:', level);
	console.log('CODE:', code);

	try {
		const questionDoc = await Question.findOne({
			language: language,
			level: level,
			index: questionIndex,
		});

		if (!questionDoc) {
			res.status(404).json({ error: 'Question not found' });
			return;
		}

		const latestQuestion = questionDoc.text;

		console.log('QUESTION FROM CODE:', latestQuestion);

		const conversations = {
			question: latestQuestion,
			language: language,
			level: level,
			code: code,
			history: [
				{
					// key: 'message1',
					role: 'user',
					content: `How would you assign a value to a variable?`,
				},
				{
					// key: 'message2',
					role: 'user',
					content: `var firstName = 'John';`,
				},
				{
					// key: 'message3',
					role: 'assistant',
					content: `Well done! That is the correct answer. Your code is correct!`,
				},
				{
					// key: 'message4',
					role: 'user',
					content: `How would you assign a value to a variable?`,
				},
				{
					// key: 'message5',
					role: 'user',
					content: `function someFunction () => { return 'Hello World' }`,
				},
				{
					// key: 'message6',
					role: 'assistant',
					content: `No, that is not the correct answer. The correct answer is:var firstName = 'John';`,
				},
				{
					// key: 'message7',
					role: 'user',
					content: `How would you verify a prime number?`,
				},
				{
					// key: 'message8',
					role: 'user',
					content: `function someFunction () => { return 'Hello World' }`,
				},
				{
					// key: 'message9',
					role: 'assistant',
					content: `The code "function someFunction () => { return 'Hello World' }" is not the correct answer to "How would you verify a prime number?". To verify if a number is prime, we can use the following basic algorithm:  function isPrime(number) { if (number <= 1) { return false; } // Check if any number smaller than this number, but greater than 1, is a divisor. for (let i = 2; i < number; i++) { if (number % i === 0) { return false; } } return true; }  This function takes a number as an argument and returns true if the number is prime, and false otherwise.`,
				},
				{
					// key: 'message10',
					role: 'user',
					content: `How do you assign a value to a variable?`,
				},
				{
					// key: 'message11',
					role: 'user',
					content: `By counting to 10`,
				},
				{
					// key: 'message12',
					role: 'assistant',
					content: `No, the correct answer to "How do you assign a value to a variable?" is to use the keyword "var" followed by the variable name and the equals sign "=" and then the value you want to assign to the variable. Here is an example: var myVariable = "Hello World"; This code creates a variable called "myVariable" and assigns the string "Hello World" to it.`,
				},

				{
					// key: 'message13',
					role: 'system',
					content: `You are a helpful assistant called Professor Code.
					Your task is to help software developers to prepare for interviews in ${language}.
					The questions and answer should relate to ${language}.
					If ${code} is not the correct way to answer ${latestQuestion}, then you should provide the code in code format that is the correct way to answer ${latestQuestion}.
					To format code in your answer, please wrap the code part it in three backticks.
					Do not, under any cirumstances, say 'I apologize for the confusion earlier.'
					Do not, under any cirumstances, say 'I apologise for the previous response.'
					Do not, under any cirumstances, say 'Apologies, the previous answer was not the correct way to verify if a number is prime.'
					Do not, under any circumstance, apologies for anything.
					When providing code, anything that is not code, put into the appropriate comment format.
					Do not, under any circumstances, say anything like 'Regarding the previous message, the code "function hello() { console.log("Professor Code"); }" is not a correct answer to the question "How would you verify a prime number?".'
					Do not, under any circumstances, mention your previous answer.
					Do not, under any circumstance, apologise.
					The question is ${latestQuestion} and your primary goal is to check if the ${code} is the correct answer to the ${latestQuestion} and provide the user with the relevant feedback.,
					Do not, under any circumstance, apologise.`,
				},
			],
		};

		const gptResponse = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: conversations.history,
		});

		const codeChatGptAnswer = gptResponse.data.choices[0].message.content;
		console.log('GPT ANSWER', codeChatGptAnswer);

		res.json({
			isCorrect: code === codeChatGptAnswer.trim(),
			aiAnswer: codeChatGptAnswer,
		});
	} catch (error) {
		console.error('Error searching:', error);
		res.status(500).json({ error: 'Error processing the search' });
	}
});

module.exports = router;
