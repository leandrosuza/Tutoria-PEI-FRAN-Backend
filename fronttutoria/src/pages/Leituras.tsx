import { useState } from 'react';
import { BookOpen, Plus, Library, ChevronLeft, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

export default function Leituras() {
  const navigate = useNavigate();
  const { showSuccess, NotificationModalComponent } = useNotificationModal();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [leituras, setLeituras] = useState<any[]>([]);
  const [filteredLeituras, setFilteredLeituras] = useState<any[]>([]);
  const [filtroBimestre, setFiltroBimestre] = useState('todos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Sucesso!', 'Leitura registrada com sucesso!');
    setShowForm(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    aplicarFiltros(term, filtroBimestre);
  };

  const handleFiltroBimestre = (bimestre: string) => {
    setFiltroBimestre(bimestre);
    aplicarFiltros(searchTerm, bimestre);
  };

  const aplicarFiltros = (term: string, bimestre: string) => {
    let filtered = leituras;
    
    // Filtro por busca
    if (term.trim()) {
      filtered = filtered.filter(leitura =>
        leitura.livro?.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Filtro por bimestre
    if (bimestre !== 'todos') {
      filtered = filtered.filter(leitura => leitura.bimestre === parseInt(bimestre));
    }
    
    setFilteredLeituras(filtered);
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
          <h1 className="text-xl font-bold text-white">Leituras</h1>
          <p className="text-sm text-gray-400">Controle de leitura</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="ml-auto p-3 bg-purple-500 rounded-xl text-white"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Estatisticas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1a1f2e] p-4 rounded-2xl text-center">
          <Library className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Livros</p>
        </div>
        <div className="bg-[#1a1f2e] p-4 rounded-2xl text-center">
          <BookOpen className="h-6 w-6 text-pink-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Registros</p>
        </div>
        <div className="bg-[#1a1f2e] p-4 rounded-2xl text-center">
          <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Bimestre</p>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-[#1a1f2e] p-5 rounded-2xl mb-4">
          <h2 className="text-lg font-semibold text-white mb-4">Nova Leitura</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">RA do Aluno</label>
              <input type="number" className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome do Livro</label>
              <input type="text" className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" placeholder="Ex: O Pequeno Principe" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bimestre</label>
                <select className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="1">1 Bimestre</option>
                  <option value="2">2 Bimestre</option>
                  <option value="3">3 Bimestre</option>
                  <option value="4">4 Bimestre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data</label>
                <input type="date" className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-medium">Salvar</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-medium">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="bg-[#1a1f2e] rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="h-5 w-5 text-gray-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar leitura..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
          <select 
            value={filtroBimestre}
            onChange={(e) => handleFiltroBimestre(e.target.value)}
            className="bg-[#0a0e1a] border border-gray-700 rounded-lg px-3 py-1 text-sm text-white ml-3"
          >
            <option value="todos">Todos</option>
            <option value="1">1 Bimestre</option>
            <option value="2">2 Bimestre</option>
            <option value="3">3 Bimestre</option>
            <option value="4">4 Bimestre</option>
          </select>
        </div>
        {filteredLeituras.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <p>{searchTerm || filtroBimestre !== 'todos' ? 'Nenhuma leitura encontrada' : 'Nenhuma leitura registrada'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeituras.map((leitura, index) => (
              <div key={index} className="bg-[#0a0e1a] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-medium">{leitura.livro || 'Livro'}</p>
                    <p className="text-gray-400 text-sm mt-1">{leitura.bimestre ? `${leitura.bimestre}º Bimestre` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
