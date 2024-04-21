import React from "react";
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login'
import Signup from './components/Signup'
import Form from './components/Form'

// Define the pages of our site
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/form" element={<Form />} />
        <Route path="*" element={<div>Not found.</div>} />
      </Routes>
    </div>
  );
}

export default App;
