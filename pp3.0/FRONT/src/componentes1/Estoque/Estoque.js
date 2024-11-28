import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../componentes1//Estoque/Estoque.css"; // Você pode ajustar o CSS para a nova página

const StockList = () => {
  const [items, setItems] = useState([]); // Armazena a lista de itens
  const [editingItem, setEditingItem] = useState(null); // Armazena o item que está sendo editado
  const [newItemData, setNewItemData] = useState({ name: '', price: '', quantity: '' }); // Dados do item para atualização
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin
  const navigate = useNavigate(); // Hook para navegação

  // Função para listar todos os itens de estoque
  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/items');
      if (response.ok) {
        const itemsData = await response.json();
        console.log('Itens:', itemsData); // Verifique os dados retornados
        setItems(itemsData);
      } else {
        console.error('Erro ao listar itens de estoque');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  // Função para editar um item de estoque
  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItemData({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    });
  };

  // Função para atualizar os dados de um item
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { name, price, quantity } = newItemData;

    if (!name || !price || !quantity) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData)
      });

      if (response.ok) {
        alert('Item atualizado com sucesso!');
        fetchItems(); // Atualiza a lista de itens
        setEditingItem(null); // Reseta o estado de edição
      } else {
        alert('Erro ao atualizar item');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  // Função para deletar um item de estoque
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este item?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8000/items/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Item deletado com sucesso!');
          fetchItems(); // Atualiza a lista de itens
        } else {
          alert('Erro ao deletar item');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  };

  // Função para manipular mudanças nos campos de edição
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Função para verificar se o usuário é administrador
  const checkAdminStatus = () => {
    const userRole = localStorage.getItem("admin"); // Supondo que o papel do usuário esteja armazenado no localStorage
    if (userRole !== "true") {
      alert("Acesso negado! Você não tem permissão para acessar esta página.");
      navigate("/"); // Redireciona para a página inicial
    } else {
      setIsAdmin(true); // Usuário é admin, continua na página
    }
  };

  // Carregar a lista de itens e verificar o status do admin assim que o componente for montado
  useEffect(() => {
    checkAdminStatus(); // Verifica se o usuário é admin
    fetchItems(); // Carrega os itens de estoque
  }, [navigate]);

  // Função para voltar para a página /HPP
  const handleBack = () => {
    navigate("/HPP"); // Redireciona para a página HPP
  };

  // Se não for admin, renderiza nada ou um aviso
  if (!isAdmin) {
    return <div>Você não tem permissão para acessar esta página.</div>;
  }

  return (
    <div>
      
      <h2>Lista de Itens de Estoque</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
        {items.length > 0 ? (
  items.map((item, index) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.price}</td>
      <td>{item.quantity}</td>
      <td>
        <button onClick={() => handleEdit(item)}>Editar</button>
        <button onClick={() => handleDelete(item.id)}>Deletar</button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="4">Nenhum item encontrado.</td>
  </tr>
)}
        </tbody>
      </table>

      {editingItem && (
        <div>
          <h3>Editar Item</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Nome:</label>
              <input
                type="text"
                name="name"
                value={newItemData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Preço:</label>
              <input
                type="number"
                name="price"
                value={newItemData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Quantidade:</label>
              <input
                type="number"
                name="quantity"
                value={newItemData.quantity}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Salvar Alterações</button>
          </form>
        </div>
      )}
      <button onClick={handleBack}>Voltar</button> {/* Botão de Voltar */}
    </div>
  );
};

export default StockList;
