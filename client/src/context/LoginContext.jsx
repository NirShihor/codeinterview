import { createContext, useReducer } from 'react';

export const LoginContext = createContext();

export const loginReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				user: action.payload,
			};
		case 'LOGOUT':
			return {
				user: null,
			};
		default:
			return state;
	}
};

export const LoginProvider = ({ children }) => {
	const [state, dispatch] = useReducer(loginReducer, {
		user: null,
	});

	console.log('LoginProvider', state);

	return (
		<LoginContext.Provider value={{ ...state, dispatch }}>
			{children}
		</LoginContext.Provider>
	);
};
