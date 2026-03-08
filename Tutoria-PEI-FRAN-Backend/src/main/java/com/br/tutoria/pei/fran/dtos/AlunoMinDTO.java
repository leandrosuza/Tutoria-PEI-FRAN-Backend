package com.br.tutoria.pei.fran.dtos;

public class AlunoMinDTO {
    private Long ra;
    private String nome;
    private Long usuarioId;

    public AlunoMinDTO() {}

    public AlunoMinDTO(Long ra, String nome) {
        this.ra = ra;
        this.nome = nome;
    }

    public AlunoMinDTO(Long ra, String nome, Long usuarioId) {
        this.ra = ra;
        this.nome = nome;
        this.usuarioId = usuarioId;
    }

    public Long getRa() {
        return ra;
    }

    public void setRa(Long ra) {
        this.ra = ra;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Long getUsuarioId() {return usuarioId;}
    public void setUsuarioId(Long usuarioId) {this.usuarioId = usuarioId;}
}
