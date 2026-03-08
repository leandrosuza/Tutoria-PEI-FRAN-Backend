import { BookOpen, Users, Award, ClipboardCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Acompanhamento() {
  const navigate = useNavigate();

  const modulos = [
    {
      title: 'Participacao',
      description: 'Eletivas, clubes, grene',
      icon: Users,
      color: 'bg-green-500',
      link: '/participacao',
    },
    {
      title: 'Avaliacoes',
      description: 'Notas e desempenho',
      icon: Award,
      color: 'bg-blue-500',
      link: '/avaliacoes',
    },
    {
      title: 'Leituras',
      description: 'Controle de leitura',
      icon: BookOpen,
      color: 'bg-purple-500',
      link: '/leituras',
    },
    {
      title: 'Tutoria',
      description: 'Acompanhamento',
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      link: '/tutoria',
    },
  ];

  const bimestres = [
    { nome: '1 Bimestre', status: 'encerrado', ativo: false },
    { nome: '2 Bimestre', status: 'encerrado', ativo: false },
    { nome: '3 Bimestre', status: 'atual', ativo: true },
    { nome: '4 Bimestre', status: 'futuro', ativo: false },
  ];

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
          <h1 className="text-xl font-bold text-white">Acompanhamento</h1>
          <p className="text-sm text-gray-400">Visao geral do desempenho</p>
        </div>
      </div>

      {/* Cards Modulos */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {modulos.map((modulo) => (
          <Link
            key={modulo.title}
            to={modulo.link}
            className="bg-[#1a1f2e] p-4 rounded-2xl hover:bg-[#242a3d] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${modulo.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <modulo.icon className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="font-semibold text-white">{modulo.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{modulo.description}</p>
          </Link>
        ))}
      </div>

      {/* Bimestres */}
      <div className="bg-[#1a1f2e] rounded-2xl p-4 mb-6">
        <h3 className="font-semibold text-white mb-4">Resumo por Bimestre</h3>
        <div className="grid grid-cols-2 gap-3">
          {bimestres.map((b) => (
            <div 
              key={b.nome}
              className={`p-3 rounded-xl border-2 ${
                b.ativo 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 bg-[#0a0e1a]'
              }`}
            >
              <p className={`font-medium ${b.ativo ? 'text-blue-400' : 'text-gray-400'}`}>
                {b.nome}
              </p>
              <p className="text-xs text-gray-600 capitalize">{b.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dica */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-blue-500/20">
        <h3 className="font-semibold text-blue-400 mb-2">Dica do Sistema</h3>
        <p className="text-sm text-gray-400">
          Mantenha o acompanhamento atualizado para gerar relatorios completos ao final de cada bimestre.
        </p>
      </div>
    </div>
  );
}
