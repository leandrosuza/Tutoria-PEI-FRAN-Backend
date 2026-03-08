package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.Tutoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TutoriaRepository extends JpaRepository<Tutoria, Long> {

    Optional<Tutoria> findByIdAndDataAndTarefaCMSPAndRedacaoAndLeituraAndProvaPaulistaAndAvaliacoesAndDificuldadesAndOutrosAndObservacoesProfessor(
            Long id,
            LocalDate data,
            Boolean tarefaCMSP,
            Boolean redacao,
            Boolean leitura,
            Boolean provaPaulista,
            Boolean avaliacoes,
            Boolean dificuldades,
            Boolean outros,
            String observacoesProfessor
    );
}

