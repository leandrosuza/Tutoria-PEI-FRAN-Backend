package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.RegistroAtendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface RegistroAtendimentoRepository extends JpaRepository<RegistroAtendimento, Long> {

    Optional<RegistroAtendimento> findByAlunoRaAndDataAndAssuntoAndObservacoesProfessor(
            Long alunoId,
            LocalDate data,
            String assunto,
            String observacoesProfessor
    );
}

