import { useState, useEffect } from 'react';
import { ChevronLeft, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Aluno } from '@/types';
import { leituraService, participacaoService } from '@/services/api';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

interface ParticipacaoData {
  clubeJuvenil: { semestre1: boolean; semestre2: boolean };
  eletiva: { semestre1: boolean; semestre2: boolean };
  liderTurma: { semestre1: 'sim' | 'nao'; semestre2: 'sim' | 'nao' };
  alunoGremista: { semestre1: 'sim' | 'nao'; semestre2: 'sim' | 'nao' };
  jovemAcolhedor: { semestre1: 'sim' | 'nao'; semestre2: 'sim' | 'nao' };
  leituras: { semestre1: boolean; semestre2: boolean };
  ocorrencias: { bim1: boolean; bim2: boolean; bim3: boolean; bim4: boolean };
}

export default function Participacao() {
  const navigate = useNavigate();
  const { showSuccess, NotificationModalComponent } = useNotificationModal();
  const [alunoSelecionado] = useState<Aluno | null>(() => {
    const stored = localStorage.getItem('alunoSelecionado');
    return stored ? JSON.parse(stored) : null;
  });

  const [participacao, setParticipacao] = useState<ParticipacaoData>({
    clubeJuvenil: { semestre1: false, semestre2: false },
    eletiva: { semestre1: false, semestre2: false },
    liderTurma: { semestre1: 'nao', semestre2: 'nao' },
    alunoGremista: { semestre1: 'nao', semestre2: 'nao' },
    jovemAcolhedor: { semestre1: 'nao', semestre2: 'nao' },
    leituras: { semestre1: false, semestre2: false },
    ocorrencias: { bim1: false, bim2: false, bim3: false, bim4: false },
  });

  const [leiturasAluno, setLeiturasAluno] = useState<{ primeiro: string; segundo: string; terceiro: string; quarto: string }>({
    primeiro: '',
    segundo: '',
    terceiro: '',
    quarto: '',
  });

  const [modalLeiturasAberto, setModalLeiturasAberto] = useState(false);

  useEffect(() => {
    if (alunoSelecionado) {
      carregarLeituras(alunoSelecionado.ra);
      carregarParticipacao(alunoSelecionado.ra);
    }
  }, [alunoSelecionado]);

  const carregarParticipacao = async (ra: number) => {
    try {
      const data = await participacaoService.get(ra);
      if (data) {
        // Converter dados do backend para o formato do estado
        setParticipacao({
          clubeJuvenil: {
            semestre1: data.clubeJuvenil1 === 'Sim',
            semestre2: data.clubeJuvenil2 === 'Sim',
          },
          eletiva: {
            semestre1: data.eletiva1 === 'Sim',
            semestre2: data.eletiva2 === 'Sim',
          },
          liderTurma: {
            semestre1: data.liderTurma1 ? 'sim' : 'nao',
            semestre2: data.liderTurma2 ? 'sim' : 'nao',
          },
          alunoGremista: {
            semestre1: data.alunoGremista1 ? 'sim' : 'nao',
            semestre2: data.alunoGremista2 ? 'sim' : 'nao',
          },
          jovemAcolhedor: {
            semestre1: data.jovemAcolhedor1 ? 'sim' : 'nao',
            semestre2: data.jovemAcolhedor2 ? 'sim' : 'nao',
          },
          leituras: { semestre1: false, semestre2: false },
          ocorrencias: { bim1: false, bim2: false, bim3: false, bim4: false },
        });
      }
    } catch (error) {
      console.log('Erro ao carregar participação:', error);
    }
  };

  const carregarLeituras = async (ra: number) => {
    try {
      const leiturasRes = await leituraService.getAll(ra);
      if (leiturasRes && Array.isArray(leiturasRes)) {
        const novasLeituras = { ...leiturasAluno };
        leiturasRes.forEach((leitura: { bimestre: number; livro: string }) => {
          const bimestreMap: { [key: number]: keyof typeof novasLeituras } = {
            1: 'primeiro',
            2: 'segundo',
            3: 'terceiro',
            4: 'quarto',
          };
          const key = bimestreMap[leitura.bimestre];
          if (key) {
            novasLeituras[key] = leitura.livro || '';
          }
        });
        setLeiturasAluno(novasLeituras);
        
        // Atualiza os checkboxes de participação baseado nas leituras
        setParticipacao(prev => ({
          ...prev,
          leituras: {
            semestre1: !!(novasLeituras.primeiro || novasLeituras.segundo),
            semestre2: !!(novasLeituras.terceiro || novasLeituras.quarto),
          },
        }));
      }
    } catch (error) {
      console.log('Erro ao carregar leituras:', error);
    }
  };

  const handleRadioChange = (
    campo: 'liderTurma' | 'alunoGremista' | 'jovemAcolhedor',
    semestre: 'semestre1' | 'semestre2',
    valor: 'sim' | 'nao'
  ) => {
    setParticipacao((prev) => ({
      ...prev,
      [campo]: {
        ...prev[campo],
        [semestre]: valor,
      },
    }));
  };

  const handleCheckboxChange = (
    campo: keyof ParticipacaoData,
    subcampo: string,
    valor: boolean
  ) => {
    setParticipacao((prev) => ({
      ...prev,
      [campo]: {
        ...prev[campo],
        [subcampo]: valor,
      },
    }));
  };

  const handleSalvar = async () => {
    if (!alunoSelecionado) {
      showSuccess('Erro!', 'Nenhum aluno selecionado.');
      return;
    }

    try {
      // Converter os dados do estado para o formato esperado pelo backend
      const participacaoData = {
        clubeJuvenil1: participacao.clubeJuvenil.semestre1 ? 'Sim' : '',
        eletiva1: participacao.eletiva.semestre1 ? 'Sim' : '',
        liderTurma1: participacao.liderTurma.semestre1 === 'sim',
        alunoGremista1: participacao.alunoGremista.semestre1 === 'sim',
        jovemAcolhedor1: participacao.jovemAcolhedor.semestre1 === 'sim',
        clubeJuvenil2: participacao.clubeJuvenil.semestre2 ? 'Sim' : '',
        eletiva2: participacao.eletiva.semestre2 ? 'Sim' : '',
        liderTurma2: participacao.liderTurma.semestre2 === 'sim',
        alunoGremista2: participacao.alunoGremista.semestre2 === 'sim',
        jovemAcolhedor2: participacao.jovemAcolhedor.semestre2 === 'sim',
      };

      // Chamar o serviço para salvar
      await participacaoService.update(alunoSelecionado.ra, participacaoData);
      
      showSuccess('Sucesso!', 'Participação salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar participação:', error);
      showSuccess('Erro!', 'Erro ao salvar participação.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between relative">
          <button
            onClick={() => navigate('/menu')}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex-1 text-center">
            {alunoSelecionado ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-red-500">{alunoSelecionado.nome}</h1>
                <p className="text-sm text-gray-500">RA: {alunoSelecionado.ra}</p>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-red-500">Participação</h1>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Participação */}
      <div className="flex-1 px-4 overflow-auto">
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-gray-700">Participação</th>
                <th className="text-center p-3 font-semibold text-gray-700">1º Semestre</th>
                <th className="text-center p-3 font-semibold text-gray-700">2º Semestre</th>
              </tr>
            </thead>
            <tbody>
              {/* Clube Juvenil */}
              <tr className="border-b">
                <td className="p-3 text-gray-700 font-medium">Clube Juvenil</td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={participacao.clubeJuvenil.semestre1}
                    onChange={(e) =>
                      handleCheckboxChange('clubeJuvenil', 'semestre1', e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={participacao.clubeJuvenil.semestre2}
                    onChange={(e) =>
                      handleCheckboxChange('clubeJuvenil', 'semestre2', e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                </td>
              </tr>

              {/* Eletiva */}
              <tr className="border-b">
                <td className="p-3 text-gray-700 font-medium">Eletiva</td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={participacao.eletiva.semestre1}
                    onChange={(e) =>
                      handleCheckboxChange('eletiva', 'semestre1', e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={participacao.eletiva.semestre2}
                    onChange={(e) =>
                      handleCheckboxChange('eletiva', 'semestre2', e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                </td>
              </tr>

              {/* Líder de Turma */}
              <tr className="border-b">
                <td className="p-3 text-gray-700 font-medium">Líder de Turma</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="lider-sem1"
                        checked={participacao.liderTurma.semestre1 === 'sim'}
                        onChange={() => handleRadioChange('liderTurma', 'semestre1', 'sim')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="lider-sem1"
                        checked={participacao.liderTurma.semestre1 === 'nao'}
                        onChange={() => handleRadioChange('liderTurma', 'semestre1', 'nao')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Não
                    </label>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="lider-sem2"
                        checked={participacao.liderTurma.semestre2 === 'sim'}
                        onChange={() => handleRadioChange('liderTurma', 'semestre2', 'sim')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="lider-sem2"
                        checked={participacao.liderTurma.semestre2 === 'nao'}
                        onChange={() => handleRadioChange('liderTurma', 'semestre2', 'nao')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Não
                    </label>
                  </div>
                </td>
              </tr>

              {/* Aluno Gremista */}
              <tr className="border-b">
                <td className="p-3 text-gray-700 font-medium">Aluno Gremista</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="gremista-sem1"
                        checked={participacao.alunoGremista.semestre1 === 'sim'}
                        onChange={() => handleRadioChange('alunoGremista', 'semestre1', 'sim')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="gremista-sem1"
                        checked={participacao.alunoGremista.semestre1 === 'nao'}
                        onChange={() => handleRadioChange('alunoGremista', 'semestre1', 'nao')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Não
                    </label>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="gremista-sem2"
                        checked={participacao.alunoGremista.semestre2 === 'sim'}
                        onChange={() => handleRadioChange('alunoGremista', 'semestre2', 'sim')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="gremista-sem2"
                        checked={participacao.alunoGremista.semestre2 === 'nao'}
                        onChange={() => handleRadioChange('alunoGremista', 'semestre2', 'nao')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Não
                    </label>
                  </div>
                </td>
              </tr>

              {/* Jovem Acolhedor */}
              <tr className="border-b">
                <td className="p-3 text-gray-700 font-medium">Jovem Acolhedor</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="acolhedor-sem1"
                        checked={participacao.jovemAcolhedor.semestre1 === 'sim'}
                        onChange={() => handleRadioChange('jovemAcolhedor', 'semestre1', 'sim')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="acolhedor-sem1"
                        checked={participacao.jovemAcolhedor.semestre1 === 'nao'}
                        onChange={() => handleRadioChange('jovemAcolhedor', 'semestre1', 'nao')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Não
                    </label>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="acolhedor-sem2"
                        checked={participacao.jovemAcolhedor.semestre2 === 'sim'}
                        onChange={() => handleRadioChange('jovemAcolhedor', 'semestre2', 'sim')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="radio"
                        name="acolhedor-sem2"
                        checked={participacao.jovemAcolhedor.semestre2 === 'nao'}
                        onChange={() => handleRadioChange('jovemAcolhedor', 'semestre2', 'nao')}
                        className="w-3 h-3 text-red-500 focus:ring-red-500"
                      />
                      Não
                    </label>
                  </div>
                </td>
              </tr>

              {/* Leituras Realizadas */}
              <tr className="border-b">
                <td className="p-3 text-gray-700 font-medium">Leituras Realizadas</td>
                <td className="p-3 text-center" colSpan={2}>
                  <button
                    onClick={() => setModalLeiturasAberto(true)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <BookOpen className="h-4 w-4" />
                    Visualizar
                  </button>
                </td>
              </tr>

              {/* Ocorrências */}
              <tr>
                <td className="p-3 text-gray-700 font-medium">Ocorrências</td>
                <td colSpan={2} className="p-3">
                  <div className="flex justify-center gap-3 flex-wrap">
                    <label className="flex items-center gap-1 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={participacao.ocorrencias.bim1}
                        onChange={(e) =>
                          handleCheckboxChange('ocorrencias', 'bim1', e.target.checked)
                        }
                        className="w-3 h-3 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      1º BIM
                    </label>
                    <label className="flex items-center gap-1 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={participacao.ocorrencias.bim2}
                        onChange={(e) =>
                          handleCheckboxChange('ocorrencias', 'bim2', e.target.checked)
                        }
                        className="w-3 h-3 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      2º BIM
                    </label>
                    <label className="flex items-center gap-1 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={participacao.ocorrencias.bim3}
                        onChange={(e) =>
                          handleCheckboxChange('ocorrencias', 'bim3', e.target.checked)
                        }
                        className="w-3 h-3 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      3º BIM
                    </label>
                    <label className="flex items-center gap-1 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={participacao.ocorrencias.bim4}
                        onChange={(e) =>
                          handleCheckboxChange('ocorrencias', 'bim4', e.target.checked)
                        }
                        className="w-3 h-3 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      4º BIM
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="px-6 py-6">
        <button
          onClick={handleSalvar}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg"
        >
          Salvar
        </button>
      </div>

      {/* Modal de Leituras */}
      {modalLeiturasAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-red-500" />
                Leituras Realizadas
              </h3>
              <button
                onClick={() => setModalLeiturasAberto(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Conteúdo do Modal */}
            <div className="p-4">
              {leiturasAluno.primeiro || leiturasAluno.segundo || leiturasAluno.terceiro || leiturasAluno.quarto ? (
                <div className="space-y-4">
                  {leiturasAluno.primeiro && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-red-500 mb-1">1º Bimestre</p>
                      <p className="text-gray-700 break-words">{leiturasAluno.primeiro}</p>
                    </div>
                  )}
                  {leiturasAluno.segundo && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-red-500 mb-1">2º Bimestre</p>
                      <p className="text-gray-700 break-words">{leiturasAluno.segundo}</p>
                    </div>
                  )}
                  {leiturasAluno.terceiro && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-red-500 mb-1">3º Bimestre</p>
                      <p className="text-gray-700 break-words">{leiturasAluno.terceiro}</p>
                    </div>
                  )}
                  {leiturasAluno.quarto && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-red-500 mb-1">4º Bimestre</p>
                      <p className="text-gray-700 break-words">{leiturasAluno.quarto}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhuma leitura cadastrada</p>
                </div>
              )}
            </div>
            
            {/* Botão Fechar */}
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setModalLeiturasAberto(false)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
