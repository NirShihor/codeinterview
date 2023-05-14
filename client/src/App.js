import './App.css';
import Chat from './pages/Chat';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Chat />} />
			</Routes>
		</Router>
	);
}

export default App;
