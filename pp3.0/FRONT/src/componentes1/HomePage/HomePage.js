import React from "react";
import "../HomePage/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    // Função para verificar se o usuário está logado
    const isUserLoggedIn = () => {
        return !!localStorage.getItem("user"); // Supondo que você armazena os dados do usuário no localStorage
    };

    const handleMenu = () => {
        if (isUserLoggedIn()) {
            navigate('/menu');
        } else {
            alert("Por favor, faça login antes de acessar o menu!");
            navigate('/login'); // Redireciona para a página de login
        }
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
                </h1>
            </div>
            <div className="tudo">
                <div className="signup-container">
                    <h2 onClick={handleMenu}>ACESSAR O MENU</h2>
                    <form className="FORM"></form>
                </div>
            </div>
        </>
    );
};

export default HomePage;
