import React, { useState } from 'react';
import './registrar.css';

const SignUpPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const validatePassword = (password) => {
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        const digits = password.replace(/[^0-9]/g, ''); // Remove não dígitos
        const isValidLength = digits.length >= 8; // Verifica se há pelo menos 8 dígitos
        return regex.test(password) && isValidLength;
    };

    const validatePhoneNumber = (phoneNumber) => {
        const regex = /^(?:\(\d{2}\)\s)?(?:\d{5}-\d{4}|\d{4}-\d{4}|\d{8,9})$/;
        const digits = phoneNumber.replace(/\D/g, '');
        const isValidLength = digits.length >= 10 && digits.length <= 11;

        return regex.test(phoneNumber) && isValidLength;
    };

    const handleSubmit = (e) => {
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

        console.log('Nome:', firstName, lastName);
        console.log('Email:', email);
        console.log('Telefone:', phone);
        console.log('Senha:', password);
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
                            onChange={(e) => setFirstName(e.target.value)} 
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
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
