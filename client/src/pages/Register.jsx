import React, { useState } from 'react';
import axios from 'axios';
import { registrationSchema } from '../validation/validation';

let apiURL;
if (process.env.NODE_ENV !== 'production') {
	apiURL = process.env.REACT_APP_API_URL;
} else {
	apiURL = '';
}

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		try {
			await registrationSchema.validate({ email, password });
			const response = await axios.post(`${apiURL}/register`, {
				email,
				password,
			});

			setAlert(response.data.message);
			setEmail('');
			setPassword('');
			if (response.data.token) {
				localStorage.setItem('TOKEN: ', response.data.token);
			}
		} catch (err) {
			setIsLoading(false);
			if (err.name === 'ValidationError') {
				const yupErrors = err.errors.map((e) => e);
				setAlert(yupErrors.join('\n'));
			} else if (err.response && err.response.data && err.response.data.error) {
				const errorMessage = err.response.data.error;
				if (errorMessage === 'Email already exists') {
					setAlert('Email already exists');
				} else {
					setAlert(errorMessage);
				}
			} else {
				console.error(err);
				setAlert('Something went wrong');
			}
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>Email</label>
				<input
					type='email'
					placeholder='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type='text'
					placeholder='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type='submit'>Submit</button>
			</form>
			{alert && <div>{alert}</div>}
		</div>
	);
};

export default Register;
