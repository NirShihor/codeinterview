const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');
const app = express();
const port = process.env.PORT || 3002;
const connection = require('./database/utils');
const Question = require('./database/models/questionModel');
const User = require('./database/models/userModel');
const questionsRouter = require('./routes/questions');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const questionRouter = require('./routes/question');
const codeRouter = require('./routes/code');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'client', 'build')));

connection();

const corsOptions = {
	origin:
		process.env.ENV === 'production'
			? process.env.CLIENT_URL
			: 'http://localhost:3000',
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use('/questions', questionsRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/question', questionRouter);
app.use('/code', codeRouter);

// If want to add questions through a request
app.post('/add-questions', async (req, res) => {
	const index = req.body.index;
	const text = req.body.text;
	const language = req.body.language;
	const level = req.body.level;
	console.log('Request body:', req.body); // Log the request body

	try {
		const newQuestion = new Question({ index, text, language, level });
		console.log(newQuestion);
		await newQuestion.save();
		res.status(200).json({ message: 'Question added successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
