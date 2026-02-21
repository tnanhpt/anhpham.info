import "./App.css";
import CheckUID from "./pages/CheckUID";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Note from "./pages/Note";
import SplitStr from "./pages/SplitStr";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckUID />} />
        <Route path="/check-live" element={<CheckUID />} />
        <Route path="/split-str" element={<SplitStr />} />
      </Routes>
    </Router>
  );
}

export default App;
