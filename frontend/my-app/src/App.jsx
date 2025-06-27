import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormData from "./components/FormData";
function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<FormData />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
export default App;