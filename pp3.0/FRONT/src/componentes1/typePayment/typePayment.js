import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./typePayment.css";

const TypePayment = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [observations, setObservations] = useState('');
    const [deliveryOption, setDeliveryOption] = useState('');
    const [address, setAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const totalPrice = location.state?.totalPrice || 0;
    const cartItens = location.state?.cartItens || [];

    const handlePaymentSelection = (method) => {
        setPaymentMethod(method);
        setError('');
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

    const handleSubmit = async () => {
        // Validação dos dados do pagamento e entrega
    
        const paymentDetails = {
            method: paymentMethod,
            deliveryOption,
            address: deliveryOption === "Entregar" ? address : null,
            observations,
            cardDetails:
                paymentMethod === "Cartão"
                    ? { cardNumber, cardName, expiryDate, cvv }
                    : null,
        };
    
        // Cria um objeto com os itens e a quantidade que deve ser atualizada no estoque
        const itemsToUpdate = cartItens.map(item => ({
            id: item.id,  // Garantir que o id do item esteja presente
            quantity: item.quantity,
        }));
    
        try {
            const response = await fetch("http://localhost:8000/update-stock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    itemsToUpdate,  // Envia a lista de itens com a quantidade a ser atualizada
                }),
            });
    
            if (!response.ok) {
                throw new Error("Erro ao processar o pedido.");
            }
    
            alert("Pedido finalizado com sucesso!");
            navigate('/notaPagamento', { state: { totalPrice, paymentDetails, cartItens } });
        } catch (error) {
            console.error("Erro ao finalizar o pedido:", error);
            alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
        }
    };
    
    

    const qrCodeExample = "https://via.placeholder.com/200";

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
                    Dinheiro
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
                    <img src={qrCodeExample} alt="QR Code para pagamento" className="qr-code" />
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
                    <img src="https://via.placeholder.com/600x200" alt="Boleto Bancário" />
                    <p>Válido até 15 minutos após a solicitação</p>
                </div>
            )}

            <div className="cash-options">
                <h3></h3>
                <p>Selecione uma opção:</p>
                <div>
                    <button
                        onClick={() => setDeliveryOption("Entregar")}
                        className={deliveryOption === "Entregar" ? "selected" : ""}
                    >
                        Entregar
                    </button>
                    <button
                        onClick={() => setDeliveryOption("Retirar")}
                        className={deliveryOption === "Retirar" ? "selected" : ""}
                    >
                        Retirar
                    </button>
                </div>

                {deliveryOption === "Entregar" && (
                    <div className="address-input">
                        <label htmlFor="address">Endereço:</label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Digite seu endereço"
                            required
                        />
                    </div>
                )}
            </div>

            <div className="observations">
                <label>Observações do Pedido:</label>
                <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Adicione observações para o pedido (opcional)."
                ></textarea>
            </div>

            <div className="total-price">
                <h3>Total da Compra: R$ {totalPrice.toFixed(2)}</h3>
            </div>

            <div className="itens">
                <h3>Itens:</h3>
                <ul>
                    {cartItens.map((item, index) => (
                        <li key={index} className="l12">
                            {item.name} - R$ {item.price.toFixed(2)} x {item.quantity}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Finalizar Pedido
            </button>

            <button className="back-button" onClick={() => navigate("/menu")}>
                Voltar ao Menu
            </button>
        </div>
    );
};

export default TypePayment;
