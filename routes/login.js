const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'Email not found' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ message: 'Wrong password' });
		}

		const token = jwt.sign(
			{
				userId: user._id,
				userEmail: user.email,
			},
			'RANDOM-TOKEN',
			{
				expiresIn: '24h',
			}
		);

		res.status(200).json({
			message: 'Login Successful',
			email: user.email,
			token,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

module.exports = router;
