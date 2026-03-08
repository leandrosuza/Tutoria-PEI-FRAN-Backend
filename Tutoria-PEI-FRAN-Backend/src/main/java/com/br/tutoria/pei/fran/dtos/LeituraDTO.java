package com.br.tutoria.pei.fran.dtos;

import com.br.tutoria.pei.fran.entities.Leitura;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LeituraDTO {

    private Long id;
    @NotNull(message = "Campo requerido")
    private Integer bimestre;
    @NotBlank(message = "Campo requerido")
    private String livro;

    public LeituraDTO() {}

    public LeituraDTO(Long id, Integer bimestre, String livro) {
        this.id = id;
        this.bimestre = bimestre;
        this.livro = livro;
    }

    public LeituraDTO(Leitura leitura) {
        id = leitura.getId();
        bimestre = leitura.getBimestre();
        livro = leitura.getLivro();
    }

    public Long getId() {
        return id;
    }

    public Integer getBimestre() {
        return bimestre;
    }

    public String getLivro() {
        return livro;
    }
}
