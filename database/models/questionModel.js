const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
	index: Number,
	text: String,
	language: String,
	level: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
