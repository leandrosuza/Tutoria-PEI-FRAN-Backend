package com.br.tutoria.pei.fran.dtos;

import com.br.tutoria.pei.fran.entities.Avaliacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class AvaliacaoDTO {

    private Long id;
    @NotBlank(message = "Campo requerido")
    private String tipo;
    @NotBlank(message = "Campo requerido")
    private String materia;
    @NotNull(message = "Campo requerido")
    @PositiveOrZero(message = "Valor nao pode ser negativo")
    private Integer numQuestoes;
    @NotNull(message = "Campo requerido")
    @PositiveOrZero(message = "Valor nao pode ser negativo")
    private Double numAcertos;
    @NotBlank(message = "Campo requerido")
    private String periodo;

    public AvaliacaoDTO() {}

    public AvaliacaoDTO(Long id, String tipo, String materia, Integer numQuestoes, Double numAcertos, String periodo) {
        this.id = id;
        this.tipo = tipo;
        this.materia = materia;
        this.numQuestoes = numQuestoes;
        this.numAcertos = numAcertos;
        this.periodo = periodo;
    }

    public AvaliacaoDTO(Avaliacao avaliacao) {
        id = avaliacao.getId();
        tipo = avaliacao.getTipo();
        materia = avaliacao.getMateria();
        numQuestoes = avaliacao.getNumQuestoes();
        numAcertos = avaliacao.getNumAcertos();
        periodo = avaliacao.getPeriodo();
    }

    public Long getId() {
        return id;
    }

    public String getTipo() {
        return tipo;
    }

    public String getMateria() {
        return materia;
    }

    public Integer getNumQuestoes() {
        return numQuestoes;
    }

    public Double getNumAcertos() {
        return numAcertos;
    }

    public String getPeriodo() { return periodo; }
}
