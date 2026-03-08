package com.br.tutoria.pei.fran.service;

import com.br.tutoria.pei.fran.dtos.*;
import com.br.tutoria.pei.fran.entities.*;
import com.br.tutoria.pei.fran.repository.*;
import com.br.tutoria.pei.fran.service.exceptions.DatabaseException;
import com.br.tutoria.pei.fran.service.exceptions.EntityAlreadyExistingException;
import com.br.tutoria.pei.fran.service.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository repository;
    private final DadosFamiliaRepository dadosFamiliarepository;
    private final EscolaridadeRepository escolaridadeRepository;
    private final ParticipacaoRepository participacaoRepository;
    private final OcorrenciaRepository ocorrenciaRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final LeituraRepository leituraRepository;
    private final RegistroAtendimentoRepository registroAtendimentoRepository;
    private final TutoriaRepository tutoriaRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public AlunoService(
            AlunoRepository repository,
            DadosFamiliaRepository dadosFamiliarepository,
            EscolaridadeRepository escolaridadeRepository,
            ParticipacaoRepository participacaoRepository,
            OcorrenciaRepository ocorrenciaRepository,
            AvaliacaoRepository avaliacaoRepository,
            LeituraRepository leituraRepository,
            RegistroAtendimentoRepository registroAtendimentoRepository,
            TutoriaRepository tutoriaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.repository = repository;
        this.dadosFamiliarepository = dadosFamiliarepository;
        this.escolaridadeRepository = escolaridadeRepository;
        this.participacaoRepository = participacaoRepository;
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.leituraRepository = leituraRepository;
        this.registroAtendimentoRepository = registroAtendimentoRepository;
        this.tutoriaRepository = tutoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public AlunoDTO insert(AlunoDTO dto) {
        if (repository.existsById(dto.getRa())) {
            throw new EntityAlreadyExistingException("Entidade já criada!");
        }
        DadosFamilia familia = dadosFamiliarepository.findPaiOrMaeOrResponsavel(dto.getDadoFamilia().getPai(),
        dto.getDadoFamilia().getMae(), dto.getDadoFamilia().getResponsavel()).orElseGet(DadosFamilia::new);
        Escolaridade escolaridade = new Escolaridade();

        setDadosFamilia(familia, dto);
        setEscolaridade(escolaridade, dto);

        Aluno aluno = new Aluno();
        aluno.setRa(dto.getRa());
        dtoToEntity(dto, aluno);
        
        // Buscar e setar o usuário
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + dto.getUsuarioId()));
        aluno.setUsuario(usuario);
        
        familia.addAlunos(aluno);
        escolaridade.setAluno(aluno);
        aluno.setDadoFamilia(familia);
        aluno.setEscolaridade(escolaridade);
        aluno.setParticipacao(new Participacao());
        aluno.setOcorrencias(new Ocorrencia());

        aluno = repository.save(aluno);
        return new AlunoDTO(aluno);
    }
    @Transactional
    public AlunoDTO insertMin(AlunoMinDTO dto) {
        if (repository.existsById(dto.getRa())) {
            throw new EntityAlreadyExistingException("Aluno já existente!");
        }

        Aluno aluno = new Aluno();
        aluno.setRa(dto.getRa());
        aluno.setNome(dto.getNome());

        aluno.setEmail("nao_informado@escola.com");
        aluno.setDataNasc(null);
        aluno.setIdade(0);
        aluno.setTelefone(0L);
        aluno.setTransporte("Não informado");
        aluno.setProjetoVida("Não informado");
        aluno.setSerie("Não informada");
        aluno.setEndereco("Não informado");
        aluno.setImgUrl(null);
        aluno.setDadoFamilia(null);
        aluno.setEscolaridade(null);
        aluno.setParticipacao(null);
        aluno.setOcorrencias(null);
        aluno = repository.save(aluno);
        AlunoDTO alunoDTO = new AlunoDTO();
        alunoDTO = new AlunoDTO(aluno);
        return alunoDTO;
    }

    @Transactional
    public AlunoDTO update(Long ra, AlunoDTO dto) {
        Aluno aluno = repository.findById(ra)
            .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com RA: " + ra));

        dtoToEntity(dto, aluno);
        aluno = repository.save(aluno);
        return new AlunoDTO(aluno);
    }

    @Transactional(readOnly = true)
    public List<AlunoMinDTO> getAllNames() {
        return repository.getAllNames();
    }


    @Transactional(readOnly = true)
    public AlunoDTO getAlunosByRa(Long ra) {
        Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));
        return new AlunoDTO(aluno);
    }

    @Transactional
    public void delete(Long ra) {
        Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));
        repository.delete(aluno);
    }

    @Transactional
    public ParticipacaoDTO addParticipacao(Long ra, ParticipacaoDTO dto) {
        Aluno aluno = repository.getReferenceById(ra);

        Participacao participacao;

        if (dto.getId() != null) {
            participacao = participacaoRepository.findById(dto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Participação não encontrada: id = " + dto.getId()));
        }
        else {
            participacao = new Participacao();
        }

        dtoToParticipacao(participacao, dto);

        participacao = participacaoRepository.save(participacao);

        participacao.setAluno(aluno);
        aluno.setParticipacao(participacao);

        aluno = repository.save(aluno);

        return new ParticipacaoDTO(aluno.getParticipacao());
    }

    @Transactional(readOnly = true)
    public ParticipacaoDTO getParticipacao(Long ra) {
       Participacao participacao = participacaoRepository.getParticipacaoByAlunoRa(ra);

        return new ParticipacaoDTO(participacao);
    }

    @Transactional
    public AvaliacaoDTO addAvaliacao(Long ra, AvaliacaoDTO avaliacaoDTO) {
        Optional<Avaliacao> existente = avaliacaoRepository.findByAlunoRaAndPeriodoAndTipoAndMateriaAndNumQuestoesAndNumAcertos(
                        ra,
                        avaliacaoDTO.getPeriodo(),
                        avaliacaoDTO.getTipo(),
                        avaliacaoDTO.getMateria(),
                        avaliacaoDTO.getNumQuestoes(),
                        avaliacaoDTO.getNumAcertos()
                );

        if (existente.isPresent()) {
            return new AvaliacaoDTO(existente.get());
        }

        Aluno aluno = repository.getReferenceById(ra);
        Avaliacao avaliacao = new Avaliacao();
        dtoToAvaliacao(avaliacao, avaliacaoDTO);
        avaliacao.setAluno(aluno);
        aluno.addAvaliacao(avaliacao);

        aluno = repository.save(aluno);

        return new AvaliacaoDTO(avaliacao);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoDTO> getAllAvaliacoes(Long ra) {
        Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

        return aluno.getAvaliacoes().stream().map(AvaliacaoDTO::new).toList();
    }

    @Transactional
    public OcorrenciaDTO addOcorrencia(Long ra, OcorrenciaDTO dto) {

        Aluno aluno = repository.findById(ra)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Ocorrencia ocorrencia = aluno.getOcorrencias();

        if (ocorrencia == null) {
            ocorrencia = new Ocorrencia();
            ocorrencia.setAluno(aluno);
        }

        dtoToOcorrencia(ocorrencia, dto);

        ocorrenciaRepository.save(ocorrencia);
        aluno.setOcorrencias(ocorrencia);

        return new OcorrenciaDTO(ocorrencia);
    }

    @Transactional(readOnly = true)
    public OcorrenciaDTO getOcorrencia(Long ra) {
        try {
            Ocorrencia ocorrencia = ocorrenciaRepository.getOcorrenciaByAlunoRa(ra);
            
            if (ocorrencia == null) {
                return new OcorrenciaDTO(null, 0, 0, 0, 0);
            }
            
            return new OcorrenciaDTO(ocorrencia);
        } catch (Exception e) {
            // Retorna DTO vazio se houver qualquer erro (ex: aluno não tem ocorrências)
            return new OcorrenciaDTO(null, 0, 0, 0, 0);
        }
    }

    @Transactional
    public LeituraDTO addLeitura(Long ra, LeituraDTO dto) {

        Aluno aluno = repository.getReferenceById(ra);

        Optional<Leitura> existente =
                leituraRepository.findByAlunoRaAndBimestreAndLivro(
                        ra,
                        dto.getBimestre(),
                        dto.getLivro()
                );

        Leitura leitura;

        if (existente.isPresent()) {
            leitura = existente.get();
        } else {
            leitura = new Leitura();
            leitura.setBimestre(dto.getBimestre());
            leitura.setLivro(dto.getLivro());
            leitura.setAluno(aluno);

            aluno.addLeitura(leitura);
        }

        return new LeituraDTO(leitura);
    }

    @Transactional(readOnly = true)
    public List<LeituraDTO> getAllLeituras(Long ra) {
        Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

        return aluno.getLeituras().stream().map(LeituraDTO::new).toList();
    }

    @Transactional
    public LeituraDTO updateLeitura(Long ra, Long idLeitura, LeituraDTO dto) {
        Leitura leitura = leituraRepository.findById(idLeitura)
                .orElseThrow(() -> new ResourceNotFoundException("Leitura não encontrada: " + idLeitura));
        
        // Verifica se a leitura pertence ao aluno (lazy load da associação)
        if (!leitura.getAluno().getRa().equals(ra)) {
            throw new ResourceNotFoundException("Leitura não pertence a este aluno");
        }

        dtoToLeitura(leitura, dto);
        leitura = leituraRepository.save(leitura);
        return new LeituraDTO(leitura);
    }

    @Transactional
    public RegistroAtendimentoDTO addRegistroAtendimento (Long ra, RegistroAtendimentoDTO dto) {
        Aluno aluno = repository.getReferenceById(ra);

        Optional<RegistroAtendimento> existente =
                registroAtendimentoRepository.findByAlunoRaAndDataAndAssuntoAndObservacoesProfessor(
                        ra,
                        dto.getData(),
                        dto.getAssunto(),
                        dto.getObservacoesProfessor()
                );
        RegistroAtendimento atendimento;

        if (existente.isPresent()) {
            atendimento = existente.get();
            dtoToRegistro(atendimento, dto);
        } else {
            atendimento = new RegistroAtendimento();
            dtoToRegistro(atendimento, dto);

            atendimento.setAluno(aluno);
            aluno.addRegistroAtendimento(atendimento);
        }
        return new RegistroAtendimentoDTO(atendimento);
    }

    @Transactional
    public RegistroAtendimentoDTO updateResgistroAtendimento(Long ra,Long idAtendimento, RegistroAtendimentoDTO dto) {
        try {
            Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));
            RegistroAtendimento atendimento = registroAtendimentoRepository.findById(idAtendimento)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de atendimento não encontrado"));

            dtoToRegistro(atendimento, dto);

            atendimento = registroAtendimentoRepository.save(atendimento);
            return new RegistroAtendimentoDTO(atendimento);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<RegistroAtendimentoDTO> getAllRegistroAtendimentos(Long ra) {
        Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

        return aluno.getRegistroAtendimentos().stream().map(RegistroAtendimentoDTO::new).toList();
    }

    @Transactional
    public void deleteRegistroAtendimento(Long ra, Long idAtendimento) {
        Aluno aluno = repository.findById(ra)
            .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));
        RegistroAtendimento atendimento = registroAtendimentoRepository.findById(idAtendimento)
            .orElseThrow(() -> new ResourceNotFoundException("Registro de atendimento não encontrado"));
        
        // Verifica se o atendimento pertence ao aluno
        if (!atendimento.getAluno().getRa().equals(ra)) {
            throw new ResourceNotFoundException("Registro de atendimento não pertence a este aluno");
        }
        
        aluno.getRegistroAtendimentos().remove(atendimento);
        registroAtendimentoRepository.delete(atendimento);
    }

    @Transactional
    public TutoriaDTO addTutoria(Long ra, TutoriaDTO dto){
        Aluno aluno = repository.getReferenceById(ra);

        Optional<Tutoria> existe =
                tutoriaRepository.findByIdAndDataAndTarefaCMSPAndRedacaoAndLeituraAndProvaPaulistaAndAvaliacoesAndDificuldadesAndOutrosAndObservacoesProfessor(
                        ra,
                        dto.getData(),
                        dto.getTarefaCMSP(),
                        dto.getRedacao(),
                        dto.getLeitura(),
                        dto.getProvaPaulista(),
                        dto.getAvaliacoes(),
                        dto.getDificuldades(),
                        dto.getOutros(),
                        dto.getObservacoesProfessor()
                );
        Tutoria tutoria;

        if (existe.isPresent()) {
            tutoria = existe.get();
            dtoToTutoria(tutoria, dto);
        } else {
            tutoria = new Tutoria();
            dtoToTutoria(tutoria, dto);

            tutoria.setAluno(aluno);
            aluno.addTutoria(tutoria);
        }
        return new TutoriaDTO(tutoria);
    }

    @Transactional(readOnly = true)
    public List<TutoriaDTO> getAllTutorias(Long ra) {
        Aluno aluno = repository.getReferenceById(ra);
        return aluno.getTutorias().stream().map(TutoriaDTO::new).toList();
    }

    @Transactional
    public TutoriaDTO updateTutoria(Long ra, Long id, TutoriaDTO dto) {
        Aluno aluno = repository.getReferenceById(ra);
        Tutoria tutoria = tutoriaRepository.getReferenceById(id);

        dtoToTutoria(tutoria, dto);

        tutoria = tutoriaRepository.save(tutoria);
        return new TutoriaDTO(tutoria);
    }

    @Transactional
    public DadosFamiliaDTO addDadosFamilia(Long ra, DadosFamiliaDTO dto) {
        Aluno aluno = repository.getReferenceById(ra);
        DadosFamilia dadosFamilia = new DadosFamilia();

        dtoToDadosFamilia(dadosFamilia, dto);
        dadosFamilia.addAlunos(aluno);
        aluno.setDadoFamilia(dadosFamilia);

        return new DadosFamiliaDTO(dadosFamilia);
    }

    @Transactional(readOnly = true)
    public DadosFamiliaDTO getAllDadosFamilia(Long ra) {
        Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

        return new DadosFamiliaDTO(aluno.getDadoFamilia());
    }

    @Transactional
    public EscolaridadeDTO addEscolaridade(Long ra, EscolaridadeDTO dto) {
        Aluno aluno = repository.getReferenceById(ra);
        Escolaridade escolaridade = new Escolaridade();

        dtoToEscolaridade(escolaridade, dto);
        escolaridade.setAluno(aluno);
        aluno.setEscolaridade(escolaridade);

        return new EscolaridadeDTO(escolaridade);
    }

    @Transactional(readOnly = true)
    public EscolaridadeDTO getAllEscolaridade(Long ra) {
        Aluno aluno = repository.findById(ra).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

        return new EscolaridadeDTO(aluno.getEscolaridade());
    }

    private void dtoToEntity(AlunoDTO dto, Aluno entity) {
        entity.setNome(dto.getNome());
        entity.setEmail(dto.getEmail());
        entity.setDataNasc(dto.getDataNasc());
        entity.setIdade(dto.getIdade());
        entity.setTelefone(dto.getTelefone());
        entity.setTransporte(dto.getTransporte());
        entity.setProjetoVida(dto.getProjetoVida());
        entity.setSerie(dto.getSerie());
        entity.setEndereco(dto.getEndereco());
        entity.setImgUrl(dto.getImgUrl());
    }

    private static void setDadosFamilia(DadosFamilia familia, AlunoDTO dto) {
        familia.setPai(dto.getDadoFamilia().getPai());
        familia.setMae(dto.getDadoFamilia().getMae());
        familia.setResponsavel(dto.getDadoFamilia().getResponsavel());
        familia.setEstruturaFamiliar(dto.getDadoFamilia().getEstruturaFamiliar());
        familia.setNumPai(dto.getDadoFamilia().getNumPai());
        familia.setNumMae(dto.getDadoFamilia().getNumMae());
        familia.setNumResponsavel(dto.getDadoFamilia().getNumResponsavel());
    }

    private static void setEscolaridade(Escolaridade escolaridade, AlunoDTO dto) {
        escolaridade.setContatoFora(dto.getEscolaridade().getContatoFora());
        escolaridade.setDifAprendizagem(dto.getEscolaridade().getDifAprendizagem());
        escolaridade.setApoioPedagogico(dto.getEscolaridade().getApoioPedagogico());
        escolaridade.setAtividadeExtra(dto.getEscolaridade().getAtividadeExtra());
        escolaridade.setDifLocomotiva(dto.getEscolaridade().getDifLocomotiva());
        escolaridade.setDifVisao(dto.getEscolaridade().getDifVisao());
        escolaridade.setDifAtencao(dto.getEscolaridade().getDifAtencao());
        escolaridade.setDifFala(dto.getEscolaridade().getDifFala());
        escolaridade.setDifEscrita(dto.getEscolaridade().getDifEscrita());
        escolaridade.setAdaptacaoGrupo(dto.getEscolaridade().getAdaptacaoGrupo());
        escolaridade.setReprovado(dto.getEscolaridade().getReprovado());
        escolaridade.setSerieAnoReprovado(dto.getEscolaridade().getSerieAnoReprovado());
        escolaridade.getDisciplinasFacilidade().addAll(dto.getEscolaridade().getDisciplinasFacilidade());
        escolaridade.getDisciplinasDificuldade().addAll(dto.getEscolaridade().getDisciplinasDificuldade());
    }

    private static void dtoToParticipacao(Participacao participacao, ParticipacaoDTO dto) {
        participacao.setAlunoGremista1(dto.getAlunoGremista1());
        participacao.setAlunoGremista2(dto.getAlunoGremista2());
        participacao.setEletiva1(dto.getEletiva1());
        participacao.setEletiva2(dto.getEletiva2());
        participacao.setClubeJuvenil1(dto.getClubeJuvenil1());
        participacao.setClubeJuvenil2(dto.getClubeJuvenil2());
        participacao.setLiderTurma1(dto.getLiderTurma1());
        participacao.setLiderTurma2(dto.getLiderTurma2());
        participacao.setJovemAcolhedor1(dto.getJovemAcolhedor1());
        participacao.setJovemAcolhedor2(dto.getJovemAcolhedor2());
    }

    private static void dtoToAvaliacao(Avaliacao avaliacao, AvaliacaoDTO dto) {
        avaliacao.setTipo(dto.getTipo());
        avaliacao.setMateria(dto.getMateria());
        avaliacao.setNumQuestoes(dto.getNumQuestoes());
        avaliacao.setNumAcertos(dto.getNumAcertos());
        avaliacao.setPeriodo(dto.getPeriodo());
    }

    private static void dtoToOcorrencia(Ocorrencia ocorrencia, OcorrenciaDTO dto) {
        ocorrencia.setNumBi1(dto.getNumBi1());
        ocorrencia.setNumBi2(dto.getNumBi2());
        ocorrencia.setNumBi3(dto.getNumBi3());
        ocorrencia.setNumBi4(dto.getNumBi4());
    }

    private static void dtoToLeitura(Leitura leitura, LeituraDTO dto) {
        leitura.setBimestre(dto.getBimestre());
        leitura.setLivro(dto.getLivro());
    }

    private static void dtoToRegistro(RegistroAtendimento registro, RegistroAtendimentoDTO dto) {
        registro.setData(dto.getData());
        registro.setAssunto(dto.getAssunto());
        registro.setObservacoesProfessor(dto.getObservacoesProfessor());
    }

    private static void dtoToTutoria(Tutoria tutoria, TutoriaDTO dto) {
        tutoria.setData(dto.getData());
        tutoria.setTarefaCMSP(dto.getTarefaCMSP());
        tutoria.setRedacao(dto.getRedacao());
        tutoria.setLeitura(dto.getLeitura());
        tutoria.setProvaPaulista(dto.getProvaPaulista());
        tutoria.setAvaliacoes(dto.getAvaliacoes());
        tutoria.setDificuldades(dto.getDificuldades());
        tutoria.setOutros(dto.getOutros());
        tutoria.setObservacoesProfessor(dto.getObservacoesProfessor());
    }

    private static void dtoToDadosFamilia(DadosFamilia familia, DadosFamiliaDTO dto) {
        familia.setPai(dto.getPai());
        familia.setMae(dto.getMae());
        familia.setResponsavel(dto.getResponsavel());
        familia.setEstruturaFamiliar(dto.getEstruturaFamiliar());
        familia.setNumPai(dto.getNumPai());
        familia.setNumMae(dto.getNumMae());
        familia.setNumResponsavel(dto.getNumResponsavel());
    }


    private static void dtoToEscolaridade(Escolaridade escolaridade, EscolaridadeDTO dto) {
        escolaridade.setContatoFora(dto.getContatoFora());
        escolaridade.setDifAprendizagem(dto.getDifAprendizagem());
        escolaridade.setApoioPedagogico(dto.getApoioPedagogico());
        escolaridade.setAtividadeExtra(dto.getAtividadeExtra());
        escolaridade.setDifLocomotiva(dto.getDifLocomotiva());
        escolaridade.setDifVisao(dto.getDifVisao());
        escolaridade.setDifAtencao(dto.getDifAtencao());
        escolaridade.setDifFala(dto.getDifFala());
        escolaridade.setDifEscrita(dto.getDifEscrita());
        escolaridade.setAdaptacaoGrupo(dto.getAdaptacaoGrupo());
        escolaridade.setReprovado(dto.getReprovado());
        escolaridade.setSerieAnoReprovado(dto.getSerieAnoReprovado());
        escolaridade.setDisciplinasDificuldade(dto.getDisciplinasDificuldade());
        escolaridade.setDisciplinasFacilidade(dto.getDisciplinasFacilidade());
    }
}
