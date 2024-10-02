import React from 'react';
import './Navbar.css';
import logo from '/pp2.0/pp3.0/pp3.0/src/componentes1/MPL.png';  // Substitua pelo seu logo real

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Mestre Padeiro" />
            </div>
            <div class = "container">
                <div className="navbar-buttons">
                <button className="btn btn-login">Entrar</button>
                <button className="btn btn-register">Registrar-se</button>
                </div>
                <div className="navbar-social">
                <a href="#facebook"><i className="fab fa-facebook"></i></a>
                <a href="#whatsapp"><i className="fab fa-whatsapp"></i></a>
                <a href="#instagram"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;