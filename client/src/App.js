import './App.css';
import Question from './pages/Question';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Question />} />
			</Routes>
		</Router>
	);
}

export default App;
