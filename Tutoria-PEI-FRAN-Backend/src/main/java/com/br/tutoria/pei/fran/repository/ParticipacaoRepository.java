package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.Participacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ParticipacaoRepository extends JpaRepository<Participacao, Long> {

    @Query(value = "SELECT obj FROM Participacao obj WHERE obj.aluno.ra = :ra")
    Participacao getParticipacaoByAlunoRa(Long ra);
}
