import { useState, useEffect } from 'react';
import { usuarioService } from '../services/api';
import type { Usuario } from '../types';
import { Plus, Search, Edit, Trash2, ChevronLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

export default function Usuarios() {
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm, NotificationModalComponent } = useNotificationModal();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cpf: '', perfil: 'PROFESSOR' as 'ADMIN' | 'PROFESSOR' });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usuarioService.create(formData);
      setFormData({ nome: '', cpf: '', perfil: 'PROFESSOR' });
      setShowForm(false);
      loadUsuarios();
      showSuccess('Sucesso!', 'Usuário criado com sucesso!');
    } catch (error) {
      showError('Erro', 'Erro ao criar usuário');
    }
  };

  const confirmDelete = (id: number) => {
    showConfirm(
      'Confirmar Exclusão',
      'Deseja realmente excluir este usuário?',
      () => handleDelete(id)
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await usuarioService.delete(id);
      loadUsuarios();
      showSuccess('Sucesso!', 'Usuário excluído com sucesso!');
    } catch (error) {
      showError('Erro', 'Erro ao excluir usuário');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsuarios(usuarios);
      return;
    }
    const filtered = usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(term.toLowerCase()) ||
      usuario.cpf.includes(term.replace(/\D/g, ''))
    );
    setFilteredUsuarios(filtered);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Usuarios</h1>
          <p className="text-sm text-gray-400">Gerenciamento de usuarios</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="ml-auto p-3 bg-orange-500 rounded-xl text-white"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-[#1a1f2e] p-5 rounded-2xl mb-4">
          <h2 className="text-lg font-semibold text-white mb-4">Novo Usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome</label>
              <input 
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">CPF</label>
              <input 
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                required 
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium">Salvar</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-medium">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Busca */}
      <div className="bg-[#1a1f2e] p-4 rounded-2xl mb-4">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-gray-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar usuario..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="bg-[#1a1f2e] rounded-2xl p-8 text-center text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <p>{searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuario cadastrado'}</p>
          </div>
        ) : (
          filteredUsuarios.map((usuario) => (
            <div key={usuario.id} className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{usuario.nome}</p>
                  <p className="text-sm text-gray-500">{usuario.cpf}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => confirmDelete(usuario.id)}
                  className="p-2 bg-red-500/20 rounded-lg text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
