package com.br.tutoria.pei.fran.dtos;

import com.br.tutoria.pei.fran.entities.DadosFamilia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class DadosFamiliaDTO {

    @NotBlank(message = "Campo requerido")
    private String pai;
    @NotBlank(message = "Campo requerido")
    private String mae;
    private String responsavel;
    @NotBlank(message = "Campo requerido")
    private String estruturaFamiliar;
    @PositiveOrZero(message = "Insira um numero valido")
    private Long numPai;
    @PositiveOrZero(message = "Insira um numero valido")
    private Long numMae;
    @PositiveOrZero(message = "Insira um numero valido")
    private Long numResponsavel;

    public DadosFamiliaDTO() {}

    public DadosFamiliaDTO(Long id, String pai, String mae, String responsavel, String estruturaFamiliar, Long numPai, Long numMae, Long numResponsavel) {
        this.pai = pai;
        this.mae = mae;
        this.responsavel = responsavel;
        this.estruturaFamiliar = estruturaFamiliar;
        this.numPai = numPai;
        this.numMae = numMae;
        this.numResponsavel = numResponsavel;
    }

    public DadosFamiliaDTO(DadosFamilia dadosFamilia) {
        pai = dadosFamilia.getPai();
        mae = dadosFamilia.getMae();
        responsavel = dadosFamilia.getResponsavel();
        estruturaFamiliar = dadosFamilia.getEstruturaFamiliar();
        numPai = dadosFamilia.getNumPai();
        numMae = dadosFamilia.getNumMae();
        numResponsavel = dadosFamilia.getNumResponsavel();
    }

    public String getPai() {
        return pai;
    }

    public String getMae() {
        return mae;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public String getEstruturaFamiliar() {
        return estruturaFamiliar;
    }

    public Long getNumPai() {
        return numPai;
    }

    public Long getNumMae() {
        return numMae;
    }

    public Long getNumResponsavel() {
        return numResponsavel;
    }
}
