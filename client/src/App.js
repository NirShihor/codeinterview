import './App.css';
import Chat from './pages/Chat';
import Register from './pages/Register';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Chat />} />
				<Route exact path='/register' element={<Register />} />
				<Route exact path='/login' element={<Login />} />
			</Routes>
		</Router>
	);
}

export default App;
