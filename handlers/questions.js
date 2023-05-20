const Question = require('../database/models/questionModel');

const getQuestions = async (req, res) => {
	const { language, level } = req.query;

	try {
		const questions = await Question.find({
			language: language,
			level: level,
		});

		// console.log('QUESTION: ', questions);

		if (!questions) {
			res.status(404).json({ error: 'No questions found' });
			return;
		}

		res.json({ questions });
	} catch (error) {
		console.error('Error fetching questions:', error);
		res.status(500).json({ error: 'Error fetching questions' });
	}
};

module.exports = { getQuestions };
