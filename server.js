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
				role: 'system',
				content:
					'You are a helpful assistant that checks the answers of the user.',
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
