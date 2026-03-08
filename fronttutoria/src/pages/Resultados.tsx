import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { avaliacaoService } from '@/services/api';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

interface ResultadoDisciplina {
  disciplina: string;
  bimestres: {
    [key: number]: {
      numQuestoes: string;
      acertos: string;
    };
  };
}

interface ResultadoSimulado {
  bimestres: {
    [key: number]: {
      numQuestoes: string;
      acertos: string;
    };
  };
}

interface ModalState {
  isOpen: boolean;
  tipo: 'disciplina' | 'simulado' | null;
  discIndex?: number;
  bimestre?: number;
  field?: 'numQuestoes' | 'acertos';
  valor: string;
  titulo: string;
}

const disciplinasIniciais = (): ResultadoDisciplina[] => [
  {
    disciplina: 'Inglês Avançado',
    bimestres: { 1: { numQuestoes: '', acertos: '' }, 2: { numQuestoes: '', acertos: '' }, 3: { numQuestoes: '', acertos: '' }, 4: { numQuestoes: '', acertos: '' } }
  },
  {
    disciplina: 'Lógica de Programação',
    bimestres: { 1: { numQuestoes: '', acertos: '' }, 2: { numQuestoes: '', acertos: '' }, 3: { numQuestoes: '', acertos: '' }, 4: { numQuestoes: '', acertos: '' } }
  },
  {
    disciplina: 'Matemática',
    bimestres: { 1: { numQuestoes: '', acertos: '' }, 2: { numQuestoes: '', acertos: '' }, 3: { numQuestoes: '', acertos: '' }, 4: { numQuestoes: '', acertos: '' } }
  }
];

const simuladoInicial = (): ResultadoSimulado => ({
  bimestres: { 1: { numQuestoes: '', acertos: '' }, 2: { numQuestoes: '', acertos: '' }, 3: { numQuestoes: '', acertos: '' }, 4: { numQuestoes: '', acertos: '' } }
});

const BIMESTRES = [1, 2, 3, 4];

export default function Resultados() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const raFromUrl = searchParams.get('ra');
  const { showSuccess, showError, NotificationModalComponent } = useNotificationModal();
  
  // Verificar localStorage primeiro, depois URL
  const getRaAluno = () => {
    const alunoSelecionado = localStorage.getItem('alunoSelecionado');
    if (alunoSelecionado) {
      const alunoData = JSON.parse(alunoSelecionado);
      return String(alunoData.ra);
    }
    return raFromUrl;
  };

  const [disciplinas, setDisciplinas] = useState<ResultadoDisciplina[]>(disciplinasIniciais());
  const [simulado, setSimulado] = useState<ResultadoSimulado>(simuladoInicial());
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    tipo: null,
    valor: '',
    titulo: ''
  });
  const [inputModal, setInputModal] = useState('');

  useEffect(() => {
    const ra = getRaAluno();
    if (ra) {
      carregarAvaliacoes(parseInt(ra));
    }
  }, [raFromUrl]);

  const carregarAvaliacoes = async (ra: number) => {
    try {
      const avaliacoes = await avaliacaoService.getAll(ra);
      console.log('Avaliações carregadas:', avaliacoes);
      
      if (!avaliacoes || avaliacoes.length === 0) return;

      // Criar cópias dos estados iniciais
      const newDisciplinas = disciplinasIniciais();
      const newSimulado = simuladoInicial();

      avaliacoes.forEach((av: any) => {
        const bimestre = parseInt(av.periodo) || 1;
        
        if (av.tipo === 'APP') {
          // Encontrar a disciplina correspondente
          const discIndex = newDisciplinas.findIndex(d => d.disciplina === av.materia);
          if (discIndex !== -1 && bimestre >= 1 && bimestre <= 4) {
            newDisciplinas[discIndex].bimestres[bimestre] = {
              numQuestoes: String(av.numQuestoes || ''),
              acertos: String(av.numAcertos || '')
            };
          }
        } else if (av.tipo === 'SIMULADO') {
          if (bimestre >= 1 && bimestre <= 4) {
            newSimulado.bimestres[bimestre] = {
              numQuestoes: String(av.numQuestoes || ''),
              acertos: String(av.numAcertos || '')
            };
          }
        }
      });

      setDisciplinas(newDisciplinas);
      setSimulado(newSimulado);
    } catch (error) {
      console.log('Erro ao carregar avaliações:', error);
    }
  };

  const handleInputChange = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 3);
  };

  const abrirModal = (
    tipo: 'disciplina' | 'simulado',
    titulo: string,
    valorAtual: string,
    discIndex?: number,
    bimestre?: number,
    field?: 'numQuestoes' | 'acertos'
  ) => {
    setModal({
      isOpen: true,
      tipo,
      discIndex,
      bimestre,
      field,
      valor: valorAtual,
      titulo
    });
    setInputModal(valorAtual);
  };

  const fecharModal = () => {
    setModal({
      isOpen: false,
      tipo: null,
      valor: '',
      titulo: ''
    });
    setInputModal('');
  };

  const salvarModal = async () => {
    const cleanValue = handleInputChange(inputModal);

    if (modal.tipo === 'disciplina' && modal.discIndex !== undefined && modal.bimestre !== undefined && modal.field) {
      handleDisciplinaChange(modal.discIndex, modal.bimestre, modal.field, cleanValue);
    } else if (modal.tipo === 'simulado' && modal.bimestre !== undefined && modal.field) {
      handleSimuladoChange(modal.bimestre, modal.field, cleanValue);
    }

    // Salvar imediatamente no backend
    const ra = getRaAluno();
    if (ra) {
      try {
        const raNumber = parseInt(ra);

        if (modal.tipo === 'disciplina' && modal.discIndex !== undefined && modal.bimestre !== undefined && modal.field) {
          const disc = disciplinas[modal.discIndex];
          const numQuestoes = modal.field === 'numQuestoes' ? parseInt(cleanValue) || 0 : parseInt(disc.bimestres[modal.bimestre].numQuestoes) || 0;
          const acertos = modal.field === 'acertos' ? parseFloat(cleanValue) || 0 : parseFloat(disc.bimestres[modal.bimestre].acertos) || 0;

          if (numQuestoes > 0 || acertos > 0) {
            await avaliacaoService.create(raNumber, {
              tipo: 'APP',
              materia: disc.disciplina,
              numQuestoes: numQuestoes,
              numAcertos: acertos,
              periodo: String(modal.bimestre),
            });
          }
          showSuccess('Sucesso!', 'Resultado da disciplina salvo!');
        } else if (modal.tipo === 'simulado' && modal.bimestre !== undefined && modal.field) {
          const numQuestoes = modal.field === 'numQuestoes' ? parseInt(cleanValue) || 0 : parseInt(simulado.bimestres[modal.bimestre].numQuestoes) || 0;
          const acertos = modal.field === 'acertos' ? parseFloat(cleanValue) || 0 : parseFloat(simulado.bimestres[modal.bimestre].acertos) || 0;

          if (numQuestoes > 0 || acertos > 0) {
            await avaliacaoService.create(raNumber, {
              tipo: 'SIMULADO',
              materia: 'Simulado',
              numQuestoes: numQuestoes,
              numAcertos: acertos,
              periodo: String(modal.bimestre),
            });
          }
          showSuccess('Sucesso!', 'Resultado do simulado salvo!');
        }
      } catch (error) {
        console.error('Erro ao salvar:', error);
        showError('Erro', 'Erro ao salvar resultado');
      }
    }

    fecharModal();
  };

  const handleDisciplinaChange = (discIndex: number, bimestre: number, field: 'numQuestoes' | 'acertos', value: string) => {
    const cleanValue = handleInputChange(value);
    const newDisciplinas = [...disciplinas];
    newDisciplinas[discIndex].bimestres[bimestre][field] = cleanValue;
    setDisciplinas(newDisciplinas);
  };

  const handleSimuladoChange = (bimestre: number, field: 'numQuestoes' | 'acertos', value: string) => {
    const cleanValue = handleInputChange(value);
    setSimulado(prev => ({
      ...prev,
      bimestres: {
        ...prev.bimestres,
        [bimestre]: {
          ...prev.bimestres[bimestre],
          [field]: cleanValue
        }
      }
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b sticky top-0 z-10">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <h1 className="text-xl font-bold text-red-500">Resultados</h1>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Tabela Resultados APP */}
          <div>
            <h2 className="text-center text-sm font-semibold text-black mb-3">Resultados APP</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              {/* Grid sem colSpan */}
              <div className="grid grid-cols-[120px_repeat(8,1fr)] text-sm">
                {/* Header */}
                <div className="bg-gray-100 border border-gray-300 px-2 py-3 font-medium text-black sticky left-0 z-10">
                  Disciplinas
                </div>
                {BIMESTRES.map(b => (
                  <Fragment key={b}>
                    <div className="bg-gray-100 border border-gray-300 border-l-0 px-1 py-2 text-center font-medium text-black text-xs col-span-2">
                      {b}º Bim.
                    </div>
                  </Fragment>
                ))}
                
                {/* Sub-header */}
                <div className="bg-gray-50 border border-gray-300 border-t-0 sticky left-0 z-10"></div>
                {BIMESTRES.map(b => (
                  <Fragment key={`sub-${b}`}>
                    <div className="bg-gray-50 border border-gray-300 border-t-0 border-l-0 px-1 py-2 text-center text-xs text-black">
                      Questões
                    </div>
                    <div className="bg-gray-50 border border-gray-300 border-t-0 border-l-0 px-1 py-2 text-center text-xs text-black">
                      Acertos
                    </div>
                  </Fragment>
                ))}
                
                {/* Dados */}
                {disciplinas.map((disc, discIndex) => (
                  <Fragment key={disc.disciplina}>
                    <div className="border border-gray-300 border-t-0 px-2 py-3 font-medium text-black bg-white sticky left-0 z-10">
                      {disc.disciplina}
                    </div>
                    {BIMESTRES.map(b => (
                      <Fragment key={`${disc.disciplina}-${b}`}>
                        <div 
                          className="border border-gray-300 border-t-0 border-l-0 p-0 min-h-[44px] flex items-center justify-center cursor-pointer hover:bg-gray-50"
                          onClick={() => abrirModal('disciplina', `${disc.disciplina} - ${b}º Bim. (Questões)`, disc.bimestres[b].numQuestoes, discIndex, b, 'numQuestoes')}
                        >
                          <span className="text-sm text-black">{disc.bimestres[b].numQuestoes || '0'}</span>
                        </div>
                        <div 
                          className="border border-gray-300 border-t-0 border-l-0 p-0 min-h-[44px] flex items-center justify-center cursor-pointer hover:bg-gray-50"
                          onClick={() => abrirModal('disciplina', `${disc.disciplina} - ${b}º Bim. (Acertos)`, disc.bimestres[b].acertos, discIndex, b, 'acertos')}
                        >
                          <span className="text-sm text-black">{disc.bimestres[b].acertos || '0'}</span>
                        </div>
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Tabela Resultados Simulado */}
          <div>
            <h2 className="text-center text-sm font-semibold text-black mb-3">Resultados Simulado</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <div className="grid grid-cols-[140px_repeat(4,1fr)] text-sm">
                {/* Header */}
                <div className="bg-gray-100 border border-gray-300 px-3 py-3 sticky left-0 z-10"></div>
                {BIMESTRES.map(b => (
                  <div key={b} className="bg-gray-100 border border-gray-300 border-l-0 px-2 py-2 text-center font-medium text-black">
                    {b}º Bim.
                  </div>
                ))}
                
                {/* Nº Questões */}
                <div className="border border-gray-300 border-t-0 px-3 py-3 text-black bg-white sticky left-0 z-10">
                  Nº Questões
                </div>
                {BIMESTRES.map(b => (
                  <div 
                    key={`sim-q-${b}`}
                    className="border border-gray-300 border-t-0 border-l-0 p-0 min-h-[44px] flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={() => abrirModal('simulado', `Simulado - ${b}º Bim. (Questões)`, simulado.bimestres[b].numQuestoes, undefined, b, 'numQuestoes')}
                  >
                    <span className="text-sm text-black">{simulado.bimestres[b].numQuestoes || '0'}</span>
                  </div>
                ))}
                
                {/* Acertos */}
                <div className="border border-gray-300 border-t-0 px-3 py-3 text-black bg-white sticky left-0 z-10">
                  Acertos
                </div>
                {BIMESTRES.map(b => (
                  <div 
                    key={`sim-a-${b}`}
                    className="border border-gray-300 border-t-0 border-l-0 p-0 min-h-[44px] flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={() => abrirModal('simulado', `Simulado - ${b}º Bim. (Acertos)`, simulado.bimestres[b].acertos, undefined, b, 'acertos')}
                  >
                    <span className="text-sm text-black">{simulado.bimestres[b].acertos || '0'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Espaço para o conteúdo */}
          <div className="h-4"></div>
        </div>
      </div>

      {/* Modal de Notificação */}
      <NotificationModalComponent />

      {/* Modal de Edição */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            {/* Header do Modal */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">{modal.titulo}</h3>
            </div>
            
            {/* Conteúdo do Modal */}
            <div className="p-4">
              <label className="block text-sm font-medium text-black mb-2">
                Valor
              </label>
              <input
                type="number"
                min="0"
                autoFocus
                value={inputModal}
                onChange={(e) => setInputModal(e.target.value)}
                className="w-full px-4 py-3 text-center text-lg text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            {/* Botões do Modal */}
            <div className="px-4 py-3 border-t border-gray-200 flex gap-3">
              <button
                onClick={fecharModal}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarModal}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
