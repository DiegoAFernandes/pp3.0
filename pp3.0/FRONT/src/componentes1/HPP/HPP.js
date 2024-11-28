import React, { useEffect } from "react";
import "../HPP/HPP.css";
import { useNavigate } from "react-router-dom";

const HPP = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica se o usuário é admin no localStorage
        const isAdmin = localStorage.getItem("admin") === "true";

        // Se não for admin, redireciona para a página inicial
        if (!isAdmin) {
            alert("Acesso negado! Você não tem permissão para acessar esta página.");
            navigate("/");
        }
    }, [navigate]);

    // Função para redirecionar ao clicar
    const acessarMenu = () => {
        navigate("/menu");
    };
    const acessarUserList = () => {
        navigate("/userList");
    };
    const acessarEstoque = () => {
        navigate("/stockList");
    };


    return (
        <>
            <div className="container1">
                <link
                    href="https://fonts.googleapis.com/css2?family=Bakery+Goods&display=swap"
                    rel="stylesheet"
                ></link>
                <h1 className="title1">
                    <strong>ADMINISTRADOR</strong>
                    <h1>Bem-Vindo à padaria</h1> <h1>MESTRE PADEIRO!</h1>
                </h1>
            </div>
            <div className="tudo1">
                <div className="signup-container">
                    <button onClick={acessarMenu} className="btn1">
                        Acessar Menu
                    </button>
                    <button onClick={acessarUserList} className="btn1">
                        Acessar a lista de usuários
                    </button>
                    <button onClick={acessarEstoque} className="btn1">
                        Acessar o estoque
                    </button>                     
                </div>
                
            </div>
        </>
    );
};

export default HPP;
