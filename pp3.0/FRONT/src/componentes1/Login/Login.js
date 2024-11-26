import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const navigate = useNavigate();

  // Função de validação de senha
  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setLoading(true); // Inicia o carregamento

    // Validação da senha
    if (!validatePassword(password)) {
      setError('A senha deve ter pelo menos 8 caracteres e incluir um caractere especial!');
      setLoading(false); // Desativa o carregamento se houver erro
      return;
    }
  
    const userData = { email, password };
    console.log('Enviando dados:', userData);
    
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Resposta do servidor:', result);
        alert(result.message); 
        
        // Corrige o nome para exibir com espaço entre o primeiro e o último nome
        const userWithFullName = {
          ...result.user,
          fullName: `${result.user.firstName} ‎ ${result.user.lastName}`, // Concatenando nome completo
        };
        
        // Salva o usuário com nome completo no localStorage
        localStorage.setItem('user', JSON.stringify(userWithFullName));
        localStorage.setItem('admin', result.user.isAdmin); // Salva o papel do usuário no localStorage

        setTimeout(() => {
          setLoading(false);
          window.dispatchEvent(new Event('storage')); 

          // Redireciona para /HPP se o usuário for admin, senão para a página inicial
          if (result.user.isAdmin === true) {
            navigate('/HPP');
          } else {
            navigate('/');
          }
        }, 500); 

      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message || 'Erro ao fazer login');
        setLoading(false);
      }
    } catch (err) {
      setError('Erro ao tentar fazer login. Tente novamente mais tarde.');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="tudo">
      <div className="signup-container">
        <h2>Entrar</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space">
            <label>Senha:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro */}

          {loading ? (
            <p style={{ color: 'white' }}>Carregando...</p> 
          ) : (
            <button type="submit">Continuar</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
