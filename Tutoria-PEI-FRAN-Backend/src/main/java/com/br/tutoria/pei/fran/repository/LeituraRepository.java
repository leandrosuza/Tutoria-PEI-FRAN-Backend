package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.Leitura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeituraRepository extends JpaRepository<Leitura, Long> {

    Optional<Leitura> findByAlunoRaAndBimestreAndLivro(Long ra, Integer bimestre, String livro);
}
