package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "tb_tutoria")
public class Tutoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate data;
    private Boolean tarefaCMSP;
    private Boolean redacao;
    private Boolean leitura;
    private Boolean provaPaulista;
    private Boolean avaliacoes;
    private Boolean dificuldades;
    private Boolean outros;
    private String observacoesProfessor;

    @ManyToOne
    @JoinColumn(name = "aluno_ra")
    private Aluno aluno;

    public Tutoria() {}

    public Tutoria(Long id, LocalDate data, Boolean tarefaCMSP, Boolean redacao, Boolean leitura, Boolean provaPaulista, Boolean avaliacoes, Boolean dificuldades, Boolean outros, String observacoesProfessor, Aluno aluno) {
        this.id = id;
        this.data = data;
        this.tarefaCMSP = tarefaCMSP;
        this.redacao = redacao;
        this.leitura = leitura;
        this.provaPaulista = provaPaulista;
        this.avaliacoes = avaliacoes;
        this.dificuldades = dificuldades;
        this.outros = outros;
        this.observacoesProfessor = observacoesProfessor;
        this.aluno = aluno;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Boolean getTarefaCMSP() {
        return tarefaCMSP;
    }

    public void setTarefaCMSP(Boolean tarefaCMSP) {
        this.tarefaCMSP = tarefaCMSP;
    }

    public Boolean getRedacao() {
        return redacao;
    }

    public void setRedacao(Boolean redacao) {
        this.redacao = redacao;
    }

    public Boolean getLeitura() {
        return leitura;
    }

    public void setLeitura(Boolean leitura) {
        this.leitura = leitura;
    }

    public Boolean getProvaPaulista() {
        return provaPaulista;
    }

    public void setProvaPaulista(Boolean provaPaulista) {
        this.provaPaulista = provaPaulista;
    }

    public Boolean getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(Boolean avaliacoes) {
        this.avaliacoes = avaliacoes;
    }

    public Boolean getDificuldades() {
        return dificuldades;
    }

    public void setDificuldades(Boolean dificuldades) {
        this.dificuldades = dificuldades;
    }

    public Boolean getOutros() {
        return outros;
    }

    public void setOutros(Boolean outros) {
        this.outros = outros;
    }

    public String getObservacoesProfessor() {
        return observacoesProfessor;
    }

    public void setObservacoesProfessor(String observacoesProfessor) {
        this.observacoesProfessor = observacoesProfessor;
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
        Tutoria tutoria = (Tutoria) o;
        return Objects.equals(id, tutoria.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
