import "./App.css";
import CheckUID from "./pages/CheckUID";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Note from "./pages/Note";
import SplitStr from "./pages/SplitStr";
import MergeStr from "./pages/MergeStr";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckUID />} />
        <Route path="/check-live" element={<CheckUID />} />
        <Route path="/split-str" element={<SplitStr />} />
        <Route path="/merge-str" element={<MergeStr />} />
      </Routes>
    </Router>
  );
}

export default App;
