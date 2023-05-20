const { Configuration, OpenAIApi } = require('openai');
const Question = require('../database/models/questionModel');
const dotenv = require('dotenv');

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const codeHandler = async (req, res) => {
	const code = req.body.code;
	const questionIndex = req.body.questionIndex;
	const language = req.query.language;
	const level = req.query.level;

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
				// ... other conversation messages
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
};

module.exports = { codeHandler };
