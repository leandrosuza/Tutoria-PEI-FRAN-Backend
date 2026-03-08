INSERT INTO tb_usuario (cpf, nome) VALUES ('123456', 'Rodrigo Soares');
INSERT INTO tb_usuario (cpf, nome) VALUES ('654321', 'Matheus César');
INSERT INTO tb_usuario (cpf, nome) VALUES ('321654', 'Paulo');

INSERT INTO tb_dados_familia (pai, mae, responsavel, estrutura_familiar, num_pai, num_mae, num_responsavel) VALUES ('José Mendes', 'Andréia Mendes', '', 'separados, mora com a mãe', 987654321, 987654321, NULL);
INSERT INTO tb_dados_familia (pai, mae, responsavel, estrutura_familiar, num_pai, num_mae, num_responsavel) VALUES ('Nélio Alves', 'Carla Alves', 'Henrique Alves', 'separados, mora com o avô', NULL, NULL, 234567890);
INSERT INTO tb_dados_familia (pai, mae, responsavel, estrutura_familiar, num_pai, num_mae, num_responsavel) VALUES ('Carlos de Souza', 'Maria de Souza', '', 'casados', 123456789, 123456789, NULL);

INSERT INTO tb_escolaridade(contato_fora, dif_aprendizagem, apoio_pedagogico, disciplinas_facilidade, disciplinas_dificuldade, atividade_extra, dif_locomotiva, dif_visao, dif_atencao, dif_fala, dif_escrita, adaptacao_grupo, reprovado) VALUES (true, true, true, '[matemática, portugues]', '[geografia]',  false, false, false, false, false, false, true, false);

