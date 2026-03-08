package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tb_escolaridade")
public class Escolaridade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean contatoFora;
    private Boolean difAprendizagem;
    private Boolean apoioPedagogico;
    private List<String> disciplinasFacilidade = new ArrayList<>();
    private List<String> disciplinasDificuldade = new ArrayList<>();
    private Boolean atividadeExtra;
    private Boolean difLocomotiva;
    private Boolean difVisao;
    private Boolean difAtencao;
    private Boolean difFala;
    private Boolean difEscrita;
    private Boolean adaptacaoGrupo;
    private Boolean reprovado;
    private String serieAnoReprovado;

    @OneToOne(mappedBy = "escolaridade")
    private Aluno aluno;

    public Escolaridade() {}

    public Escolaridade(Long id, Boolean contatoFora, Boolean difAprendizagem, Boolean apoioPedagogico, List<String> disciplinasFacilidade, List<String> disciplinasDificuldade, Boolean atividadeExtra, Boolean difLocomotiva, Boolean difVisao, Boolean difAtencao, Boolean difFala, Boolean difEscrita, Boolean adaptacaoGrupo, Boolean reprovado, String serieAnoReprovado, Aluno aluno) {
        this.id = id;
        this.contatoFora = contatoFora;
        this.difAprendizagem = difAprendizagem;
        this.apoioPedagogico = apoioPedagogico;
        this.disciplinasFacilidade = disciplinasFacilidade;
        this.disciplinasDificuldade = disciplinasDificuldade;
        this.atividadeExtra = atividadeExtra;
        this.difLocomotiva = difLocomotiva;
        this.difVisao = difVisao;
        this.difAtencao = difAtencao;
        this.difFala = difFala;
        this.difEscrita = difEscrita;
        this.adaptacaoGrupo = adaptacaoGrupo;
        this.reprovado = reprovado;
        this.serieAnoReprovado = serieAnoReprovado;
        this.aluno = aluno;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getContatoFora() {
        return contatoFora;
    }

    public void setContatoFora(Boolean contatoFora) {
        this.contatoFora = contatoFora;
    }

    public Boolean getDifAprendizagem() {
        return difAprendizagem;
    }

    public void setDifAprendizagem(Boolean difAprendizagem) {
        this.difAprendizagem = difAprendizagem;
    }

    public Boolean getApoioPedagogico() {
        return apoioPedagogico;
    }

    public void setApoioPedagogico(Boolean apoioPedagogico) {
        this.apoioPedagogico = apoioPedagogico;
    }

    public List<String> getDisciplinasFacilidade() {
        return disciplinasFacilidade;
    }

    public void setDisciplinasFacilidade(List<String> disciplinasFacilidade) {
        this.disciplinasFacilidade = disciplinasFacilidade;
    }

    public List<String> getDisciplinasDificuldade() {
        return disciplinasDificuldade;
    }

    public void setDisciplinasDificuldade(List<String> disciplinasDificuldade) {
        this.disciplinasDificuldade = disciplinasDificuldade;
    }

    public Boolean getAtividadeExtra() {
        return atividadeExtra;
    }

    public void setAtividadeExtra(Boolean atividadeExtra) {
        this.atividadeExtra = atividadeExtra;
    }

    public Boolean getDifLocomotiva() {
        return difLocomotiva;
    }

    public void setDifLocomotiva(Boolean difLocomotiva) {
        this.difLocomotiva = difLocomotiva;
    }

    public Boolean getDifVisao() {
        return difVisao;
    }

    public void setDifVisao(Boolean difVisao) {
        this.difVisao = difVisao;
    }

    public Boolean getDifAtencao() {
        return difAtencao;
    }

    public void setDifAtencao(Boolean difAtencao) {
        this.difAtencao = difAtencao;
    }

    public Boolean getDifFala() {
        return difFala;
    }

    public void setDifFala(Boolean difFala) {
        this.difFala = difFala;
    }

    public Boolean getDifEscrita() {
        return difEscrita;
    }

    public void setDifEscrita(Boolean difEscrita) {
        this.difEscrita = difEscrita;
    }

    public Boolean getAdaptacaoGrupo() {
        return adaptacaoGrupo;
    }

    public void setAdaptacaoGrupo(Boolean adaptacaoGrupo) {
        this.adaptacaoGrupo = adaptacaoGrupo;
    }

    public Boolean getReprovado() {
        return reprovado;
    }

    public void setReprovado(Boolean reprovado) {
        this.reprovado = reprovado;
    }

    public String getSerieAnoReprovado() {
        return serieAnoReprovado;
    }

    public void setSerieAnoReprovado(String serieAnoReprovado) {
        this.serieAnoReprovado = serieAnoReprovado;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Escolaridade that = (Escolaridade) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
