package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "tb_ocorrencia")
public class Ocorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer numBi1;
    private Integer numBi2;
    private Integer numBi3;
    private Integer numBi4;

    @OneToOne(mappedBy = "ocorrencias")
    private Aluno aluno;

    public Ocorrencia() {}

    public Ocorrencia(Long id, Integer numBi1, Integer numBi2, Integer numBi3, Integer numBi4, Aluno aluno) {
        this.id = id;
        this.numBi1 = numBi1;
        this.numBi2 = numBi2;
        this.numBi3 = numBi3;
        this.numBi4 = numBi4;
        this.aluno = aluno;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumBi1() {
        return numBi1;
    }

    public void setNumBi1(Integer numBi1) {
        this.numBi1 = numBi1;
    }

    public Integer getNumBi2() {
        return numBi2;
    }

    public void setNumBi2(Integer numBi2) {
        this.numBi2 = numBi2;
    }

    public Integer getNumBi3() {
        return numBi3;
    }

    public void setNumBi3(Integer numBi3) {
        this.numBi3 = numBi3;
    }

    public Integer getNumBi4() {
        return numBi4;
    }

    public void setNumBi4(Integer numBi4) {
        this.numBi4 = numBi4;
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
        Ocorrencia that = (Ocorrencia) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
