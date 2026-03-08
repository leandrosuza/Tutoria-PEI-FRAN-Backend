import { useState } from 'react';
import { BookOpen, Plus, Search, TrendingUp, Award, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

export default function Avaliacoes() {
  const navigate = useNavigate();
  const { showSuccess, NotificationModalComponent } = useNotificationModal();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [filteredAvaliacoes, setFilteredAvaliacoes] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Sucesso!', 'Avaliação registrada com sucesso!');
    setShowForm(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredAvaliacoes(avaliacoes);
      return;
    }
    const filtered = avaliacoes.filter(avaliacao =>
      avaliacao.materia?.toLowerCase().includes(term.toLowerCase()) ||
      avaliacao.tipo?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAvaliacoes(filtered);
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
          <h1 className="text-xl font-bold text-white">Avaliacoes</h1>
          <p className="text-sm text-gray-400">Notas e desempenho</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="ml-auto p-3 bg-blue-500 rounded-xl text-white"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Estatisticas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1a1f2e] p-4 rounded-2xl text-center">
          <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500 mt-1">Media</p>
        </div>
        <div className="bg-[#1a1f2e] p-4 rounded-2xl text-center">
          <BookOpen className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500 mt-1">Total</p>
        </div>
        <div className="bg-[#1a1f2e] p-4 rounded-2xl text-center">
          <Award className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500 mt-1">Destaques</p>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-[#1a1f2e] p-5 rounded-2xl mb-4">
          <h2 className="text-lg font-semibold text-white mb-4">Nova Avaliacao</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">RA do Aluno</label>
                <input type="number" className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Materia</label>
                <select className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required>
                  <option value="">Selecione</option>
                  <option value="Matematica">Matematica</option>
                  <option value="Portugues">Portugues</option>
                  <option value="Ciencias">Ciencias</option>
                  <option value="Historia">Historia</option>
                  <option value="Geografia">Geografia</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Periodo</label>
                <select className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required>
                  <option value="1">1 Bimestre</option>
                  <option value="2">2 Bimestre</option>
                  <option value="3">3 Bimestre</option>
                  <option value="4">4 Bimestre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nota</label>
                <input type="number" step="0.1" max="10" className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium">Salvar</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-medium">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="bg-[#1a1f2e] rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-5 w-5 text-gray-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar avaliacao..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
        {filteredAvaliacoes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <p>{searchTerm ? 'Nenhuma avaliação encontrada' : 'Nenhuma avaliacao registrada'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAvaliacoes.map((avaliacao, index) => (
              <div key={index} className="bg-[#0a0e1a] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{avaliacao.materia || 'Matéria'}</p>
                    <p className="text-gray-400 text-sm mt-1">{avaliacao.tipo || 'Tipo'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-bold">{avaliacao.nota || '0'}</p>
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
