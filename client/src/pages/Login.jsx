import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

let apiURL;
if (process.env.NODE_ENV !== 'production') {
	apiURL = process.env.REACT_APP_API_URL;
} else {
	apiURL = '';
}

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login, setLogin] = useState(false);
	// const { isLoggedIn, setLogin } = useContext(AuthContext);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${apiURL}/login`, {
				email,
				password,
			});
			console.log('LOGIN RESPONSE:', response.data);
			setLogin(true);

			navigate('/');

			// Perform any necessary actions after successful login, such as setting authentication tokens, redirecting the user, etc.
		} catch (err) {
			console.error('LOGIN ERROR:', err);
			// Handle login error, display appropriate error message to the user
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type='submit'>Submit</button>
			</form>
		</div>
	);
};

export default Login;
