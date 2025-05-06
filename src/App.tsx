import "./App.css";
import CheckUID from "./pages/CheckUID";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Note from "./pages/Note";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckUID />} />
        <Route path="/check-live-uid" element={<CheckUID />} />
        <Route path="/note" element={<Note />} />
      </Routes>
    </Router>
  );
}

export default App;
