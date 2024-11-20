import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Função de validação de senha
  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpar mensagens de erro antes de cada nova tentativa de login
    setError('');

    // Validação da senha
    if (!validatePassword(password)) {
      setError('A senha deve ter pelo menos 8 caracteres e incluir um caractere especial!');
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
        const result = await response.json(); // Espera JSON do backend
        console.log('Resposta do servidor:', result);
        alert(result.message); // Exibe a mensagem de sucesso
        
        // Armazena o usuário no localStorage após o login
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/'); // Navega para a página inicial após o login

      } else {
        const errorMessage = await response.json(); // Espera JSON de erro do backend
        setError(errorMessage.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao tentar fazer login. Tente novamente mais tarde.');
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

          <button type="submit">Continuar</button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
