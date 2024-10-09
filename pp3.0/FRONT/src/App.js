import logo from '../src/componentes1/MPL2.png';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componentes1/NavBar/Navbar';
import SignUpPage from './componentes1/Registrar/registrar';
import HomePage from './componentes1/HomePage/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/cadastro" element={<SignUpPage />} /> {/* Rota pro cadastro */}
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <code>SISTEMA MESTRE PADEIRO</code> 
          </p>
          <a
            className="App-link"
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SMP
          </a>
        </header>
      </div>
    </Router>
  );
}

export default App;
