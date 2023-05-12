import React, { useEffect, useState } from 'react';
import './question.css';
// import questionsData from '../data/questions.json';
import axios from 'axios';
import { default as SyntaxHighlighter } from 'react-syntax-highlighter'; // for code styling
import draculaTheme from '../draculaTheme';
import CodeEditor from '../components/CodeEditor';

let apiURL;
if (process.env.NODE_ENV !== 'production') {
	apiURL = process.env.REACT_APP_API_URL;
} else {
	apiURL = '';
}

const Question = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState(''); //what the user types in
	const [chatGptAnswer, setChatGptAnswer] = useState(''); // what the bot says after the user types in (the long message)
	const [loading, setLoading] = useState(false); // loading spinner
	const [code, setCode] = useState(`function hello() {
		console.log("Professor Code");
	  }`);
	const [codeChatGptAnswer, setCodeChatGptAnswer] = useState('');
	const [isCodeQuestion, setIsCodeQuestion] = useState(false);
	const [language, setLanguage] = useState('javascript');
	const [questions, setQuestions] = useState([]);
	const [level, setLevel] = useState('');
	const [alert, setAlert] = useState(null);
	const [isSubscribed, setIsSubscribed] = useState(false); // for the useEffect cleanup function

	const handleLanguageChange = (e) => {
		setLanguage(e.target.value);
	};

	const handleLevelChange = (e) => {
		setLevel(e.target.value);
		if (e.target.value !== '') {
			setAlert(null);
		}
	};

	const promptUserToSubscribe = () => {
		alert('Please subscribe to continue using the app');
	};

	// $ now need to have more than 20 questions in database to test the below - add questions!!!
	const handleNextQuestion = async () => {
		if (questions.length === 0) {
			// if there are no questions, don't try access index that doesn't exist
			setCurrentQuestionIndex(0);
			// check if not on the last question
		} else if (currentQuestionIndex < questions.length - 1) {
			// check if the question if not in first 20 and user is not subscribed
			if (currentQuestionIndex + 1 >= 20 && !isSubscribed) {
				promptUserToSubscribe();
				return;
			} else {
				// else increment the question index
				setCurrentQuestionIndex(currentQuestionIndex + 1);
			}
		} else {
			// if on the last question, go back to the first question
			setCurrentQuestionIndex(0);
		}
		setAnswer('');
		setIsCodeQuestion(false); // reset isCodeQuestion state variable
	};

	const handleSubmitAnswer = async (e) => {
		e.preventDefault();
		if (!language || !level) {
			setAlert('Please select a language and level');
			return;
		}
		setLoading(true); // set loading to true before the API call
		try {
			const response = await axios.post(`${apiURL}/question`, {
				answer,
				questionIndex: currentQuestionIndex,
				language,
				level,
			});
			setChatGptAnswer(response.data.aiAnswer); // update the state variable here
			setIsCodeQuestion(false); // set isCodeQuestion to false when a regular question is submitted
		} catch (err) {
			console.error(err);
		}
		setLoading(false); // set loading back to false after the API call
		setAnswer('');
	};

	const handleSubmitCodeEditor = async (e) => {
		e.preventDefault();
		if (!language || !level) {
			setAlert('Please select a language and level');
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post(`${apiURL}/code`, {
				code,
				language,
				level,
			});
			setCodeChatGptAnswer(response.data.aiAnswer || ''); // update the state variable here
			setIsCodeQuestion(true); // set isCodeQuestion to true when a code question is submitted
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
		setCode('');
	};

	useEffect(() => {
		async function fetchQuestions() {
			if (language === '' || level === '') {
				setQuestions([]);
			} else {
				try {
					const response = await fetch(
						`${apiURL}/questions?language=${language}&level=${level}`
					);
					const data = await response.json();
					console.log('DATA', data);
					setQuestions(data.questions);
				} catch (error) {
					console.error('Error fetching questions:', error);
				}
			}
		}

		fetchQuestions();
	}, [language, level]);

	const currentQuestion = questions[currentQuestionIndex];

	const styledCodeChatGptAnswer = codeChatGptAnswer.split('```');

	return (
		<div className='container'>
			<select
				className='selectLanguage'
				value={language}
				onChange={handleLanguageChange}
			>
				<option value=''>Select a language</option>
				<option value='javascript'>JavaScript</option>
				<option value='python'>Python</option>
				<option value='java'>Java</option>
			</select>
			<select
				className='selectLevel'
				value={level}
				onChange={handleLevelChange}
			>
				<option value=''>Select a level</option>
				<option value='beginner'>Beginner</option>
				<option value='intermediate'>Intermediate</option>
				<option value='advanced'>Advanced</option>
			</select>
			{alert && <div className='alert'>{alert}</div>}
			<div className='gridContainer'>
				<div className='cell'>
					{chatGptAnswer && !isCodeQuestion && (
						<div
							className={`gptAnswer chatGptAnswer ${
								chatGptAnswer ? 'slideIn' : ''
							}`}
						>
							<p>{chatGptAnswer}</p>
						</div>
					)}
					{codeChatGptAnswer && isCodeQuestion && (
						<div
							className={`gptAnswer codeGptAnswer ${
								codeChatGptAnswer ? 'slideIn' : ''
							}`}
						>
							<div className='codeTextBlockWrapper'>
								{styledCodeChatGptAnswer.map((block, index) => {
									// If the index is even, render it as a normal text block
									if (index % 2 === 0) {
										return <p key={index}>{block}</p>;
									}
									// If the index is odd, render it as a code block (use <pre> and <code> elements)
									else {
										return (
											<div className='highlighterWrapper'>
												<SyntaxHighlighter
													key={index}
													language='javascript'
													style={draculaTheme}
												>
													{block}
												</SyntaxHighlighter>
											</div>
										);
									}
								})}
							</div>
						</div>
					)}
				</div>
				<div className='cell questionCell'>
					<div className='questionWrapper'>
						<h3 className='questionHeading'> Question: </h3>
						{currentQuestion && (
							<h3 className='question'>{currentQuestion.text}</h3>
						)}
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
					{
						<CodeEditor
							onSubmit={handleSubmitCodeEditor}
							setChatGptAnswer={setChatGptAnswer}
							language={language}
						/>
					}
				</div>
			</div>
		</div>
	);
};

export default Question;
