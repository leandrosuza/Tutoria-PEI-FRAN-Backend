package com.br.tutoria.pei.fran.dtos;

import com.br.tutoria.pei.fran.entities.Participacao;

public class ParticipacaoDTO {

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

    public ParticipacaoDTO() {}

    public ParticipacaoDTO(Long id, String clubeJuvenil1, String eletiva1, Boolean liderTurma1, Boolean alunoGremista1, Boolean jovemAcolhedor1, String clubeJuvenil2, String eletiva2, Boolean liderTurma2, Boolean alunoGremista2, Boolean jovemAcolhedor2) {
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
    }

    public ParticipacaoDTO(Participacao participacao) {
        id = participacao.getId();
        clubeJuvenil1 = participacao.getClubeJuvenil1();
        eletiva1 = participacao.getEletiva1();
        liderTurma1 = participacao.getLiderTurma1();
        alunoGremista1 = participacao.getAlunoGremista1();
        jovemAcolhedor1 = participacao.getJovemAcolhedor1();
        clubeJuvenil2 = participacao.getClubeJuvenil2();
        eletiva2 = participacao.getEletiva2();
        liderTurma2 = participacao.getLiderTurma2();
        alunoGremista2 = participacao.getAlunoGremista2();
        jovemAcolhedor2 = participacao.getJovemAcolhedor2();
    }

    public Long getId() {
        return id;
    }

    public String getClubeJuvenil1() {
        return clubeJuvenil1;
    }

    public String getEletiva1() {
        return eletiva1;
    }

    public Boolean getLiderTurma1() {
        return liderTurma1;
    }

    public Boolean getAlunoGremista1() {
        return alunoGremista1;
    }

    public Boolean getJovemAcolhedor1() {
        return jovemAcolhedor1;
    }

    public String getClubeJuvenil2() {
        return clubeJuvenil2;
    }

    public String getEletiva2() {
        return eletiva2;
    }

    public Boolean getLiderTurma2() {
        return liderTurma2;
    }

    public Boolean getAlunoGremista2() {
        return alunoGremista2;
    }

    public Boolean getJovemAcolhedor2() {
        return jovemAcolhedor2;
    }
}
