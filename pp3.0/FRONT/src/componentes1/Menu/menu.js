import React, { useState } from 'react';
import "./menu.css";
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const [cart, setCart] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const menuItems = [
        { name: "Pão francês 100g", price: 1.49 },
        { name: "Pão fatiado 100g", price: 0.99 },
        { name: "Presunto 100g", price: 3.49 },
        { name: "Queijo 100g", price: 4.90  },
        { name: "Mortadela 100g", price: 4.10 },
        { name: "Café Coado", price: 9.99 },
        { name: "Café Espresso", price: 11.99 },
        { name: "Café com Leite", price: 10.99 },
        { name: "Cappuccino", price: 13.99 },
        { name: "Cappuccino Especial", price: 15.99 },
        { name: "Chocolate Quente", price: 13.99 },
        { name: "Frappuccino", price: 12.49 },
        { name: "Mocaccino", price: 11.99 },
        { name: "Cappuccino Gelado", price: 13.99 },
        { name: "Refrigerantes", price: 7.99 },
        { name: "Água c/gás", price: 3.99 },
        { name: "Água s/gás", price: 3.49 },
        { name: "Natural de Presunto", price: 9.99 },
        { name: "Natural de Frango", price: 8.99 },
        { name: "Natural de Carne", price: 10.99 },
        { name: "Assados", price: 8.49 },
        { name: "Fritos", price: 8.99 },
        { name: "Pão de Queijo", price: 6.99 },
        { name: "Bolo Pré-feito", price: 79.99 },
        { name: "Bolo ENCOMENDA - ligar para a loja mais próxima", price: 0.00 }, 
        { name: "Sonho", price: 7.99 },
        { name: "Brigadeiro 100g", price: 4.99 },
        { name: "Cajuzinho 100g", price: 5.99 },
        { name: "Dois Amores 100g", price: 4.49 }
    ];

    const addToCart = (item) => {
        const newCart = { ...cart };
        newCart[item.name] = (newCart[item.name] || 0) + 1;
        setCart(newCart);
        updateTotalPrice(newCart);
    };

    const removeFromCart = (item) => {
        const newCart = { ...cart };
        if (newCart[item.name]) {
            newCart[item.name] -= 1;
            if (newCart[item.name] <= 0) {
                delete newCart[item.name];
            }
            setCart(newCart);
            updateTotalPrice(newCart);
        }
    };

    const updateTotalPrice = (cart) => {
        let total = 0;
        for (const item of menuItems) {
            if (cart[item.name]) {
                total += item.price * cart[item.name];
            }
        }
        setTotalPrice(total);
    };
    const navigate = useNavigate();
    const handleHomePage = () => {        
        navigate('/');
    };
    const handlePagamento = () => {
        navigate('/Pagamento')
    };

    

    return (
        <div className="menu-container">
            <div className="menu-box">
                <h2>Menu da padaria</h2>
                <div className="menu-columns">
                    <div className="menu-column">
                        <div className="menu-section">
                            <h3>Avulsos</h3>
                            <ul>
                                {menuItems.slice(0, 5).map((item, index) => (
                                    <li key={index}>
                                        {item.name} - R$ {item.price.toFixed(2)}
                                        <div className="quantity-controls">
                                            <button onClick={() => removeFromCart(item)}>-</button>
                                            <span>{cart[item.name] || 0}</span>
                                            <button onClick={() => addToCart(item)}>+</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="menu-section">
                            <h3>Bebidas</h3>
                            <ul>
                                {menuItems.slice(5, 15).map((item, index) => (
                                    <li key={index}>
                                        {item.name} - R$ {item.price.toFixed(2)}
                                        <div className="quantity-controls">
                                            <button onClick={() => removeFromCart(item)}>-</button>
                                            <span>{cart[item.name] || 0}</span>
                                            <button onClick={() => addToCart(item)}>+</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="menu-column">
                        <div className="menu-section">
                            <h3>Sanduíches</h3>
                            <ul>
                                {menuItems.slice(15, 18).map((item, index) => (
                                    <li key={index}>
                                        {item.name} - R$ {item.price.toFixed(2)}
                                        <div className="quantity-controls">
                                            <button onClick={() => removeFromCart(item)}>-</button>
                                            <span>{cart[item.name] || 0}</span>
                                            <button onClick={() => addToCart(item)}>+</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="menu-section">
                            <h3>Salgados</h3>
                            <ul>
                                {menuItems.slice(18, 23).map((item, index) => (
                                    <li key={index}>
                                        {item.name} - R$ {item.price.toFixed(2)}
                                        <div className="quantity-controls">
                                            <button onClick={() => removeFromCart(item)}>-</button>
                                            <span>{cart[item.name] || 0}</span>
                                            <button onClick={() => addToCart(item)}>+</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="menu-section">
                            <h3>Doces</h3>
                            <ul>
                                {menuItems.slice(23).map((item, index) => (
                                    <li key={index}>
                                        {item.name} - R$ {item.price.toFixed(2)}
                                        <div className="quantity-controls">
                                            <button onClick={() => removeFromCart(item)}>-</button>
                                            <span>{cart[item.name] || 0}</span>
                                            <button onClick={() => addToCart(item)}>+</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="menu-box">
                <h2>Carrinho</h2>
                <ul className="teste">
                    {Object.keys(cart).map((itemName, index) => (
                        cart[itemName] > 0 && (
                            <li key={index}>
                                {itemName}: {cart[itemName]} - R$ {(menuItems.find(item => item.name === itemName).price * cart[itemName]).toFixed(2)}
                            </li>
                        )
                    ))}
                </ul>
                                
                <h3>Total: R$ {totalPrice.toFixed(2)}</h3>
                <button className="return" onClick={handleHomePage} type='submit'>Voltar</button> <button className='continue' onClick={handlePagamento} type='submit'>Prosseguir</button>
            </div>
        </div>
    );
};

export default Menu;
