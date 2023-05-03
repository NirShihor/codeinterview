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

app.post('/question', async (req, res) => {
	const questionIndex = req.body.questionIndex;
	const question = questionsData.questions[questionIndex].text;
	console.log('QUESTION', question);

	const answer = req.body.answer;
	console.log('ANSWER', answer);

	const conversations = {
		question: question,
		answer: answer,
		history: [
			{
				role: 'user',
				content: `the question is ${question}. Is ${answer} the correct answer to the ${question}?`,
			},
			{
				role: 'user',
				content: `the question is: How would you verify a prime number?`,
			},
			{
				role: 'assistant',
				content: `1. Divide the number by the smallest prime number possible (2 is usually the smallest prime number). 2. If the remainder is 0, then the number has 2 as a factor. Divide the resulting quotient by 2 and repeat the process until the remainder is not 0 anymore. 3. If the remainder is not 0, move on to the next prime number and repeat the process until all prime factors are found. Keep dividing the quotient with the next prime number until the remainder is not 0 anymore. 4. Continue until the quotient becomes 1 and all prime factors have been identified.`,
			},
			{
				role: 'user',
				content: `the question is: How would you verify a prime number?`,
			},
			{
				role: 'user',
				content: `Looking at the moon`,
			},
			{
				role: 'assistant',
				content: `No. I'm afraid that looking at the moon is not the correct answer`,
			},
			{
				role: 'system',
				content: `You are a helpful assistant that checks the answers of the user. When providing an answer to a user's wrong answer, do not repeat the question, and if there are multiple solutions, provide only one of them. Do not include this in your answer: 'Yes, here is one method to find'. Do not include this in your answer: 'The correct answer is:'. Only provide the answer, without adding any text in front of it. If the user's answer is correct, do not provide any answer, and only return: 'Well done! That is the correct answer.' Do not return 'The correct answer is:' as part of your response if the user provided to correct answer.`,
			},
		],
	};

	try {
		const gptResponse = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: conversations.history,
		});

		console.log('GPT RESPONSE', gptResponse.data);
		console.log('GPT RESPONSE2', gptResponse.data.choices[0].message);

		const chatGptAnswer = gptResponse.data.choices[0].message.content;
		console.log('CHAT GPT ANSWER', chatGptAnswer);

		res.json({
			isCorrect: answer === chatGptAnswer.trim(),
			aiAnswer: chatGptAnswer,
		});

		// aiAnswer = gptResponse.data.choices[0].message.content;
		// console.log('AI ANSWER', aiAnswer);

		// console.log('GPT RESPONSE', gptResponse);

		// const correctAnswer = gptResponse.data.answers[0];
		// console.log('CORRECT ANSWER', correctAnswer);

		// res.json({ isCorrect: answer === correctAnswer.trim() });
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
