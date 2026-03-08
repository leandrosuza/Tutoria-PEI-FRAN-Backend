package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.entities.Usuario;
import com.br.tutoria.pei.fran.projections.UserDetailsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByCpf(String cpf);


	Optional<Usuario> findByNomeAndCpf(String nome, String cpf);
}