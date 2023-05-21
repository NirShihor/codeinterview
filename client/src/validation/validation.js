// validation.js

import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string()
		.min(8, 'Password must be at least 8 characters long')
		.required('Password is required'),
});

export const registrationSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string()
		.min(
			8,
			'Password must be at least 8 characters long and include a special character (!@#$%^&*()), a number, an uppercase letter, and a lowercase letter.'
		)
		.matches(
			/[a-z]/,
			'Password must be at least 8 characters long and include a special character (!@#$%^&*()), a number, an uppercase letter, and a lowercase letter.'
		)
		.matches(
			/[A-Z]/,
			'Password must be at least 8 characters long and include a special character (!@#$%^&*()), a number, an uppercase letter, and a lowercase letter.'
		)
		.matches(
			/\d/,
			'Password must be at least 8 characters long and include a special character (!@#$%^&*()), a number, an uppercase letter, and a lowercase letter.'
		)
		.matches(
			/[!@#$%^&*()]/,
			'Password must be at least 8 characters long and include a special character (!@#$%^&*()), a number, an uppercase letter, and a lowercase letter.'
		)
		.required('Password is required'),
});
