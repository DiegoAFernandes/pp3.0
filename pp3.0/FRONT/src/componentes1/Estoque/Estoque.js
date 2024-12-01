import React, { useState, useEffect } from "react";
import "./Estoque.css"; // Ajuste o nome do arquivo CSS, se necessário
import { useNavigate } from "react-router-dom";

const StockList = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemData, setNewItemData] = useState({
    Nome: "",
    Preco: "",
    QuantidadeEstoque: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Função para buscar itens do estoque
  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/items");
      if (response.ok) {
        const itemsData = await response.json();
        setItems(itemsData);
      } else {
        setError("Erro ao buscar itens: " + response.statusText);
      }
    } catch (error) {
      setError("Erro na requisição: " + error.message);
    }
  };

  // Função para verificar se o usuário é admin
  const checkAdminStatus = () => {
    const userRole = localStorage.getItem("admin");
    if (userRole !== "true") {
      alert("Acesso negado! Redirecionando...");
      navigate("/");
    } else {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    checkAdminStatus();
    fetchItems();
  }, [navigate]);

  // Função para edição
  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItemData({
      Nome: item.Nome,
      Preco: item.Preco,
      QuantidadeEstoque: item.QuantidadeEstoque,
    });
  };

  // Função para atualizar item
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { Nome, Preco, QuantidadeEstoque } = newItemData;

    if (!Nome || !Preco || !QuantidadeEstoque) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/items/${editingItem.Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItemData),
      });

      if (response.ok) {
        alert("Item atualizado com sucesso!");
        fetchItems();
        setEditingItem(null);
        setNewItemData({ Nome: "", Preco: "", QuantidadeEstoque: "" });
      } else {
        setError("Erro ao atualizar item.");
      }
    } catch (error) {
      setError("Erro ao realizar a operação.");
    }
  };

  // Função para deletar item
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este item?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8000/items/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSuccessMessage("Item deletado com sucesso!");
          fetchItems();
        } else {
          setError("Erro ao deletar item.");
        }
      } catch (error) {
        setError("Erro na requisição.");
      }
    }
  };

  // Atualiza os dados de um item em edição
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Botão para voltar
  const handleBack = () => {
    navigate("/HPP");
  };

  if (!isAdmin) {
    return <div>Você não tem permissão para acessar esta página.</div>;
  }

  return (
    <div className="stock-list">
      <h2>Estoque</h2>
      {error && <div className="error-message">{error}</div>}
      
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
            items.map((item) => (
              <tr key={item.Id}>
                <td>{item.Nome}</td>
                <td>R$ {item.Preco.toFixed(2)}</td>
                <td>{item.QuantidadeEstoque}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button onClick={() => handleDelete(item.Id)}>Deletar</button>
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
        <div className="edit-item">
          <h3>Editar Item</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Nome:</label>
              <input
                type="text"
                name="Nome"
                value={newItemData.Nome}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Preço:</label>
              <input
                type="number"
                step="0.01"
                name="Preco"
                value={newItemData.Preco}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Quantidade:</label>
              <input
                type="number"
                name="QuantidadeEstoque"
                value={newItemData.QuantidadeEstoque}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Salvar Alterações</button>
          </form>
        </div>
      )}

      <button onClick={handleBack}>Voltar</button>
    </div>
  );
};

export default StockList;
