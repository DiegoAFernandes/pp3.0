import React, { useState } from 'react';
import './Login.css';

const SignInPage = () => {
    
    const [email, setEmail] = useState('');
    
    const [password, setPassword] = useState('');

    const validatePassword = (password) => {
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        const digits = password.replace(/[^0-9]/g, ''); // Remove não dígitos
        const isValidLength = digits.length >= 8; // Verifica se há pelo menos 8 dígitos
        return regex.test(password) && isValidLength;
    };

    

    const handleSubmit = (e) => {
        e.preventDefault();

       

        // Validação da senha
        if (!validatePassword(password)) {
            alert("A senha deve ter pelo menos 8 caracteres e incluir pelo menos um caractere especial.");
            return; // Impede o envio do formulário
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
                    <button type="submit">Continuar</button>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
