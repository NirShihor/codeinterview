import { LoginContext } from '../context/LoginContext';
import { useContext } from 'react';

export default function useLoginContext() {
	const context = useContext(LoginContext);
	if (context === undefined) {
		throw new Error('useLoginContext must be used inside a LoginProvider');
	}
	return context;
}
