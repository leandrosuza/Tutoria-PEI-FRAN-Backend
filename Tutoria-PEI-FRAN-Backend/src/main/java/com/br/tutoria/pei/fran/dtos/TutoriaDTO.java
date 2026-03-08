package com.br.tutoria.pei.fran.dtos;

import com.br.tutoria.pei.fran.entities.Tutoria;

import java.time.LocalDate;

public class TutoriaDTO {

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

    public TutoriaDTO() {}

    public TutoriaDTO(Long id, LocalDate data, Boolean tarefaCMSP, Boolean redacao, Boolean leitura, Boolean provaPaulista, Boolean avaliacoes, Boolean dificuldades, Boolean outros, String observacoesProfessor) {
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
    }

    public TutoriaDTO(Tutoria tutoria) {
        id = tutoria.getId();
        data = tutoria.getData();
        tarefaCMSP = tutoria.getTarefaCMSP();
        redacao = tutoria.getRedacao();
        leitura = tutoria.getLeitura();
        provaPaulista = tutoria.getProvaPaulista();
        avaliacoes = tutoria.getAvaliacoes();
        dificuldades = tutoria.getDificuldades();
        outros = tutoria.getOutros();
        observacoesProfessor = tutoria.getObservacoesProfessor();
    }

    public Long getId() {
        return id;
    }

    public LocalDate getData() {
        return data;
    }

    public Boolean getTarefaCMSP() {
        return tarefaCMSP;
    }

    public Boolean getRedacao() {
        return redacao;
    }

    public Boolean getLeitura() {
        return leitura;
    }

    public Boolean getProvaPaulista() {
        return provaPaulista;
    }

    public Boolean getAvaliacoes() {
        return avaliacoes;
    }

    public Boolean getDificuldades() {
        return dificuldades;
    }

    public Boolean getOutros() {
        return outros;
    }

    public String getObservacoesProfessor() {
        return observacoesProfessor;
    }
}
