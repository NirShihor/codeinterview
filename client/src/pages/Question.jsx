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
	const [chatGptAnswer, setChatGptAnswer] = useState(''); // what the bot says after the user types in (the long message)
	const [loading, setLoading] = useState(false); // loading spinner

	const handleNextQuestion = async () => {
		if (currentQuestionIndex < questionsData.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setCurrentQuestionIndex(0);
		}
		setAnswer('');
		setAnswerResponse('');
		setChatGptAnswer('');
	};

	const handleSubmitAnswer = async (e) => {
		e.preventDefault();
		setLoading(true); // set loading to true before the API call
		try {
			const response = await axios.post(`${apiURL}/question`, {
				answer,
				questionIndex: currentQuestionIndex,
			});
			// TODO suspect that this if statement isn't actually doing anything - check later
			if (response.data.isCorrect) {
				setAnswerResponse('Well done! That is the correct answer.');
			} else {
				setAnswerResponse(
					`Sorry, that is not the correct answer. The correct answer is "${response.data.correctAnswer}".`
				);
			}
			setChatGptAnswer(response.data.aiAnswer);
			console.log('CHAT GPT ANSWER', chatGptAnswer);
		} catch (err) {
			console.error(err);
		}
		setLoading(false); // set loading back to false after the API call
		setAnswer('');
	};

	const currentQuestion = questionsData.questions[currentQuestionIndex];

	return (
		<div className='container'>
			<div className='gridContainer'>
				<div className='cell'>
					{chatGptAnswer && (
						<div className={`gptAnswer ${chatGptAnswer ? 'slideIn' : ''}`}>
							<p>{chatGptAnswer}</p>
						</div>
					)}
				</div>
				<div className='cell questionCell'>
					<div className='questionWrapper'>
						<h3 className='questionHeading'> Question: </h3>
						<h3 className='question'>{currentQuestion.text}</h3>
					</div>
					<form className='form' onSubmit={handleSubmitAnswer}>
						<div className='inputWrapper'>
							<textarea
								className='answerInput'
								type='text'
								id='answer'
								value={answer}
								placeholder='Answer the question or, if relevant, reply to Professor Code here...'
								onChange={(e) => setAnswer(e.target.value)}
							/>
							{loading && (
								<div className='loading'>
									<div className='spinner'></div>
								</div>
							)}
						</div>
						<br />
						<button className='answerSubmit' type='submit'>
							Check With Prof. Code
						</button>
					</form>
					<button className='nextQuestionBtn' onClick={handleNextQuestion}>
						Next question
					</button>
				</div>
				<div className='cell'>
					<h1>THIRD CELL</h1>
				</div>
			</div>
		</div>
	);
};

export default Question;
