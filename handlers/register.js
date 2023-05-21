const bcrypt = require('bcrypt');
const User = require('../database/models/userModel');

const registerHandler = async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log('PASSWORD: ', password);
		// Check if the email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already exists' });
		}
		const hashedPassword = bcrypt.hashSync(password, 10);
		const newUser = new User({ email, password: hashedPassword });
		await newUser.save();
		res.status(201).send({ message: 'User created successfully' });
	} catch (err) {
		if (err.name === 'ValidationError') {
			// Handle validation errors
			const passwordError = err.errors['password'];
			if (passwordError) {
				const message = passwordError.properties.message;
				return res.status(400).json({ error: message });
			}
		} else if (err.name === 'MongoError' && err.code === 11000) {
			// Handle MongoDB duplicate key error
			return res.status(400).json({ error: 'Email already exists' });
		}
		console.error(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
};

module.exports = registerHandler;
