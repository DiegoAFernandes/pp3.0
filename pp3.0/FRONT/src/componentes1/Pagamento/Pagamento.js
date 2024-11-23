import React,{useState} from "react";
import "./Pagamento.css";

const Pagamento = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');

    // Validação do número do cartão
    const validateCardNumber = (number) => {
        const regex = /^[0-9]{16}$/; // Verifica se o número do cartão tem 16 dígitos
        return regex.test(number);
    };

    // Validação da data de validade
    const validateExpiryDate = (date) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Formato MM/AA
        return regex.test(date);
    };

    // Validação do CVV
    const validateCvv = (cvv) => {
        const regex = /^[0-9]{3}$/; // Verifica se o CVV tem 3 dígitos
        return regex.test(cvv);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCardNumber(cardNumber)) {
            setError("Número do cartão inválido. Deve ter 16 dígitos.");
            return;
        }

        if (!validateExpiryDate(expiryDate)) {
            setError("Data de validade inválida. Formato esperado: MM/AA.");
            return;
        }

        if (!validateCvv(cvv)) {
            setError("CVV inválido. Deve ter 3 dígitos.");
            return;
        }

        // Dados de pagamento para envio
        const paymentData = { cardNumber, cardName, expiryDate, cvv };

        try {
            // Envia os dados de pagamento para o backend (exemplo fictício)
            const response = await fetch("http://localhost:8000/Pagamento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                alert("Pagamento realizado com sucesso!");
                // Limpar os campos após o sucesso
                setCardNumber("");
                setCardName("");
                setExpiryDate("");
                setCvv("");
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError("Erro ao processar o pagamento.");
            console.error(err);
        }
    };

    return (
        <div className="tudo">
            <div className="payment-container">
                <h2>Pagamento</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Número do Cartão:</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            maxLength="16"
                            required
                        />
                    </div>
                    <div>
                        <label>Nome do Titular:</label>
                        <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Data de Validade (MM/AA):</label>
                        <input
                            type="text"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/AA"
                            required
                        />
                    </div>
                    <div>
                        <label>CVV:</label>
                        <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength="3"
                            required
                        />
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Pagar</button>
                </form>
            </div>
        </div>
    );
};

export default Pagamento;
