import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';
import { tutoriaService } from '@/services/api';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

interface TutoriaForm {
  data: string;
  tarefaCmsp: boolean;
  leitura: boolean;
  redacao: boolean;
  provaPaulista: boolean;
  avaliacoes: boolean;
  dificuldades: boolean;
  outros: boolean;
  orientacoesTutor: string;
}

const assuntos = [
  { key: 'tarefaCmsp', label: 'Tarefa CMSP' },
  { key: 'leitura', label: 'Leitura' },
  { key: 'redacao', label: 'Redação' },
  { key: 'provaPaulista', label: 'Prova Paulista' },
  { key: 'avaliacoes', label: 'Avaliações' },
  { key: 'dificuldades', label: 'Dificuldades' },
  { key: 'outros', label: 'Outros' },
] as const;

export default function Tutoria() {
  const navigate = useNavigate();
  const location = useLocation();
  const ra = location.state?.ra;
  const { showSuccess, showError, NotificationModalComponent } = useNotificationModal();

  const [form, setForm] = useState<TutoriaForm>({
    data: new Date().toISOString().split('T')[0],
    tarefaCmsp: false,
    leitura: false,
    redacao: false,
    provaPaulista: false,
    avaliacoes: false,
    dificuldades: false,
    outros: false,
    orientacoesTutor: '',
  });

  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ra) {
      loadHistorico();
    }
  }, [ra]);

  const loadHistorico = async () => {
    try {
      const data = await tutoriaService.getAll(ra);
      setHistorico(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleCheckboxChange = (key: keyof TutoriaForm) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ra) {
      showError('Atenção', 'Selecione um aluno primeiro');
      return;
    }

    setLoading(true);
    try {
      await tutoriaService.create(ra, form);
      showSuccess('Sucesso!', 'Registro salvo com sucesso!');
      setForm({
        data: new Date().toISOString().split('T')[0],
        tarefaCmsp: false,
        leitura: false,
        redacao: false,
        provaPaulista: false,
        avaliacoes: false,
        dificuldades: false,
        outros: false,
        orientacoesTutor: '',
      });
      loadHistorico();
    } catch (error) {
      showError('Erro', 'Erro ao salvar registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-red-500">Tutoria</h1>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
          {/* Data */}
          <div className="p-4 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.data}
                onChange={(e) => setForm(prev => ({ ...prev, data: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          {/* Assunto */}
          <div className="p-4 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Assunto
            </label>
            <div className="space-y-2">
              {assuntos.map((assunto) => (
                <label
                  key={assunto.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[assunto.key as keyof TutoriaForm] as boolean}
                    onChange={() => handleCheckboxChange(assunto.key as keyof TutoriaForm)}
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{assunto.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Orientações do Tutor */}
          <div className="p-4 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientações do Tutor
            </label>
            <textarea
              value={form.orientacoesTutor}
              onChange={(e) => setForm(prev => ({ ...prev, orientacoesTutor: e.target.value }))}
              placeholder="Digite aqui as orientações do tutor..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Botão Salvar */}
          <div className="p-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>

        {/* Histórico */}
        {historico.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Histórico</h3>
            <div className="space-y-3">
              {historico.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.data}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.orientacoesTutor}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
