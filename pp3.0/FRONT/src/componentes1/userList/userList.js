import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./listaNomes.css"; 

const UserList = () => {
  const [users, setUsers] = useState([]); // Armazena a lista de usuários
  const [editingUser, setEditingUser] = useState(null); // Armazena o usuário que está sendo editado
  const [newUserData, setNewUserData] = useState({ username: '', email: '', phone: '' }); // Dados do usuário para atualização
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin
  const navigate = useNavigate(); // Hook para navegação

  // Função para listar todos os usuários
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/users');
      if (response.ok) {
        const usersData = await response.json();
        console.log('Usuarios:', usersData); // Verifique os dados retornados
        setUsers(usersData);
      } else {
        console.error('Erro ao listar usuários');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  // Função para editar um usuário
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUserData({
      username: user.username,
      email: user.email,
      phone: user.phone
    });
  };

  // Função para atualizar os dados de um usuário
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { username, email, phone } = newUserData;

    if (!username || !email || !phone) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/users/${editingUser.id}`, {
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

  // Função para deletar um usuário
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

  // Função para manipular mudanças nos campos de edição
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Função para verificar se o usuário é administrador
  const checkAdminStatus = () => {
    // Aqui você pode verificar a role do usuário, por exemplo, com base em um token
    // No exemplo, estamos simulando com um estado local isAdmin
    const userRole = localStorage.getItem("admin"); // Supondo que o papel do usuário esteja armazenado no localStorage
    if (userRole !== "true") {
      alert("Acesso negado! Você não tem permissão para acessar esta página.");
      navigate("/"); // Redireciona para a página inicial
    } else {
      setIsAdmin(true); // Usuário é admin, continua na página
    }
  };

  // Carregar a lista de usuários e verificar o status do admin assim que o componente for montado
  useEffect(() => {
    checkAdminStatus(); // Verifica se o usuário é admin
    fetchUsers(); // Carrega os usuários
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
      <h2>Lista de Usuários</h2>
      <table border="1" cellPadding="10">
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
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user.id)}>Deletar</button>
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
        <div>
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
      <button onClick={handleBack}>Voltar</button> {/* Botão de Voltar */}
    </div>
  );
};

export default UserList;
