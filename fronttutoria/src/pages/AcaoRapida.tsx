import { useNavigate } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  ClipboardList, 
  Award,
  X,
  ArrowLeft
} from 'lucide-react';

export default function AcaoRapida() {
  const navigate = useNavigate();

  const acoes = [
    {
      title: 'Novo Aluno',
      icon: GraduationCap,
      color: 'bg-blue-500',
      path: '/alunos',
      desc: 'Cadastrar aluno'
    },
    {
      title: 'Nova Avaliação',
      icon: Award,
      color: 'bg-green-500',
      path: '/avaliacoes',
      desc: 'Lançar nota'
    },
    {
      title: 'Nova Leitura',
      icon: BookOpen,
      color: 'bg-purple-500',
      path: '/leituras',
      desc: 'Registrar livro'
    },
    {
      title: 'Tutoria',
      icon: ClipboardList,
      color: 'bg-orange-500',
      path: '/tutoria',
      desc: 'Acompanhamento'
    },
    {
      title: 'Participação',
      icon: User,
      color: 'bg-pink-500',
      path: '/participacao',
      desc: 'Atividades'
    },
    {
      title: 'Ocorrência',
      icon: X,
      color: 'bg-red-500',
      path: '/ocorrencias',
      desc: 'Disciplinar'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1525] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <h1 className="text-xl font-bold text-white">Ações Rápidas</h1>
      </div>

      {/* Grid de ações */}
      <div className="grid grid-cols-2 gap-4">
        {acoes.map((acao) => (
          <button
            key={acao.title}
            onClick={() => navigate(acao.path)}
            className="bg-[#1e2540] p-5 rounded-2xl text-left hover:bg-[#252b48] transition-colors"
          >
            <div className={`${acao.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
              <acao.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white">{acao.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{acao.desc}</p>
          </button>
        ))}
      </div>

      {/* Botão fechar */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center md:hidden">
        <button
          onClick={() => navigate('/')}
          className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center shadow-lg"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}
