package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    Optional<Avaliacao> findByAlunoRaAndPeriodoAndTipoAndMateriaAndNumQuestoesAndNumAcertos(
            Long ra, String periodo, String tipo, String materia, Integer numQuestoes, Double numAcertos
    );
}
