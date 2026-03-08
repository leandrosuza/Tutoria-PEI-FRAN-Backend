import { useState } from 'react';
import { AlertTriangle, Plus, Shield, ChevronLeft, Search, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

export default function Ocorrencias() {
  const navigate = useNavigate();
  const { showSuccess, NotificationModalComponent } = useNotificationModal();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [filteredOcorrencias, setFilteredOcorrencias] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Sucesso!', 'Ocorrência registrada com sucesso!');
    setShowForm(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredOcorrencias(ocorrencias);
      return;
    }
    const filtered = ocorrencias.filter(ocorrencia =>
      ocorrencia.descricao?.toLowerCase().includes(term.toLowerCase()) ||
      ocorrencia.tipo?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOcorrencias(filtered);
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
          <h1 className="text-xl font-bold text-white">Ocorrencias</h1>
          <p className="text-sm text-gray-400">Registro disciplinar</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="ml-auto p-3 bg-red-500 rounded-xl text-white"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Alerta */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
        <Info className="h-5 w-5 text-amber-400 mt-0.5" />
        <div>
          <p className="text-sm text-amber-400">Importante</p>
          <p className="text-xs text-gray-400 mt-1">
            O registro de ocorrencias deve ser feito em conformidade com o regimento escolar.
          </p>
        </div>
      </div>

      {/* Estatisticas */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1a1f2e] p-3 rounded-2xl text-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-[#1a1f2e] p-3 rounded-2xl text-center">
          <AlertTriangle className="h-5 w-5 text-orange-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Graves</p>
        </div>
        <div className="bg-[#1a1f2e] p-3 rounded-2xl text-center">
          <Shield className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Medias</p>
        </div>
        <div className="bg-[#1a1f2e] p-3 rounded-2xl text-center">
          <Shield className="h-5 w-5 text-green-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Resolvidas</p>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-[#1a1f2e] p-5 rounded-2xl mb-4">
          <h2 className="text-lg font-semibold text-white mb-4">Nova Ocorrencia</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">RA</label>
                <input type="number" className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data</label>
                <input type="date" className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tipo</label>
              <select className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" required>
                <option value="">Selecione...</option>
                <option value="atraso">Atraso</option>
                <option value="falta">Falta</option>
                <option value="comportamento">Comportamento</option>
                <option value="uniforme">Uniforme</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Descricao</label>
              <textarea className="w-full bg-[#0a0e1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 h-24 resize-none" placeholder="Descreva a ocorrencia..." required></textarea>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium">Registrar</button>
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
            placeholder="Buscar ocorrencia..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
        {filteredOcorrencias.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <p>{searchTerm ? 'Nenhuma ocorrência encontrada' : 'Nenhuma ocorrencia registrada'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOcorrencias.map((ocorrencia, index) => (
              <div key={index} className="bg-[#0a0e1a] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{ocorrencia.tipo || 'Ocorrência'}</p>
                    <p className="text-gray-400 text-sm mt-1">{ocorrencia.descricao || 'Sem descrição'}</p>
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
