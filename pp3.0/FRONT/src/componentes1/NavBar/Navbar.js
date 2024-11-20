import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../MPL.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // Efeito para recuperar os dados do usuário do localStorage
    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            try {
                const parsedUser = JSON.parse(loggedUser);
                setUser(parsedUser);  // Atualiza o estado do usuário com o que está no localStorage
                console.log('Usuário logado:', parsedUser);
            } catch (error) {
                console.error("Erro ao analisar o JSON: ", error);
                setUser(null);  // Se houver erro no parse, limpa o estado
            }
        }
    }, []);

    // Função de login
    const handleLogin = () => {
        // Verifica se já existe um usuário logado
        if (user) {
            setError('Você já está logado. Faça logout para entrar com outro usuário.');
        } else {
            navigate('/login');
        }
    };

    // Função de registro
    const handleRegister = () => {
        // Verifica se já existe um usuário logado
        if (user) {
            setError('Você já está logado. Faça logout para registrar outro usuário.');
        } else {
            navigate('/cadastro');
        }
    };

    // Função para redirecionar para a página inicial
    const handleHomePage = () => {
        navigate('/');
    };

    // Função de logout
    const handleLogout = () => {
        localStorage.removeItem('user');  // Remove o usuário do localStorage
        setUser(null);  // Limpa o estado de usuário
        setError('');  // Limpa a mensagem de erro
        navigate('/');  // Redireciona para a página inicial após logout
        console.log('Usuário deslogado');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img
                    src={logo}
                    onClick={handleHomePage}
                    alt="Mestre Padeiro"
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div>
                <h1 className="ntitle">Mestre Padeiro</h1>
            </div>
            <div className="container">
                <div className="navbar-buttons">
                    {user ? (
                        <div className="user-info">
                            <span>Bem-vindo, {user.firstName}!</span>
                            <button className="btn btn-logout" onClick={handleLogout}>
                                Sair
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className="btn btn-login" onClick={handleLogin}>
                                Entrar
                            </button>
                            <button className="btn btn-register" onClick={handleRegister}>
                                Registrar-se
                            </button>
                        </>
                    )}
                </div>
                {error && <div className="error-message">{error}</div>} {/* Exibe a mensagem de erro */}
                <div className="navbar-social">
                    <a href="https://pt-br.facebook.com">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://www.whatsapp.com">
                        <i className="fab fa-whatsapp"></i>
                    </a>
                    <a href="https://www.instagram.com">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
