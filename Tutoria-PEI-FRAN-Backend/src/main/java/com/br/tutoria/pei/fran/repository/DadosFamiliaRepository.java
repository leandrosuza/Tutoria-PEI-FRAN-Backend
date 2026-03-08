package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.DadosFamilia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DadosFamiliaRepository extends JpaRepository<DadosFamilia, Long> {

    @Query(nativeQuery = true, value = "SELECT * FROM tb_dados_familia f " +
            "WHERE (f.pai = :pai) " +
            "OR (f.mae = :mae) " +
            "OR(f.responsavel = :responsavel AND(f.responsavel <> '')) " +
            "LIMIT 1")
    Optional<DadosFamilia> findPaiOrMaeOrResponsavel(String pai, String mae, String responsavel);

    @Query(value = "SELECT f FROM DadosFamilia f " +
            "JOIN FETCH f.alunos WHERE f.id = :id")
    DadosFamilia findFamiliaByIdWithAluno(Long id);
}
