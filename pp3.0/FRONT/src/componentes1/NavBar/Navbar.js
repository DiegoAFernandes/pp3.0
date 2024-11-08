import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Navbar.css';
import logo from '../MPL.png';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/cadastro');
    };

    const handleHomePage = () => {
        navigate('/');
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">                
                <img src={logo} onClick={handleHomePage} alt="Mestre Padeiro" style={{ cursor: 'pointer' }}/>                                                          
            </div>
            <div>
                <h1 className='ntitle'>Mestre Padeiro</h1>
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