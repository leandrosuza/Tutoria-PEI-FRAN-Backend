package com.br.tutoria.pei.fran.service;

import com.br.tutoria.pei.fran.dtos.UsuarioDTO;
import com.br.tutoria.pei.fran.entities.Usuario;
import com.br.tutoria.pei.fran.repository.AlunoRepository;
import com.br.tutoria.pei.fran.repository.UsuarioRepository;
import com.br.tutoria.pei.fran.service.exceptions.EntityAlreadyExistingException;
import com.br.tutoria.pei.fran.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final AlunoRepository alunoRepository;

    @Autowired
    public UsuarioService(UsuarioRepository repository, AlunoRepository alunoRepository) {
        this.repository = repository;
        this.alunoRepository = alunoRepository;
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll() {
        List<Usuario> list = repository.findAll();
        // Se nome for Admin/Administrador, garante perfil ADMIN
        for (Usuario u : list) {
            if (u.getNome() != null && 
                (u.getNome().equalsIgnoreCase("Admin") || 
                 u.getNome().equalsIgnoreCase("Administrador"))) {
                u.setPerfil("ADMIN");
            }
        }
        return list.stream().map(UsuarioDTO::new).toList();
    }

    public UsuarioDTO insert(UsuarioDTO dto) {
        if (repository.existsByCpf((dto.getCpf()))){
            throw new EntityAlreadyExistingException("Entidade já criada!");
        }
        Usuario novo = new Usuario();
        dtoToEntity(novo, dto);
        // Define perfil padrão como PROFESSOR se não especificado
        if (novo.getPerfil() == null || novo.getPerfil().isEmpty()) {
            novo.setPerfil("PROFESSOR");
        }
        // Se o nome for Admin/Administrador, força perfil ADMIN
        if (novo.getNome() != null && 
            (novo.getNome().equalsIgnoreCase("Admin") || 
             novo.getNome().equalsIgnoreCase("Administrador"))) {
            novo.setPerfil("ADMIN");
        }
        novo = repository.save(novo);
        return new UsuarioDTO(novo);
    }

    private void dtoToEntity(Usuario entity, UsuarioDTO dto) {
        entity.setCpf(dto.getCpf());
        entity.setNome(dto.getNome());
        entity.setPerfil(dto.getPerfil());
    }

    @Transactional
    public void criarAdminSeNaoExistir() {
        String cpfAdmin = "00000000000";
        if (!repository.existsByCpf(cpfAdmin)) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setCpf(cpfAdmin);
            admin.setPerfil("ADMIN");
            repository.save(admin);
            System.out.println("Usuário ADMIN criado com sucesso!");
        }
    }

    public UsuarioDTO login(String nome, String cpf) {
        Optional<Usuario> optUsuario = repository.findByNomeAndCpf(nome, cpf);
        if (optUsuario.isPresent()) {
            Usuario usuario = optUsuario.get();
            // Se o nome for Admin/Administrador, garante perfil ADMIN no retorno
            if (usuario.getNome() != null && 
                (usuario.getNome().equalsIgnoreCase("Admin") || 
                 usuario.getNome().equalsIgnoreCase("Administrador"))) {
                usuario.setPerfil("ADMIN");
            }
            return new UsuarioDTO(usuario);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public UsuarioDTO findById(Long id) {
        Usuario usuario = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return new UsuarioDTO(usuario);
    }

    @Transactional
    public UsuarioDTO update(Long id, UsuarioDTO dto) {
        Usuario usuario = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario = repository.save(usuario);
        return new UsuarioDTO(usuario);
    }

    public boolean hasAlunos(Long usuarioId) {
        return alunoRepository.existsByUsuario_Id(usuarioId);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}