import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./listaNomes.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserData, setNewUserData] = useState({ username: '', email: '', phone: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const navigate = useNavigate();

  // Função para buscar usuários
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/users');
      if (response.ok) {
        const usersData = await response.json();
        console.log('Usuários:', usersData); // Verifique os dados retornados
        setUsers(usersData); // Atualizando o estado com os dados dos usuários
      } else {
        console.error('Erro ao listar usuários');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false); // Define o loading como false após a requisição
    }
  };

  // Função para editar usuário
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUserData({
      username: user.Username,
      email: user.Email,
      phone: user.Phone
    });
  };

  // Função para atualizar usuário
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { username, email, phone } = newUserData;

    if (!username || !email || !phone) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/users/${editingUser.UserID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        alert('Usuário atualizado com sucesso!');
        fetchUsers(); // Atualiza a lista de usuários
        setEditingUser(null); // Reseta o estado de edição
      } else {
        alert('Erro ao atualizar usuário');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  // Função para deletar usuário
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este usuário?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8000/users/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Usuário deletado com sucesso!');
          fetchUsers(); // Atualiza a lista de usuários
        } else {
          alert('Erro ao deletar usuário');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  };

  // Função para monitorar mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Verifica se o usuário tem permissão de admin
  const checkAdminStatus = () => {
    const userRole = localStorage.getItem("admin");
    if (userRole !== "true") {
      alert("Acesso negado! Você não tem permissão para acessar esta página.");
      navigate("/");
    } else {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, [navigate]);

  const handleBack = () => {
    navigate("/HPP");
  };

  // Se não for admin, não exibe a lista de usuários
  if (!isAdmin) {
    return <div>Você não tem permissão para acessar esta página.</div>;
  }

  // Se ainda estiver carregando, mostra "Carregando..."
  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div className="user-list-container">
      <h2>Lista de Usuários</h2>
      <table className="user-table" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.UserID}>
                <td>{user.Username}</td>
                <td>{user.Email}</td>
                <td>{user.Phone}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user.UserID)}>Deletar</button>
                </td>
              </tr>

            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div className="edit-form">
          <h3>Editar Usuário</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Nome de Usuário:</label>
              <input
                type="text"
                name="username"
                value={newUserData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newUserData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Telefone:</label>
              <input
                type="text"
                name="phone"
                value={newUserData.phone}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Salvar Alterações</button>
          </form>
        </div>
      )}
      <button className="cancel-button" onClick={handleBack}>Voltar</button>
    </div>
  );
};

export default UserList;
