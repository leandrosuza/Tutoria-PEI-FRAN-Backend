package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.Escolaridade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EscolaridadeRepository extends JpaRepository<Escolaridade, Long> {
}
