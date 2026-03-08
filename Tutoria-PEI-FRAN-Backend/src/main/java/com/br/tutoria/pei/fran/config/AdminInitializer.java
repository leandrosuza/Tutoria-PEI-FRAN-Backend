package com.br.tutoria.pei.fran.config;

import com.br.tutoria.pei.fran.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!test")
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioService usuarioService;

    @Override
    public void run(String... args) throws Exception {
        // Cria usuário admin se não existir
        usuarioService.criarAdminSeNaoExistir();
    }
}
