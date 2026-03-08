package com.br.tutoria.pei.fran.entities;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.Objects;

public class TutoriaPK {

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public TutoriaPK() {}

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TutoriaPK tutoriaPK = (TutoriaPK) o;
        return Objects.equals(aluno, tutoriaPK.aluno) && Objects.equals(usuario, tutoriaPK.usuario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(aluno, usuario);
    }
}
