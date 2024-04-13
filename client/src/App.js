import { Routes, Route } from 'react-router-dom';
import './App.css';
// import Home from './components/Home';
import Login from './components/Login'
import Signup from './components/Signup'

// Define the pages of our site
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<div>Not found.</div>} />
      </Routes>
    </div>
  );
}

export default App;
