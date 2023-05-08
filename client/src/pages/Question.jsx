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

	const handleLanguageChange = (e) => {
		setLanguage(e.target.value);
	};

	const handleNextQuestion = async () => {
		if (questions.length === 0) {
			setCurrentQuestionIndex(0);
		} else if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setCurrentQuestionIndex(0);
		}
		setAnswer('');
		setIsCodeQuestion(false); // reset isCodeQuestion state variable
	};

	const handleSubmitAnswer = async (e) => {
		e.preventDefault();
		setLoading(true); // set loading to true before the API call
		try {
			const response = await axios.post(`${apiURL}/question`, {
				answer,
				questionIndex: currentQuestionIndex,
				language,
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
		setLoading(true);
		try {
			const response = await axios.post(`${apiURL}/code`, {
				code,
				language,
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
		if (language === '') {
			setQuestions([]);
		} else {
			const data = require(`../data/${language}Questions.json`);
			setQuestions(data.questions);
		}
	}, [language]);

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
