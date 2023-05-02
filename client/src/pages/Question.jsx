import React, { useState } from 'react';
import './question.css';
import questionsData from '../data/questions.json';
import axios from 'axios';

let apiURL;
if (process.env.NODE_ENV !== 'production') {
	apiURL = process.env.REACT_APP_API_URL;
} else {
	apiURL = '';
}

const Question = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState(''); //what the user types in
	const [answerResponse, setAnswerResponse] = useState(''); // what the bot says after the user types in (the short message)

	const handleNextQuestion = async () => {
		if (currentQuestionIndex < questionsData.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setCurrentQuestionIndex(0);
		}
		setAnswer('');
		setAnswerResponse('');
	};

	const handleSubmitAnswer = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${apiURL}/question`, {
				answer,
				questionIndex: currentQuestionIndex,
			});
			if (response.data.isCorrect) {
				setAnswerResponse('Well done! That is the correct answer.');
			} else {
				setAnswerResponse(
					`Sorry, that is not the correct answer. The correct answer is "${response.data.correctAnswer}".`
				);
			}
		} catch (err) {
			console.error(err);
		}
		setAnswer('');
	};

	const currentQuestion = questionsData.questions[currentQuestionIndex];

	return (
		<div className='container'>
			<div className='questionWrapper'>
				<h3 className='questionHeading'> Question: </h3>
				<h3 className='question'>{currentQuestion.text}</h3>
			</div>
			<form onSubmit={handleSubmitAnswer}>
				<textarea
					className='answerInput'
					type='text'
					id='answer'
					value={answer}
					placeholder='Answer:'
					onChange={(e) => setAnswer(e.target.value)}
				/>
				<br />
				<button className='answerSubmit' type='submit'>
					Submit
				</button>
			</form>
			{answerResponse && <div>{answerResponse}</div>}
			<button className='nextQuestionBtn' onClick={handleNextQuestion}>
				Next question
			</button>
		</div>
	);
};

export default Question;
