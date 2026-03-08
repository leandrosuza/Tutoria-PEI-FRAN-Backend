package com.br.tutoria.pei.fran.repository;

import com.br.tutoria.pei.fran.dtos.AlunoMinDTO;
import com.br.tutoria.pei.fran.entities.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    @Query("SELECT new com.br.tutoria.pei.fran.dtos.AlunoMinDTO(obj.ra, obj.nome) FROM Aluno obj")
    List<AlunoMinDTO> getAllNames();
    List<Aluno> findByUsuario_Id(Long usuarioId);
    boolean existsByUsuario_Id(Long usuarioId);

}

