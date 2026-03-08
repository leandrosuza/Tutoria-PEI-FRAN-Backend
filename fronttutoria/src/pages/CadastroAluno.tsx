import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, User, Calendar, MapPin, Phone, Mail, Bus, GraduationCap, Heart, Users, Camera } from 'lucide-react';
import { alunoService } from '@/services/api';
import type { Aluno } from '@/types';
import { isAdmin } from '@/utils/auth';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

// Componente InputField movido para fora do componente principal para evitar re-render
interface InputFieldProps {
  label: string;
  type?: string;
  icon: React.ElementType;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const InputField = ({ label, type = 'text', icon: Icon, placeholder = '', value, onChange, readOnly = false }: InputFieldProps) => (
  <div className="py-4 border-b border-gray-100">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full text-gray-800 placeholder-gray-400 focus:outline-none ${readOnly ? 'bg-gray-50' : ''}`}
        />
      </div>
    </div>
  </div>
);

export default function CadastroAluno() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ra = searchParams.get('ra');
  const isEdit = searchParams.get('edit') === 'true';
  const { showSuccess, showError, NotificationModalComponent } = useNotificationModal();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(isEdit);

  const [formData, setFormData] = useState({
    // Dados do Aluno
    ra: '',
    nome: '',
    dataNasc: '',
    idade: '',
    serie: '',
    endereco: '',
    telefone: '',
    email: '',
    transporte: '',
    projetoVida: '',
    imgUrl: '',
    // Dados Familiares
    pai: '',
    mae: '',
    responsavel: '',
    estruturaFamiliar: '',
    numPai: '',
    numMae: '',
    numResponsavel: '',
  });

  // Carregar dados do aluno se for edição
  useEffect(() => {
    if (isEdit && ra) {
      loadAluno(ra);
    }
  }, [isEdit, ra]);

  const loadAluno = async (ra: string) => {
    try {
      const aluno = await alunoService.getByRa(Number(ra));
      setFormData({
        ra: aluno.ra.toString(),
        nome: aluno.nome || '',
        dataNasc: aluno.dataNasc || '',
        idade: aluno.idade?.toString() || '',
        serie: aluno.serie || '',
        endereco: aluno.endereco || '',
        telefone: aluno.telefone?.toString() || '',
        email: aluno.email || '',
        transporte: aluno.transporte || '',
        projetoVida: aluno.projetoVida || '',
        imgUrl: aluno.imgUrl || '',
        pai: aluno.dadoFamilia?.pai || '',
        mae: aluno.dadoFamilia?.mae || '',
        responsavel: aluno.dadoFamilia?.responsavel || '',
        estruturaFamiliar: aluno.dadoFamilia?.estruturaFamiliar || '',
        numPai: aluno.dadoFamilia?.numPai?.toString() || '',
        numMae: aluno.dadoFamilia?.numMae?.toString() || '',
        numResponsavel: aluno.dadoFamilia?.numResponsavel?.toString() || '',
      });
    } catch (err) {
      console.error('Erro ao carregar aluno:', err);
      setError('Erro ao carregar dados do aluno');
    } finally {
      setLoadingData(false);
    }
  };

  // Usando useCallback para evitar recriação da função a cada render
  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const calcularIdade = (dataNasc: string) => {
    if (!dataNasc) return '';
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade.toString();
  };

  const handleDataNascChange = useCallback((value: string) => {
    const idade = calcularIdade(value);
    setFormData(prev => ({ ...prev, dataNasc: value, idade }));
  }, []);

  const validateForm = () => {
    if (!formData.ra.trim()) return 'RA é obrigatório';
    if (!formData.nome.trim()) return 'Nome é obrigatório';
    if (!formData.dataNasc) return 'Data de nascimento é obrigatória';
    if (!formData.serie.trim()) return 'Série é obrigatória';
    if (!formData.endereco.trim()) return 'Endereço é obrigatório';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const professorSelecionado = localStorage.getItem('professorSelecionado');
      
      // Se admin selecionou um professor, usar ID do professor, senão usar ID do usuário logado
      let usuarioId = usuario.id;
      if (professorSelecionado && isAdmin(usuario)) {
        const professor = JSON.parse(professorSelecionado);
        usuarioId = professor.id;
      }
      
      // Garantir que todos os campos obrigatórios estão preenchidos
      const alunoData = {
        ra: Number(formData.ra),
        nome: formData.nome.trim(),
        dataNasc: formData.dataNasc,
        idade: Number(formData.idade) || 0,
        serie: formData.serie.trim(),
        endereco: formData.endereco.trim(),
        telefone: formData.telefone ? Number(formData.telefone) : null,
        email: formData.email.trim() || 'nao_informado@escola.com',
        transporte: formData.transporte.trim() || 'Não informado',
        projetoVida: formData.projetoVida.trim() || 'Não informado',
        imgUrl: formData.imgUrl || null,
        usuarioId: usuarioId,
        // Dados familiares - campos conforme DadosFamiliaDTO
        dadoFamilia: {
          pai: formData.pai.trim() || 'Não informado',
          mae: formData.mae.trim() || 'Não informado',
          responsavel: formData.responsavel.trim() || 'Não informado',
          estruturaFamiliar: formData.estruturaFamiliar.trim() || 'Nuclear',
          numPai: formData.numPai ? Number(formData.numPai) : null,
          numMae: formData.numMae ? Number(formData.numMae) : null,
          numResponsavel: formData.numResponsavel ? Number(formData.numResponsavel) : null,
        },
        escolaridade: {
          contatoFora: false,
          difAprendizagem: false,
          apoioPedagogico: false,
          disciplinasFacilidade: [],
          disciplinasDificuldade: [],
          atividadeExtra: false,
          difLocomotiva: false,
          difVisao: false,
          difAtencao: false,
          difFala: false,
          difEscrita: false,
          adaptacaoGrupo: false,
          reprovado: false,
          serieAnoReprovado: '',
        }
      };

      console.log('Enviando para API:', JSON.stringify(alunoData, null, 2));
      console.log('Usuario ID:', usuario.id);
      if (isEdit && ra) {
        await alunoService.update(Number(formData.ra), alunoData as Aluno);
      } else {
        await alunoService.create(alunoData as Aluno);
      }
      showSuccess('Sucesso!', isEdit ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
      
      if (isEdit) {
        // Se admin estava visualizando alunos de um professor, volta para tela de alunos
        // Senão, volta para o menu (fluxo normal do professor)
        const professorSelecionado = localStorage.getItem('professorSelecionado');
        const redirectPath = professorSelecionado ? '/alunos' : '/menu';
        setTimeout(() => navigate(redirectPath), 1500);
      } else {
        // Limpar formulário após cadastro
        setFormData({
          ra: '',
          nome: '',
          dataNasc: '',
          idade: '',
          serie: '',
          endereco: '',
          telefone: '',
          email: '',
          transporte: '',
          projetoVida: '',
          imgUrl: '',
          pai: '',
          mae: '',
          responsavel: '',
          estruturaFamiliar: '',
          numPai: '',
          numMae: '',
          numResponsavel: '',
        });
      }
    } catch (err: any) {
      console.error('Erro:', err);
      if (err.response?.status === 422) {
        showError('Erro', 'Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos corretamente.');
      } else if (err.response?.status === 409) {
        showError('Erro', 'Já existe um aluno com este RA.');
      } else {
        showError('Erro', isEdit ? 'Erro ao atualizar aluno. Tente novamente.' : 'Erro ao cadastrar aluno. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(isEdit ? '/menu' : '/alunos')}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-xl font-bold text-red-500">{isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'}</h1>
        </div>
      </div>

      {/* Loading */}
      {loadingData && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      )}

      {/* Form */}
      {!loadingData && (
      <form onSubmit={handleSubmit} className="flex-1 px-6 pb-8">
        {/* Foto */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
            <Camera className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        {/* Dados do Aluno */}
        <div className="mb-6">
          <h2 className="text-red-500 font-semibold mb-2">Dados do Aluno</h2>
          
          <InputField
            label="RA (Matrícula) *"
            type="number"
            icon={GraduationCap}
            placeholder="Digite o RA"
            value={formData.ra}
            onChange={(v) => handleChange('ra', v)}
          />

          <InputField
            label="Nome *"
            icon={User}
            placeholder="Nome completo do aluno"
            value={formData.nome}
            onChange={(v) => handleChange('nome', v)}
          />

          <InputField
            label="Data de Nascimento *"
            type="date"
            icon={Calendar}
            value={formData.dataNasc}
            onChange={handleDataNascChange}
          />

          <InputField
            label="Idade"
            type="number"
            icon={User}
            placeholder="Calculada automaticamente"
            value={formData.idade}
            onChange={() => {}}
            readOnly
          />

          <InputField
            label="Série *"
            icon={GraduationCap}
            placeholder="Ex: 9º ano"
            value={formData.serie}
            onChange={(v) => handleChange('serie', v)}
          />

          <InputField
            label="Endereço *"
            icon={MapPin}
            placeholder="Endereço completo"
            value={formData.endereco}
            onChange={(v) => handleChange('endereco', v)}
          />

          <InputField
            label="Telefone"
            type="tel"
            icon={Phone}
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(v) => handleChange('telefone', v.replace(/\D/g, ''))}
          />

          <InputField
            label="Email"
            type="email"
            icon={Mail}
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={(v) => handleChange('email', v)}
          />

          <InputField
            label="Transporte"
            icon={Bus}
            placeholder="Meio de transporte"
            value={formData.transporte}
            onChange={(v) => handleChange('transporte', v)}
          />

          <div className="py-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Projeto de Vida
                </label>
                <textarea
                  value={formData.projetoVida}
                  onChange={(e) => handleChange('projetoVida', e.target.value)}
                  placeholder="Descreva o projeto de vida do aluno"
                  rows={3}
                  className="w-full text-gray-800 placeholder-gray-300 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dados Familiares */}
        <div className="mb-8">
          <InputField
            label="Pai"
            icon={Users}
            placeholder="Nome do pai"
            value={formData.pai}
            onChange={(v) => handleChange('pai', v)}
          />

          <InputField
            label="Telefone Pai"
            type="tel"
            icon={Phone}
            placeholder="(00) 00000-0000"
            value={formData.numPai}
            onChange={(v) => handleChange('numPai', v.replace(/\D/g, ''))}
          />

          <InputField
            label="Mãe"
            icon={Users}
            placeholder="Nome da mãe"
            value={formData.mae}
            onChange={(v) => handleChange('mae', v)}
          />

          <InputField
            label="Telefone Mãe"
            type="tel"
            icon={Phone}
            placeholder="(00) 00000-0000"
            value={formData.numMae}
            onChange={(v) => handleChange('numMae', v.replace(/\D/g, ''))}
          />

          <InputField
            label="Responsável"
            icon={User}
            placeholder="Nome do responsável (se diferente)"
            value={formData.responsavel}
            onChange={(v) => handleChange('responsavel', v)}
          />

          <InputField
            label="Telefone Responsável"
            type="tel"
            icon={Phone}
            placeholder="(00) 00000-0000"
            value={formData.numResponsavel}
            onChange={(v) => handleChange('numResponsavel', v.replace(/\D/g, ''))}
          />

          <InputField
            label="Estrutura Familiar"
            icon={Users}
            placeholder="Ex: Nuclear, Extensa, etc"
            value={formData.estruturaFamiliar}
            onChange={(v) => handleChange('estruturaFamiliar', v)}
          />
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Botão Salvar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-2xl transition-colors shadow-lg"
        >
          {loading ? (isEdit ? 'Atualizando...' : 'Salvando...') : (isEdit ? 'Atualizar' : 'Salvar')}
        </button>
      </form>
      )}

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
