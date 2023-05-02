const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');
const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client', 'build')));

dotenv.config();

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

app.post('/question', async (req, res) => {
	const question = req.body.question;
	console.log('QUESTION: ', question);
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
