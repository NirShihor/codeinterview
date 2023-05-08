const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');
const app = express();
const port = process.env.PORT || 3002;

const questionsData = require('./client/src/data/questions.json');
console.log('QUESTIONS: ', questionsData);

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client', 'build')));

dotenv.config();

const corsOptions = {
	origin:
		process.env.ENV === 'production'
			? process.env.CLIENT_URL
			: 'http://localhost:3000',
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let questionText = '';

app.post('/question', async (req, res) => {
	const questionIndex = req.body.questionIndex;
	const question = questionsData.questions[questionIndex].text;
	const language = req.body.language;
	console.log('QUESTION', question);
	questionText = await question;
	console.log('QUESTION TEXT: ', questionText);

	const answer = req.body.answer;
	console.log('ANSWER', answer);

	const conversations = {
		question: question,
		answer: answer,
		language: language,
		history: [
			{
				role: 'user',
				content: `How would you verify a prime number?`,
			},
			{
				role: 'user',
				content: `I'd count to 10`,
			},
			{
				role: 'assistant',
				content: `No, counting to 10 is not the correct answer to the question of how to verify a prime number. One of the most common ways to check if a number is prime is to divide it by every integer from 2 to the square root of the number (rounded up to the nearest integer) and see if any of them evenly divide the number. If none of them do, then the number is prime. Another method is to use the Sieve of Eratosthenes to generate a list of prime numbers and check if the number is in that list. Would you like me to provide more information on either of these methods?`,
			},
			{
				role: 'user',
				content: `Yes please`,
			},
			{
				role: 'assistant',
				content: `To verify a prime number, you can use a function that checks if the number is divisible by any integer smaller than itself and larger than 1. If the number is only divisible by itself and 1, then it is a prime number. So, you can write a function that takes an integer as input, then checks if it is divisible by any integer from 2 to the square root of that number. If it is not divisible by any integer in this range, then it is a prime number.`,
			},
			{
				role: 'system',
				content: `You are a helpful assistant called Professor Code. 
				Your task is to help software developers to prepare for interviews in ${language}. 
				The way you do it is that the website provides a coding question, and the user provides an answer to that question. You then check if the answer is correct, and if it is not, you provide a correct answer. 
				If the user's answer is correct, you do not provide any answer, and only return: 'Well done! That is the correct answer. 
				Do not, under any circumstances, say anything like 'I apologize for the confusion earlier.' 
				Do not, under any circumstances, say anything like 'Thank you for explaining the task to me.'
				Do not, under any circumstances, say anything like 'If the user answered with.'
				The question is ${question} and your primary goal is to check if the ${answer} is the correct answer to the ${question} and provide the user with the relevant feedback. 
				If there are more than one correct answer, provide only one of them, the most simple one. But add in your answer that there are more possible answers and ask if the user wants to be given another answer by you. 
				If you ask the user if they want to know more or anything to that effect, and ${answer} includes 'yes', then this means that the user wishes to accept your invitation to provide more information. In such a case, ignore ${question} and do provide more information. 
				If you ask the user if they want to know more or anything to that effect, and ${answer} includes 'no', then this means that the user does not wishes to accept your invitation to provide more information. In such a case, ignore ${question} and just respond with 'That's fine. Thank you.'`,
			},
		],
	};

	try {
		const gptResponse = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: conversations.history,
		});

		const chatGptAnswer = gptResponse.data.choices[0].message.content;

		res.json({
			isCorrect: answer === chatGptAnswer.trim(),
			aiAnswer: chatGptAnswer,
		});
	} catch (error) {
		console.error('Error searching:', error);
		res.status(500).json({ error: 'Error processing the search' });
	}
});

app.post('/code', async (req, res) => {
	const question = questionText;
	console.log('QUESTION2: ', question);
	const code = await req.body.code;
	const language = req.body.language;
	const answer = code;
	console.log('*ANSWER*', answer);

	const conversations = {
		question: question,
		language: language,
		history: [
			{
				role: 'user',
				content: `How would you assign a value to a variable?`,
			},
			{
				role: 'user',
				content: `var firstName = 'John';`,
			},
			{
				role: 'assistant',
				content: `Well done! That is the correct answer. Your code is correct!`,
			},
			{
				role: 'user',
				content: `How would you assign a value to a variable?`,
			},
			{
				role: 'user',
				content: `function someFunction () => { return 'Hello World' }`,
			},
			{
				role: 'assistant',
				content: `No, that is not the correct answer. The correct answer is:var firstName = 'John';`,
			},
			{
				role: 'user',
				content: `How would you verify a prime number?`,
			},
			{
				role: 'user',
				content: `function someFunction () => { return 'Hello World' }`,
			},
			{
				role: 'assistant',
				content: `The code "function someFunction () => { return 'Hello World' }" is not the correct answer to "How would you verify a prime number?". To verify if a number is prime, we can use the following basic algorithm:  function isPrime(number) { if (number <= 1) { return false; } // Check if any number smaller than this number, but greater than 1, is a divisor. for (let i = 2; i < number; i++) { if (number % i === 0) { return false; } } return true; }  This function takes a number as an argument and returns true if the number is prime, and false otherwise.`,
			},
			{
				role: 'user',
				content: `How do you assign a value to a variable?`,
			},
			{
				role: 'user',
				content: `By counting to 10`,
			},
			{
				role: 'assistant',
				content: `No, the correct answer to "How do you assign a value to a variable?" is to use the keyword "var" followed by the variable name and the equals sign "=" and then the value you want to assign to the variable. Here is an example: var myVariable = "Hello World"; This code creates a variable called "myVariable" and assigns the string "Hello World" to it.`,
			},

			{
				role: 'system',
				content: `You are a helpful assistant called Professor Code. 
				Your task is to help software developers to prepare for interviews in ${language}.
				The questions and answer should relate to ${language}.
				If ${answer} is not the correct way to answer ${question}, then you should provide the code in code format that is the correct way to answer ${question}.
				To format code in your answer, please wrap the code part it in three backticks.
				Do not, under any cirumstances, say 'I apologize for the confusion earlier.'
				Do not, under any cirumstances, say 'I apologise for the previous response.'
				Do not, under any cirumstances, say 'Apologies, the previous answer was not the correct way to verify if a number is prime.'
				Do not, under any circumstance, apologies for anything.
				When providing code, anything that is not code, put into the appropriate comment format.
				Do not, under any circumstances, say anything like 'Regarding the previous message, the code "function hello() { console.log("Professor Code"); }" is not a correct answer to the question "How would you verify a prime number?".'
				Do not, under any circumstances, mention your previous answer. 
				Do not, under any circumstance, apologise. 
				The question is ${question} and your primary goal is to check if the ${answer} is the correct answer to the ${question} and provide the user with the relevant feedback.,
				Do not, under any circumstance, apologise.`,
			},
		],
	};

	try {
		const gptResponse = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: conversations.history,
		});

		const codeChatGptAnswer = gptResponse.data.choices[0].message.content;
		console.log('GPT ANSWER', codeChatGptAnswer);

		res.json({
			isCorrect: answer === codeChatGptAnswer.trim(),
			aiAnswer: codeChatGptAnswer,
		});
	} catch (error) {
		console.error('Error searching:', error);
		res.status(500).json({ error: 'Error processing the search' });
	}
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
