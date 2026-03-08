package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "tb_leitura")
public class Leitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer bimestre;
    private String livro;

    @ManyToOne
    @JoinColumn(name = "aluno_ra")
    private Aluno aluno;

    public Leitura() {}

    public Leitura(Long id, Integer bimestre, String livro, Aluno aluno) {
        this.id = id;
        this.bimestre = bimestre;
        this.livro = livro;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getBimestre() {
        return bimestre;
    }

    public void setBimestre(Integer bimestre) {
        this.bimestre = bimestre;
    }

    public String getLivro() {
        return livro;
    }

    public void setLivro(String livro) {
        this.livro = livro;
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
        Leitura leitura = (Leitura) o;
        return Objects.equals(id, leitura.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
