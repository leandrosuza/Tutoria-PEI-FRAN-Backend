package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    @Query("SELECT o FROM Ocorrencia o JOIN Aluno a ON a.ocorrencias.id = o.id WHERE a.ra = :ra")
    Ocorrencia getOcorrenciaByAlunoRa(Long ra);
}
