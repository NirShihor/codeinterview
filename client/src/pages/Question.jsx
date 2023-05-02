import React, { useState } from 'react';
import questionsData from '../data/questions.json';
import axios from 'axios';

let apiURL;
if (process.env.NODE_ENV !== 'production') {
	apiURL = process.env.REACT_APP_API_URL;
} else {
	apiURL = '';
}

console.log('apiURL', process.env.REACT_APP_API_URL);

const Question = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const handleNextQuestion = async () => {
		if (currentQuestionIndex < questionsData.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			//! Not sure if we want to reset back to the first question if at the end of the array as below
			setCurrentQuestionIndex(0);
			//   TODO - petntially - add action when arriving at the end of the quesitons
		}

		// get the question
		const question = questionsData.questions[currentQuestionIndex].text;
		console.log(question);
		// send the question to chatGPT API
		try {
			await axios.post(`${apiURL}/question`, {
				question,
			});
		} catch (err) {
			console.error(err);
		}
	};

	const currentQuestion = questionsData.questions[currentQuestionIndex];
	return (
		<div>
			<div>Question</div>
			<h2>{currentQuestion.text}</h2>
			<button onClick={handleNextQuestion}>Next question</button>
		</div>
	);
};

export default Question;
