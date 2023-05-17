const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
    unique: true,
  },
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
