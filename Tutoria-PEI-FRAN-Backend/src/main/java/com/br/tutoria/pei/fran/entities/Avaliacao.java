package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "tb_avaliacao")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tipo;
    private String materia;
    private Integer numQuestoes;
    private Double numAcertos;
    private String periodo;

    @ManyToOne
    @JoinColumn(name = "aluno_ra")
    private Aluno aluno;

    public Avaliacao() {}

    public Avaliacao(Long id, String tipo, String materia, Integer numQuestoes, Double numAcertos, Aluno aluno, String periodo) {
        this.id = id;
        this.tipo = tipo;
        this.materia = materia;
        this.numQuestoes = numQuestoes;
        this.numAcertos = numAcertos;
        this.aluno = aluno;
        this.periodo = periodo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMateria() {
        return materia;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public Integer getNumQuestoes() {
        return numQuestoes;
    }

    public void setNumQuestoes(Integer numQuestoes) {
        this.numQuestoes = numQuestoes;
    }

    public Double getNumAcertos() {
        return numAcertos;
    }

    public void setNumAcertos(Double numAcertos) {
        this.numAcertos = numAcertos;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
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
        Avaliacao avaliacao = (Avaliacao) o;
        return Objects.equals(id, avaliacao.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
