import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes1/NavBar/Navbar";
import SignUpPage from "./componentes1/Registrar/registrar";
import HomePage from "./componentes1/HomePage/HomePage";
import SignInPage from "./componentes1/Login/Login";
import Menu from "./componentes1/Menu/menu";
import Pagamento from "./componentes1/Pagamento/Pagamento";
import TypePayment from "./componentes1/typePayment/typePayment";


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/cadastro" element={<SignUpPage />} />{" "}
            {/* Rota pro cadastro */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage />} />{" "}
            <Route path="/menu" element={<Menu />} />{" "}
            <Route path="/Pagamento" element={<Pagamento />} />{" "}
            <Route path="/typePayment" element={<TypePayment />} />{" "}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
