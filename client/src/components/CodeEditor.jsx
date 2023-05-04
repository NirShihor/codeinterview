import React, { useState } from 'react';
import AceEditor from 'react-ace';
import './codeEditor.css';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

// import mode-<language> , this imports the style and colors for the selected language.
import 'ace-builds/src-noconflict/mode-javascript';
// there are many themes to import, I liked monokai.
import 'ace-builds/src-noconflict/theme-monokai';
// this is an optional import just improved the interaction.
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

const CodeEditor = () => {
	const [code, setCode] = useState(`function hello() {
        console.log("Hello World!");
      }`);

	return (
		<div className='codeEditorWrapper'>
			<h3 className='codeHeading'>Let's Code It:</h3>
			<AceEditor
				style={{
					height: '50vh',
					width: '80%',
					borderRadius: '6px',
					marginRight: '3rem',
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
				setOptions={{
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true,
					showLineNumbers: true,
					tabSize: 2,
				}}
			/>
		</div>
	);
};

export default CodeEditor;
