import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User } from 'lucide-react';
import { usuarioService } from '@/services/api';
import type { Usuario } from '@/types';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

export default function EditarProfessor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError, NotificationModalComponent } = useNotificationModal();
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [professor, setProfessor] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: ''
  });

  useEffect(() => {
    if (!id) {
      navigate('/professores');
      return;
    }
    carregarProfessor();
  }, []);

  const carregarProfessor = async () => {
    try {
      const data = await usuarioService.getById(Number(id));
      setProfessor(data);
      setFormData({
        nome: data.nome,
        cpf: data.cpf
      });
    } catch (error) {
      console.error('Erro ao carregar professor:', error);
      showError('Erro', 'Erro ao carregar dados do professor');
    } finally {
      setCarregando(false);
    }
  };

  const formatCPF = (cpf: string) => {
    const numeros = cpf.replace(/\D/g, '');
    return numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professor) return;

    setLoading(true);
    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      await usuarioService.update(professor.id, {
        nome: formData.nome,
        cpf: cpfLimpo
      });
      showSuccess('Sucesso', 'Professor atualizado com sucesso');
      setTimeout(() => navigate('/professores'), 1000);
    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
      showError('Erro', 'Erro ao atualizar professor');
    } finally {
      setLoading(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/professores')}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-red-500">Editar Professor</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          Atualize os dados do professor
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors"
                placeholder="Digite o nome do professor"
                required
              />
            </div>
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                #
              </span>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Salvar
              </>
            )}
          </button>
        </form>
      </div>

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
