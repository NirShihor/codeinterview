import React, { useState } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import './codeEditor.css';

// require the ace-builds module
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

// import mode-<language> , this imports the style and colors for the selected language.
import 'ace-builds/src-noconflict/mode-javascript';
// import theme.
import 'ace-builds/src-noconflict/theme-monokai';
// this is an optional import just improved the interaction.
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

let apiURL;
if (process.env.NODE_ENV !== 'production') {
	apiURL = process.env.REACT_APP_API_URL;
} else {
	apiURL = '';
}

const CodeEditor = ({
	language,
	codeChatGptAnswer,
	setChatGptAnswer,
	setCodeChatGptAnswer,
	onSubmit,
}) => {
	const [code, setCode] = useState(`function hello() {
        console.log("Professor Code");
    }`);

	const [loading, setLoading] = useState(false); // loading spinner

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(`${apiURL}/code`, { code, language });
			setChatGptAnswer('');
			setCodeChatGptAnswer(response.data.aiAnswer.trim() || '');
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	return (
		<div className='codeEditorWrapper'>
			<form onSubmit={handleSubmit}>
				<AceEditor
					style={{
						height: '50vh',
						width: '70%',
						borderRadius: '6px',
						marginRight: '3rem',
						lineHeight: '1.5rem',
					}}
					placeholder='Start Coding'
					mode='javascript'
					theme='monokai'
					name='basic-code-editor'
					onChange={(currentCode) => setCode(currentCode)}
					fontSize={14}
					showPrintMargin={true}
					showGutter={true}
					highlightActiveLine={true}
					value={code}
					setCodeChatGptAnswer={setCodeChatGptAnswer}
					setOptions={{
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: true,
						enableSnippets: true,
						showLineNumbers: true,
						tabSize: 2,
					}}
				/>
				<button className='codeSubmitBtn' type='submit' onClick={onSubmit}>
					Submit
				</button>
			</form>
			{codeChatGptAnswer && (
				<div className={`gptAnswer ${codeChatGptAnswer ? 'slideIn' : ''}`}>
					<p>{codeChatGptAnswer}</p>
				</div>
			)}

			{loading && (
				<div className='loading'>
					<div className='spinner'></div>
				</div>
			)}
		</div>
	);
};

export default CodeEditor;
