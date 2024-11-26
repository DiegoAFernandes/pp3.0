import React from "react";
import "../HPP/HPP.css";
import { useNavigate } from "react-router-dom";

const HPP = () => {
    const navigate = useNavigate();

    // Função para redirecionar ao clicar
    const acessarMenu = () => {
        navigate("/menu");
    };

    return (
        <>
            <div className="container1">
                <link
                    href="https://fonts.googleapis.com/css2?family=Bakery+Goods&display=swap"
                    rel="stylesheet"
                ></link>
                <h1 className="title1">
                    Bem-Vindo à padaria <h1>MESTRE PADEIRO!</h1>
                    <h1><strong>ADMINISTRADOR</strong></h1>
                </h1>
            </div>
            <div className="tudo1">
                <div className="signup-container">
                    
                    <button onClick={acessarMenu} className="btn1">
                        Acessar Menu
                    </button>
                </div>
            </div>
        </>
    );
};

export default HPP;
