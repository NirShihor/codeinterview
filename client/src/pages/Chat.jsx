<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './chat.css';
=======
import React, { useEffect, useState } from "react";
import "./chat.css";
>>>>>>> origin/main
// import questionsData from '../data/questions.json';
import axios from "axios";
import { default as SyntaxHighlighter } from "react-syntax-highlighter"; // for code styling
import CodeEditor from "../components/CodeEditor";
import draculaTheme from "../draculaTheme";

let apiURL;
if (process.env.NODE_ENV !== "production") {
  apiURL = process.env.REACT_APP_API_URL;
} else {
  apiURL = "";
}

const Chat = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState(""); //what the user types in
  const [loading, setLoading] = useState(false); // loading spinner
  const [code, setCode] = useState(`function hello() {
		console.log("Professor Code");
	  }`);
<<<<<<< HEAD
	const [chatHistory, setChatHistory] = useState([]);
	const [isCodeQuestion, setIsCodeQuestion] = useState(false);
	const [language, setLanguage] = useState('Select a language');
	const [questions, setQuestions] = useState([]);
	const [level, setLevel] = useState('Select a level');
	const [alert, setAlert] = useState(null);
	const [registerAlert, setRegisterAlert] = useState(null);
	const [isSubscribed, setIsSubscribed] = useState(false); // for the useEffect cleanup function
	const [isLoggedIn, setLoggedIn] = useState(false); // for the useEffect cleanup function
=======
  const [chatHistory, setChatHistory] = useState([]);
  const [isCodeQuestion, setIsCodeQuestion] = useState(false);
  const [language, setLanguage] = useState("Select a language");
  const [questions, setQuestions] = useState([]);
  const [level, setLevel] = useState("Select a level");
  const [alert, setAlert] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // for the useEffect cleanup function
>>>>>>> origin/main

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (e.target.value !== "Select a language") {
      setAlert(null);
    }
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    if (e.target.value !== "Select a level") {
      setAlert(null);
    }
  };

<<<<<<< HEAD
	const promptUserToSubscribeOrLogin = () => {
		if (isLoggedIn === false) {
			setRegisterAlert(
				'Please subscribe or login to the access more questions'
			);
		}
	};
=======
  const promptUserToSubscribe = () => {
    alert("Please subscribe to continue using the app");
  };
>>>>>>> origin/main

  const handleNextQuestion = async () => {
    let newIndex;

<<<<<<< HEAD
		if (questions.length === 0) {
			newIndex = 0;
		} else if (currentQuestionIndex < questions.length - 1) {
			if (currentQuestionIndex + 1 >= 20 && !isLoggedIn) {
				promptUserToSubscribeOrLogin();
				return;
			} else {
				newIndex = currentQuestionIndex + 1;
			}
		} else {
			newIndex = 1;
		}
=======
    if (questions.length === 0) {
      newIndex = 0;
    } else if (currentQuestionIndex < questions.length - 1) {
      if (currentQuestionIndex + 1 >= 20 && !isSubscribed) {
        promptUserToSubscribe();
        return;
      } else {
        newIndex = currentQuestionIndex + 1;
      }
    } else {
      newIndex = 1;
    }
>>>>>>> origin/main

    setCurrentQuestionIndex(newIndex);
    setAnswer("");
    setIsCodeQuestion(false);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (
      !language ||
      language === "Select a language" ||
      !level ||
      level === "Select a level"
    ) {
      setAlert("Please select a language and level");
      return;
    }
    setLoading(true); // set loading to true before the API call
    try {
      const response = await axios.post(
        `${apiURL}/question?language=${language}&level=${level}`,
        {
          answer,
          questionIndex: currentQuestionIndex,
        }
      );
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { message: response.data.aiAnswer, isCode: false },
      ]);
      setIsCodeQuestion(false); // set isCodeQuestion to false when a regular question is submitted
    } catch (err) {
      console.error(err);
    }
    setLoading(false); // set loading back to false after the API call
    setAnswer("");
  };

  const handleSubmitCodeEditor = async (e) => {
    e.preventDefault();
    if (!language || !level) {
      setAlert("Please select a language and level");
      return;
    }

<<<<<<< HEAD
		setLoading(true);
		try {
			const response = await axios.post(
				`${apiURL}/code?language=${language}&level=${level}`,
				{
					code,
					questionIndex: currentQuestionIndex,
				}
			);
			setChatHistory((prevHistory) => [
				...prevHistory,
				{ message: response.data.aiAnswer || '', isCode: true },
			]);
			setIsCodeQuestion(true); // set isCodeQuestion to true when a code question is submitted
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
		setCode('');
	};

	const navigate = useNavigate();

	const handleRegister = () => {
		navigate('/register');
	};

	const handleLogin = () => {
		navigate('/login');
	};

	useEffect(() => {
		async function fetchQuestions() {
			if (language === 'Select a language' || level === 'Select a level') {
				setQuestions([]);
			} else {
				try {
					const response = await fetch(
						`${apiURL}/questions?language=${language}&level=${level}`
					);
					const data = await response.json();
					setQuestions(data.questions);
				} catch (error) {
					console.error('Error fetching questions:', error);
				}
			}
		}
=======
    setLoading(true);
    try {
      const response = await axios.post(`${apiURL}/code`, {
        code,
        language,
        level,
      });
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { message: response.data.aiAnswer || "", isCode: true },
      ]);
      setIsCodeQuestion(true); // set isCodeQuestion to true when a code question is submitted
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setCode("");
  };

  useEffect(() => {
    async function fetchQuestions() {
      if (language === "Select a language" || level === "Select a level") {
        setQuestions([]);
      } else {
        try {
          const response = await fetch(
            `${apiURL}/questions?language=${language}&level=${level}`
          );
          const data = await response.json();
          setQuestions(data.questions);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }
    }
>>>>>>> origin/main

    if (language !== "Select a language" && level !== "Select a level") {
      fetchQuestions();
    }
  }, [language, level]);

  const currentQuestion = questions[currentQuestionIndex];

<<<<<<< HEAD
	return (
		<div>
			<div className='container'>
				{/* language and level selectors */}
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
				{/* Alert user if failed to choose language or level */}
				{alert && <div className='alert'>{alert}</div>}
				<button className='nextQuestionBtn' onClick={handleNextQuestion}>
					Next question
				</button>
				<button className='registerBtn' onClick={handleRegister}>
					Register
				</button>
				<button className='loginBtn' onClick={handleLogin}>
					Login
				</button>
				<div className='chatContainer'>
					<div className='questionsAnswersContainer'>
						<h1>Questions and Answers</h1>
						<div className='question'>
							{currentQuestion && (
								<h3 className='question'>{currentQuestion.text}</h3>
							)}
						</div>
						{registerAlert && <div className='alert'>{registerAlert}</div>}
						<div className='userAnswer'>
							<form onSubmit={handleSubmitAnswer}>
								<textarea
									className='answerInput'
									type='text'
									id='answer'
									value={answer}
									placeholder='Answer the question or, if relevant, reply to Professor Code here...'
									onChange={(e) => setAnswer(e.target.value)}
								/>
								<button>Submit</button>
							</form>
						</div>
						<div className='gptResponse'>
							<div className='chatGptAnswerToTextQuestion'>
								{chatHistory && !isCodeQuestion && (
									<div>
										{chatHistory.map((chat, index) => {
											if (!chat.isCode) {
												// Render text message
												return <p key={index}>{chat.message}</p>;
											}
											return null;
										})}
									</div>
								)}
							</div>
=======
  return (
    <div>
      <div className="container">
        {/* language and level selectors */}
        <select
          className="selectLanguage"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="">Select a language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <select
          className="selectLevel"
          value={level}
          onChange={handleLevelChange}
        >
          <option value="">Select a level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {/* Alert user if failed to choose language or level */}
        {alert && <div className="alert">{alert}</div>}
        <button className="nextQuestionBtn" onClick={handleNextQuestion}>
          Next question
        </button>
        <div className="chatContainer">
          <div className="questionsAnswersContainer">
            <h1>Questions and Answers</h1>
            <div className="question">
              {currentQuestion && (
                <h3 className="question">{currentQuestion.text}</h3>
              )}
            </div>
            <div className="userAnswer">
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  className="answerInput"
                  type="text"
                  id="answer"
                  value={answer}
                  placeholder="Answer the question or, if relevant, reply to Professor Code here..."
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button>Submit</button>
              </form>
            </div>
            <div className="gptResponse">
              <div className="chatGptAnswerToTextQuestion">
                {chatHistory && !isCodeQuestion && (
                  <div>
                    {chatHistory.map((chat, index) => {
                      if (!chat.isCode) {
                        // Render text message
                        return <p key={index}>{chat.message}</p>;
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
>>>>>>> origin/main

              <div className="chatGptAnswerToCodingQuestion">
                {chatHistory && isCodeQuestion && (
                  <div>
                    {chatHistory.map((chat, index) => {
                      if (chat.isCode) {
                        // Split and render code message
                        const styledAnswer = chat.message.split("```");
                        return styledAnswer.map((block, blockIndex) => {
                          if (blockIndex % 2 === 0) {
                            return <p key={blockIndex}>{block}</p>;
                          } else {
                            return (
                              <div className="highlighterWrapper">
                                <SyntaxHighlighter
                                  key={blockIndex}
                                  language="javascript"
                                  style={draculaTheme}
                                >
                                  {block}
                                </SyntaxHighlighter>
                              </div>
                            );
                          }
                        });
                      } else {
                        // Render text message
                        return <p key={index}>{chat.message}</p>;
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="codeEditor">
            {
              <CodeEditor
                onSubmit={handleSubmitCodeEditor}
                setChatGptAnswer={chatHistory}
                language={language}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
