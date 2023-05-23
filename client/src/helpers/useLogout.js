import useAuthContext from './useAuthContext';

const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		// remove user from local storage
		localStorage.removeItem('user');

		// remove user from context
		dispatch({ type: 'LOGOUT' });
	};

	return logout;
};

export default useLogout;
