const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Please provide an Email!'],
		unique: [true, 'Email Exist'],
	},

	password: {
		type: String,
		required: true,
		validate: {
			validator: function (value) {
				// Password validation regular expression
				const passwordRegex =
					/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$/;
				return passwordRegex.test(value);
			},
			message:
				'Password must be at least 8 characters long, include a special character, a number, an uppercase letter, and a lowercase letter.',
		},
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
