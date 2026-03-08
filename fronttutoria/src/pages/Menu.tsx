import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  CheckSquare, 
  Users, 
  CalendarDays, 
  Folder,
  LogOut,
  User,
  ChevronLeft
} from 'lucide-react';
import type { Usuario, Aluno } from '@/types';
import { isAdmin } from '@/utils/auth';

export default function Menu() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [professorSelecionado, setProfessorSelecionado] = useState<Usuario | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      setUsuario(JSON.parse(stored));
    }
    const alunoStored = localStorage.getItem('alunoSelecionado');
    if (alunoStored) {
      setAlunoSelecionado(JSON.parse(alunoStored));
    }
    const professorStored = localStorage.getItem('professorSelecionado');
    if (professorStored) {
      setProfessorSelecionado(JSON.parse(professorStored));
    }
  }, []);

  const handleVoltarAlunos = () => {
    localStorage.removeItem('alunoSelecionado');
    navigate('/alunos');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('alunoSelecionado');
    localStorage.removeItem('professorSelecionado');
    navigate('/login');
  };

  const menuItems = [
    { 
      id: 'informacoes', 
      label: 'Informações Adicionais', 
      icon: Plus,
      onClick: () => navigate('/informacoes')
    },
    { 
      id: 'resultados', 
      label: 'Resultado das provas e simulados', 
      icon: CheckSquare,
      onClick: () => navigate('/resultados')
    },
    { 
      id: 'participacao', 
      label: 'Participação do aluno', 
      icon: Users,
      onClick: () => navigate('/participacao-aluno')
    },
    { 
      id: 'atendimentos', 
      label: 'Atendimentos realizados', 
      icon: CalendarDays,
      onClick: () => navigate('/atendimentos')
    },
    { 
      id: 'dados-aluno', 
      label: 'Dados do Aluno', 
      icon: Folder,
      onClick: () => {
        const alunoStored = localStorage.getItem('alunoSelecionado');
        if (alunoStored) {
          const aluno = JSON.parse(alunoStored);
          navigate(`/cadastro-aluno?ra=${aluno.ra}&edit=true`);
        } else {
          navigate('/alunos');
        }
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between relative">
          {/* Botão Voltar - sempre visível para professor/voltar para alunos */}
          <button
            onClick={handleVoltarAlunos}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
            title="Voltar para lista de alunos"
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
                {professorSelecionado && isAdmin(usuario) && (
                  <p className="text-xs text-red-400 bg-red-50 px-2 py-1 rounded-full">
                    Professor: {professorSelecionado.nome}
                  </p>
                )}
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-red-500">Tutoria PEI-FRAN</h1>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors absolute right-0 top-2"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-6">
        <div className="grid grid-cols-2 gap-4 content-start">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`bg-[#4a5570] rounded-[24px] pt-8 pb-5 px-4 flex flex-col items-center justify-between hover:bg-[#5a6578] transition-colors ${
                index === 4 ? 'col-start-1' : ''
              }`}
              style={{ minHeight: '160px', maxHeight: '180px' }}
            >
              <div className="flex-1 flex items-center justify-center w-full">
                <item.icon className="h-12 w-12 text-white" strokeWidth={1} />
              </div>
              <span className="text-white text-[11px] font-normal text-center leading-snug px-2 mt-4">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        <button
          onClick={() => navigate('/tutoria')}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg"
        >
          Realizar Tutoria
        </button>
      </div>
    </div>
  );
}
