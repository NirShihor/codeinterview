import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used inside a LoginProvider');
	}
	return context;
};

export default useAuthContext;
