import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
