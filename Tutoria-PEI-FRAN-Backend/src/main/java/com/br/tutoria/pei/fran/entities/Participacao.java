package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "tb_participacao")
public class Participacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clubeJuvenil1;
    private String eletiva1;
    private Boolean liderTurma1;
    private Boolean alunoGremista1;
    private Boolean jovemAcolhedor1;
    private String clubeJuvenil2;
    private String eletiva2;
    private Boolean liderTurma2;
    private Boolean alunoGremista2;
    private Boolean jovemAcolhedor2;

    @OneToOne(mappedBy = "participacao")
    private Aluno aluno;

    public Participacao() {}

    public Participacao(Long id, String clubeJuvenil1, String eletiva1, Boolean liderTurma1, Boolean alunoGremista1, Boolean jovemAcolhedor1, String clubeJuvenil2, String eletiva2, Boolean liderTurma2, Boolean alunoGremista2, Boolean jovemAcolhedor2, Aluno aluno) {
        this.id = id;
        this.clubeJuvenil1 = clubeJuvenil1;
        this.eletiva1 = eletiva1;
        this.liderTurma1 = liderTurma1;
        this.alunoGremista1 = alunoGremista1;
        this.jovemAcolhedor1 = jovemAcolhedor1;
        this.clubeJuvenil2 = clubeJuvenil2;
        this.eletiva2 = eletiva2;
        this.liderTurma2 = liderTurma2;
        this.alunoGremista2 = alunoGremista2;
        this.jovemAcolhedor2 = jovemAcolhedor2;
        this.aluno = aluno;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClubeJuvenil1() {
        return clubeJuvenil1;
    }

    public void setClubeJuvenil1(String clubeJuvenil1) {
        this.clubeJuvenil1 = clubeJuvenil1;
    }

    public String getEletiva1() {
        return eletiva1;
    }

    public void setEletiva1(String eletiva1) {
        this.eletiva1 = eletiva1;
    }

    public Boolean getLiderTurma1() {
        return liderTurma1;
    }

    public void setLiderTurma1(Boolean liderTurma1) {
        this.liderTurma1 = liderTurma1;
    }

    public Boolean getAlunoGremista1() {
        return alunoGremista1;
    }

    public void setAlunoGremista1(Boolean alunoGremista1) {
        this.alunoGremista1 = alunoGremista1;
    }

    public Boolean getJovemAcolhedor1() {
        return jovemAcolhedor1;
    }

    public void setJovemAcolhedor1(Boolean jovemAcolhedor1) {
        this.jovemAcolhedor1 = jovemAcolhedor1;
    }

    public String getClubeJuvenil2() {
        return clubeJuvenil2;
    }

    public void setClubeJuvenil2(String clubeJuvenil2) {
        this.clubeJuvenil2 = clubeJuvenil2;
    }

    public String getEletiva2() {
        return eletiva2;
    }

    public void setEletiva2(String eletiva2) {
        this.eletiva2 = eletiva2;
    }

    public Boolean getLiderTurma2() {
        return liderTurma2;
    }

    public void setLiderTurma2(Boolean liderTurma2) {
        this.liderTurma2 = liderTurma2;
    }

    public Boolean getAlunoGremista2() {
        return alunoGremista2;
    }

    public void setAlunoGremista2(Boolean alunoGremista2) {
        this.alunoGremista2 = alunoGremista2;
    }

    public Boolean getJovemAcolhedor2() {
        return jovemAcolhedor2;
    }

    public void setJovemAcolhedor2(Boolean jovemAcolhedor2) {
        this.jovemAcolhedor2 = jovemAcolhedor2;
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
        Participacao that = (Participacao) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
