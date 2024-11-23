import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./typePayment.css";

const TypePayment = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [observations, setObservations] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handlePaymentSelection = (method) => {
        setPaymentMethod(method);
    };

    const validateCardDetails = () => {
        const cardNumberRegex = /^[0-9]{16}$/;
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^[0-9]{3}$/;

        if (!cardNumberRegex.test(cardNumber)) {
            setError("Número do cartão inválido. Deve ter 16 dígitos.");
            return false;
        }
        if (!expiryDateRegex.test(expiryDate)) {
            setError("Data de validade inválida. Formato esperado: MM/AA.");
            return false;
        }
        if (!cvvRegex.test(cvv)) {
            setError("CVV inválido. Deve ter 3 dígitos.");
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = () => {
        if (!paymentMethod) {
            alert("Selecione um método de pagamento.");
            return;
        }

        if (paymentMethod === "Cartão" && !validateCardDetails()) {
            return;
        }

        const paymentDetails = {
            method: paymentMethod,
            observations,
            cardDetails:
                paymentMethod === "Cartão"
                    ? { cardNumber, cardName, expiryDate, cvv }
                    : null,
        };

        console.log("Detalhes do pagamento:", paymentDetails);
        alert("Pedido finalizado com sucesso!");
    };

    const qrCodeExample = "https://via.placeholder.com/200"; // Substitua pelo QR Code gerado.

    return (
        <div className="payment-selection-container">
            <h2>Selecione o Método de Pagamento</h2>
            <div className="payment-options">
                <button onClick={() => handlePaymentSelection("Cartão")}>
                    Cartão de Crédito/Débito
                </button>
                <button onClick={() => handlePaymentSelection("PIX")}>
                    PIX
                </button>
                <button onClick={() => handlePaymentSelection("Boleto")}>
                    Boleto Bancário
                </button>
                <button onClick={() => handlePaymentSelection("Dinheiro")}>
                    Dinheiro (Pagar na Entrega)
                </button>
            </div>
            
            {paymentMethod === "Cartão" && (
                <div className="card-payment">
                    <h3>Pagamento com Cartão</h3>
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
                </div>
            )}

            {paymentMethod === "PIX" && (
                <div className="pix-payment">
                    <h3>Método Selecionado: PIX</h3>
                    <p>Copie e cole o código a seguir:</p>
                    <div className="pix-code">
                        <input type="text" value="EXEMPLO1234567890" readOnly />
                    </div>
                    <img
                        src={qrCodeExample}
                        alt="QR Code para pagamento"
                        className="qr-code"
                    />
                    <p>Válido até 15 minutos após a solicitação</p>
                </div>
            )}

            {paymentMethod === "Boleto" && (
                <div className="boleto-payment">
                    <h3>Método Selecionado: Boleto Bancário</h3>
                    <p>Copie a linha digitável abaixo para pagamento:</p>
                    <div className="boleto-code">
                        <input type="text" value="0019 0009 9876 5432 1111 0000 0123 4567" readOnly />
                    </div>
                    <img
                        src="https://via.placeholder.com/600x200" // Substitua com a imagem real do boleto gerado
                        alt="Boleto Bancário"
                    />
                    <p>Válido até 15 minutos após a solicitação</p>
                </div>
            )}

            <div className="observations">
                <label>Observações do Pedido:</label>
                <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Adicione observações para o pedido (opcional)."
                ></textarea>
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Finalizar Pedido
            </button>

            <button
                className="back-button"
                onClick={() => navigate("/menu")}
            >
                Voltar ao Menu
            </button>
        </div>
    );
};

export default TypePayment;
