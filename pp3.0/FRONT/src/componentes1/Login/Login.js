import React, { useState } from 'react';
import './Login.css';

const SignInPage = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        const digits = password.replace(/[^0-9]/g, ''); // Remove não dígitos
        const isValidLength = digits.length >= 8; // Verifica se há pelo menos 8 dígitos
        return regex.test(password) && isValidLength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação da senha
        if (!validatePassword(password)) {
            alert("A senha deve ter pelo menos 8 caracteres e incluir pelo menos um caractere especial.");
            return; // Impede o envio do formulário
        }

        // Dados para enviar ao backend
        const userData = { email, password };

        try {
            // Envia os dados para o backend
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('Login bem-sucedido!');
                // Redirecionar ou tratar o login com sucesso
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError('Erro ao tentar fazer login.');
            console.error(err);
        }
        
        console.log('Email:', email);
        console.log('Senha:', password);
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
