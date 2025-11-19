import "./App.css";
import Test from "./pages/Test";
import { Route, Routes, Navigate } from "react-router-dom";
import BoardDetail from "./pages/BoardDetail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/test" />} />
        <Route path="/test" element={<Test />} />
        <Route path="/board/:id" element={<BoardDetail />} />
      </Routes>
    </div>
  );
}

export default App;
