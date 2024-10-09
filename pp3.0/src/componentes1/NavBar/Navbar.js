import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import './Navbar.css';
import logo from '../MPL.png';

const Navbar = () => {
    const navigate = useNavigate(); // Inicializando useNavigate

    const handleLogin = () => {
        navigate('/login'); // Redirecionando para a página de login
    };

    const handleRegister = () => {
        navigate('/cadastro'); // Redirecionando para a página de cadastro
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">                
                <img src={logo} alt="Mestre Padeiro" />                                            
            </div>
            <div className="container">
                <div className="navbar-buttons">
                    <button className="btn btn-login" onClick={handleLogin}>Entrar</button>
                    <button className="btn btn-register" onClick={handleRegister}>Registrar-se</button>
                </div>
                <div className="navbar-social">
                    <a href="https://pt-br.facebook.com"><i className="fab fa-facebook"></i></a>
                    <a href="https://www.whatsapp.com"><i className="fab fa-whatsapp"></i></a>
                    <a href="https://www.instagram.com"><i className="fab fa-instagram"></i></a>
                    
                </div>
            </div>
        </nav>
    );
};

export default Navbar;