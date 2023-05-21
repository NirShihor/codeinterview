const express = require('express');
const router = express.Router();

const Question = require('../database/models/questionModel');

router.post('/', async (req, res) => {
	const index = req.body.index;
	const text = req.body.text;
	const language = req.body.language;
	const level = req.body.level;
	console.log('Request body:', req.body); // Log the request body

	try {
		const newQuestion = new Question({ index, text, language, level });
		console.log(newQuestion);
		await newQuestion.save();
		res.status(200).json({ message: 'Question added successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

module.exports = router;
