import "./App.css";
import Note from "./pages/Note";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Note />} />
        <Route path="/:id" element={<Note />} />
      </Routes>
    </Router>
  );
}

export default App;
