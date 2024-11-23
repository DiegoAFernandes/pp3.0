import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../MPL.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // Função para verificar o usuário logado no localStorage
    const checkLoggedUser = () => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            try {
                const parsedUser = JSON.parse(loggedUser);
                console.log('Usuário no localStorage:', parsedUser); // Verifique a estrutura do usuário
                setUser(parsedUser); // Atualiza o estado com o usuário do localStorage
            } catch (error) {
                console.error("Erro ao analisar o JSON: ", error);
                setUser(null); // Se houver erro no parse, limpa o estado
            }
        } else {
            setUser(null); // Se não houver usuário logado, limpa o estado
        }
    };

    // Verifica o usuário e adiciona listener para mudanças no localStorage
    useEffect(() => {
        checkLoggedUser();

        const handleStorageChange = () => {
            checkLoggedUser();
        };

        window.addEventListener('storage', handleStorageChange);

        // Remove o listener ao desmontar o componente
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Função de login
    const handleLogin = () => {
        if (user) {
            setError('Você já está logado. Faça logout para entrar com outro usuário.');
        } else {
            navigate('/login'); // Redireciona para a página de login
        }
    };

    // Função de registro
    const handleRegister = () => {
        if (user) {
            setError('Você já está logado. Faça logout para registrar outro usuário.');
        } else {
            navigate('/cadastro'); // Redireciona para a página de registro
        }
    };

    // Função para redirecionar para a página inicial
    const handleHomePage = () => {
        navigate('/'); // Redireciona para a página inicial
    };

    // Função de logout
    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove o usuário do localStorage
        window.dispatchEvent(new Event('storage')); // Notifica os listeners do localStorage
        setUser(null); // Limpa o estado de usuário
        setError(''); // Limpa a mensagem de erro
        navigate('/'); // Redireciona para a página inicial após logout
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
                            {/* Exibe o nome do usuário com encadeamento opcional */}
                            <span className='userTitle'>
                                Bem-vindo, {user.Username}! ‎ ‎ ‎   
                            </span>
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
