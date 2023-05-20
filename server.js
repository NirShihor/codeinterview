const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3002;
const connection = require('./database/utils');
const addQuestionRouter = require('./routes/addQuestion');
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

app.use('/questions', questionsRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/question', questionRouter);
app.use('/code', codeRouter);
app.use('/add-question', addQuestionRouter);

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
