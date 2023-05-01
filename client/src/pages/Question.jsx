import React, { useState } from 'react';
import questionsData from '../data/questions.json';

const Question = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const handleNextQuestion = () => {
		if (currentQuestionIndex < questionsData.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			// !Not sure if we want to reset back to the first question if at the end of the array as below
			setCurrentQuestionIndex(0);
			//   TODO - add action when arriving at the end of the quesitons
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
