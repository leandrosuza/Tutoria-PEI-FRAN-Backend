package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "tb_aluno")
public class Aluno {

    @Id
    private Long ra;
    private String nome;
    private String email;
    private LocalDate dataNasc;
    private Integer idade;
    private Long telefone;
    private String transporte;
    private String projetoVida;
    private String serie;
    private String endereco;
    private String imgUrl;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "dado_familia_id")
    private DadosFamilia dadoFamilia;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avaliacao> avaliacoes;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "escolaridade_id")
    private Escolaridade escolaridade;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "participacao_id")
    private Participacao participacao;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Tutoria> tutorias = new ArrayList<>();

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    List<RegistroAtendimento> registroAtendimentos = new ArrayList<>();

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Leitura> leituras = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "ocorrencias_id")
    private Ocorrencia ocorrencias;

    public Aluno() {}

    public Aluno(Long ra, String nome, String email, LocalDate dataNasc, Integer idade, Long telefone, String transporte, String projetoVida, String serie, String endereco, DadosFamilia dadoFamilia, Escolaridade escolaridade, String imgUrl) {
        this.ra = ra;
        this.nome = nome;
        this.email = email;
        this.dataNasc = dataNasc;
        this.idade = idade;
        this.telefone = telefone;
        this.transporte = transporte;
        this.projetoVida = projetoVida;
        this.serie = serie;
        this.endereco = endereco;
        this.dadoFamilia = dadoFamilia;
        this.escolaridade = escolaridade;
        this.imgUrl = imgUrl;
    }

    public Long getRa() {
        return ra;
    }

    public void setRa(Long ra) {
        this.ra = ra;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDataNasc() {
        return dataNasc;
    }

    public void setDataNasc(LocalDate dataNasc) {
        this.dataNasc = dataNasc;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public Long getTelefone() {
        return telefone;
    }

    public void setTelefone(Long telefone) {
        this.telefone = telefone;
    }

    public String getTransporte() {
        return transporte;
    }

    public void setTransporte(String transporte) {
        this.transporte = transporte;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public String getProjetoVida() {
        return projetoVida;
    }

    public void setProjetoVida(String projetoVida) {
        this.projetoVida = projetoVida;
    }

    public DadosFamilia getDadoFamilia() {
        return dadoFamilia;
    }

    public void setDadoFamilia(DadosFamilia dadoFamilia) {
        this.dadoFamilia = dadoFamilia;
    }

    public Escolaridade getEscolaridade() {
        return escolaridade;
    }

    public void setEscolaridade(Escolaridade escolaridade) {
        this.escolaridade = escolaridade;
    }

    public Participacao getParticipacao() {
        return participacao;
    }

    public void setParticipacao(Participacao participacao) {
        this.participacao = participacao;
    }

    public List<Avaliacao> getAvaliacoes() {
        return avaliacoes;
    }

    public void addAvaliacao(Avaliacao avaliacao) {
        this.avaliacoes.add(avaliacao);
    }

    public List<Leitura> getLeituras() {
        return leituras;
    }

    public void addLeitura(Leitura leitura) {
        leituras.add(leitura);
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public Ocorrencia getOcorrencias() {
        return ocorrencias;
    }

    public void setOcorrencias(Ocorrencia ocorrencias) {
        this.ocorrencias = ocorrencias;
    }

    public List<Tutoria> getTutorias() {
        return tutorias;
    }

    public List<RegistroAtendimento> getRegistroAtendimentos() {
        return registroAtendimentos;
    }

    public void addTutoria(Tutoria tutoria) {
        tutorias.add(tutoria);
    }

    public void addRegistroAtendimento(RegistroAtendimento registroAtendimento) {
        registroAtendimentos.add(registroAtendimento);
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Aluno aluno = (Aluno) o;
        return Objects.equals(ra, aluno.ra);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(ra);
    }
}
