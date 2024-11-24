'use client';

import { useState, useEffect } from 'react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', email: '' });
  const [message, setMessage] = useState('');

  // Função para buscar os usuários (GET)
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  // Função para adicionar um usuário (POST)
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      const data = await response.json();
      setMessage('Usuário criado com sucesso!');
      setFormData({ name: '', email: '' }); // Limpa o formulário
      fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  // Função para atualizar um usuário (PUT)
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setMessage('Usuário atualizado com sucesso!');
      setFormData({ name: '', email: '' }); // Limpa o formulário
      fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  // Função para deletar um usuário (DELETE)
  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      setMessage(data.message || 'Usuário deletado com sucesso!');
      fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Preenche o formulário com os dados do usuário para edição
  const handleEdit = (user) => {
    setFormData(user);
  };

  // Carrega os usuários quando a página é carregada
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gerenciamento de Usuários</h1>

      {/* Mensagem de sucesso ou erro */}
      {message && <p className="mb-4 text-green-500">{message}</p>}

      {/* Formulário de criação/edição de usuários */}
      <form onSubmit={formData.id ? handleUpdateUser : handleAddUser} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {formData.id ? 'Atualizar Usuário' : 'Criar Usuário'}
        </button>
      </form>

      {/* Lista de usuários */}
      <h2 className="text-lg font-bold mb-2">Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2 flex justify-between items-center">
            <span>
              {user.name} ({user.email})
            </span>
            <div>
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
