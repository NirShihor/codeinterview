const { Configuration, OpenAIApi } = require('openai');
const Question = require('../database/models/questionModel');
const dotenv = require('dotenv');
dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const questionHandler = async (req, res) => {
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

		question = questionDoc.text;

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
};

module.exports = { questionHandler };
