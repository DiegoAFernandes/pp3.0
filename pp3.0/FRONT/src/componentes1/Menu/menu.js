import React, { useState } from 'react';
import "./menu.css";
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const [cart, setCart] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const menuItems = [
        { name: "Pão francês 100g", price: 2.40 },
        { name: "Pão fatiado 100g", price: 1.00 },
        { name: "Presunto 100g", price: 3.50 },
        { name: "Queijo 100g", price: 4.90  },
        { name: "Mortadela", price: 41.00 },
        { name: "Café Coado", price: 14.00 },
        { name: "Café Espresso", price: 10.00 },
        { name: "Café com Leite", price: 10.00 },
        { name: "Cappuccino", price: 16.00 },
        { name: "Cappuccino Especial", price: 10.00 },
        { name: "Chocolate Quente", price: 14.00 },
        { name: "Frappuccino", price: 15.00 },
        { name: "Mocaccino", price: 12.00 },
        { name: "Cappuccino Gelado", price: 14.00 },
        { name: "Refrigerantes", price: 8.00 },
        { name: "Água c/gás", price: 4.00 },
        { name: "Água s/gás", price: 3.50 },
        { name: "Natural de Presunto", price: 14.00 },
        { name: "Natural de Frango", price: 10.00 },
        { name: "Natural de Carne", price: 16.00 },
        { name: "Assados", price: 14.00 },
        { name: "Fritos", price: 10.00 },
        { name: "Pão de Queijo", price: 8.00 },
        { name: "Bolo Pré-feito", price: 80.00 },
        { name: "Bolo ENCOMENDA", price: 0.00 }, // Este não tem preço fixo
        { name: "Sonho", price: 100.00 }
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
