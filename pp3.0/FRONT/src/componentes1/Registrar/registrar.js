import React, { useState } from 'react';
import './registrar.css';


const SignUpPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Validação da senha
    const validatePassword = (password) => {
        // A senha precisa ter pelo menos 8 caracteres e 1 caractere especial
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    // Validação do telefone
    const validatePhoneNumber = (phoneNumber) => {
        const regex = /^(?:\(\d{2}\)\s)?(?:\d{5}-\d{4}|\d{4}-\d{4}|\d{8,9})$/;
        const digits = phoneNumber.replace(/\D/g, '');
        const isValidLength = digits.length >= 10 && digits.length <= 11;

        return regex.test(phoneNumber) && isValidLength;
    };

    // Função de envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação do telefone
        if (!validatePhoneNumber(phone)) {
            alert("Por favor, insira um número de telefone válido com 10 ou 11 dígitos.");
            return; // Impede o envio do formulário
        }

        // Validação da senha
        if (!validatePassword(password)) {
            alert("A senha deve ter pelo menos 8 caracteres e incluir pelo menos um caractere especial.");
            return; // Impede o envio do formulário
        }

        // Dados do usuário para envio
        const userData = { firstName, lastName, password, email, phone };

        try {
                // Envia os dados para o backend
                const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('Usuário registrado com sucesso!');
                // Redirecionar ou limpar os campos após o sucesso
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setPassword('');
                
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError('Erro ao registrar usuário.');
            console.error(err);
        }
    };

    return (
        <div className="tudo">
            <div className="signup-container">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nome:</label>
                        <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value) } 
                            required 
                        />
                    </div>
                    <div>
                        <label>Sobrenome:</label>
                        <input 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input 
                            type="tel" 
                            placeholder="(XX) XXXXX-XXXX"
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Senha:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro */}
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
