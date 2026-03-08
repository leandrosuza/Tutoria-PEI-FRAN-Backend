package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tb_dados_familia")
public class DadosFamilia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String pai;
    private String mae;
    private String responsavel;
    private String estruturaFamiliar;
    private Long numPai;
    private Long numMae;
    private Long numResponsavel;

    @OneToMany(mappedBy = "dadoFamilia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Aluno> alunos = new ArrayList<>();

    public DadosFamilia() {}

    public DadosFamilia(Long id, String pai, String mae, String responsavel, String estruturaFamiliar, Long numPai, Long numMae, Long numResponsavel, List<Aluno> alunos) {
        this.id = id;
        this.pai = pai;
        this.mae = mae;
        this.responsavel = responsavel;
        this.estruturaFamiliar = estruturaFamiliar;
        this.numPai = numPai;
        this.numMae = numMae;
        this.numResponsavel = numResponsavel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPai() {
        return pai;
    }

    public void setPai(String pai) {
        this.pai = pai;
    }

    public String getMae() {
        return mae;
    }

    public void setMae(String mae) {
        this.mae = mae;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getEstruturaFamiliar() {
        return estruturaFamiliar;
    }

    public void setEstruturaFamiliar(String estruturaFamiliar) {
        this.estruturaFamiliar = estruturaFamiliar;
    }

    public Long getNumPai() {
        return numPai;
    }

    public void setNumPai(Long numPai) {
        this.numPai = numPai;
    }

    public Long getNumMae() {
        return numMae;
    }

    public void setNumMae(Long numMae) {
        this.numMae = numMae;
    }

    public Long getNumResponsavel() {
        return numResponsavel;
    }

    public void setNumResponsavel(Long numResponsavel) {
        this.numResponsavel = numResponsavel;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void addAlunos(Aluno aluno) {
        alunos.add(aluno);
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        DadosFamilia dadosFamilia = (DadosFamilia) o;
        return Objects.equals(id, dadosFamilia.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

}
