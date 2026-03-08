package com.br.tutoria.pei.fran.dtos;

import com.br.tutoria.pei.fran.entities.RegistroAtendimento;

import java.time.LocalDate;

public class RegistroAtendimentoDTO {

    private Long id;
    private LocalDate data;
    private String assunto;
    private String observacoesProfessor;

    public RegistroAtendimentoDTO() {}

    public RegistroAtendimentoDTO(Long id, LocalDate data, String assunto, String observacoesProfessor) {
        this.id = id;
        this.data = data;
        this.assunto = assunto;
        this.observacoesProfessor = observacoesProfessor;
    }

    public RegistroAtendimentoDTO(RegistroAtendimento registro) {
        id = registro.getId();
        data = registro.getData();
        assunto = registro.getAssunto();
        observacoesProfessor = registro.getObservacoesProfessor();
    }

    public Long getId() {
        return id;
    }

    public LocalDate getData() {
        return data;
    }

    public String getAssunto() {
        return assunto;
    }

    public String getObservacoesProfessor() {
        return observacoesProfessor;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public void setAssunto(String assunto) {
        this.assunto = assunto;
    }

    public void setObservacoesProfessor(String observacoesProfessor) {
        this.observacoesProfessor = observacoesProfessor;
    }
}
