import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./notaPagamento.css" 

const NotaPagamento = () => {
    const location = useLocation();
    const { totalPrice, paymentDetails, cartItens } = location.state || {};
    const navigate = useNavigate();

    return (
        <div className="nota-pagamento-container">
            <h2>Nota de Pagamento</h2>

            <div className="payment-summary">
                <h3>Resumo do Pedido</h3>
                
                <div className="payment-method">
                    <p><strong>Método de Pagamento:</strong> {paymentDetails.method}</p>
                    
                    {paymentDetails.method === "Cartão" && (
                        <div>
                            <p><strong>Nome do Titular:</strong> {paymentDetails.cardDetails.cardName}</p>
                            <p><strong>Últimos 4 dígitos do Cartão:</strong> **** {paymentDetails.cardDetails.cardNumber.slice(-4)}</p>
                            <p><strong>Data de Validade:</strong> {paymentDetails.cardDetails.expiryDate}</p>
                        </div>
                    )}
                </div>

                <div className="address">
                    <p><strong>Opção de Entrega:</strong> {paymentDetails.deliveryOption}</p>

                    {paymentDetails.deliveryOption === "Entregar" && (
                        <p><strong>Endereço:</strong> {paymentDetails.address}</p>
                    )}
                </div>

                <div className="observations">
                    <p><strong>Observações:</strong> {paymentDetails.observations || "Nenhuma observação."}</p>
                </div>

                <div className="items">
                <h3>Itens do Pedido</h3>
                {cartItens && cartItens.length > 0 ? (
                    <ul>
                    {cartItens.map((item, index) => (
                            <li key={index} className='i12'>
                                {item.name} - R$ {item.price.toFixed(2)} x {item.quantity}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum item encontrado.</p>
                )}
                </div>


                
                <p className='bold'><strong className='red'>Total: </strong>R$ {totalPrice ? totalPrice.toFixed(2) : "0.00"}</p>
            </div>

            <button className="back-button" onClick={() => navigate('/menu')}>
                Voltar ao Menu
            </button>
        </div>
    );
};

export default NotaPagamento;
