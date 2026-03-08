-- Script de teste para popular banco SQLite
-- Usuários de teste
INSERT INTO tb_usuario (cpf, nome) VALUES ('11111111111', 'Prof. Teste Silva');
INSERT INTO tb_usuario (cpf, nome) VALUES ('22222222222', 'Prof. Teste Santos');
INSERT INTO tb_usuario (cpf, nome) VALUES ('33333333333', 'Coordenador Teste');

-- Dados familiares de teste
INSERT INTO tb_dados_familia (pai, mae, responsavel, estrutura_familiar, num_pai, num_mae, num_responsavel) 
VALUES ('Pai Teste 1', 'Mãe Teste 1', '', 'casados', 11999990001, 11999990002, NULL);

INSERT INTO tb_dados_familia (pai, mae, responsavel, estrutura_familiar, num_pai, num_mae, num_responsavel) 
VALUES ('Pai Teste 2', '', 'Responsável Teste', 'separados', 11999990003, NULL, 11999990004);

INSERT INTO tb_dados_familia (pai, mae, responsavel, estrutura_familiar, num_pai, num_mae, num_responsavel) 
VALUES ('', 'Mãe Teste 3', '', 'monoparental', NULL, 11999990005, NULL);

-- Escolaridade de teste
INSERT INTO tb_escolaridade (adaptacao_grupo, apoio_pedagogico, atividade_extra, contato_fora, dif_aprendizagem, dif_atencao, dif_escrita, dif_fala, dif_locomotiva, dif_visao, reprovado, serie_ano_reprovado) 
VALUES (true, false, true, true, false, false, false, false, false, false, false, '');

INSERT INTO tb_escolaridade (adaptacao_grupo, apoio_pedagogico, atividade_extra, contato_fora, dif_aprendizagem, dif_atencao, dif_escrita, dif_fala, dif_locomotiva, dif_visao, reprovado, serie_ano_reprovado) 
VALUES (true, true, false, false, true, true, false, false, false, false, true, '6º ano 2023');

INSERT INTO tb_escolaridade (adaptacao_grupo, apoio_pedagogico, atividade_extra, contato_fora, dif_aprendizagem, dif_atencao, dif_escrita, dif_fala, dif_locomotiva, dif_visao, reprovado, serie_ano_reprovado) 
VALUES (false, false, true, true, false, false, true, false, false, false, false, '');

-- Participação de teste
INSERT INTO tb_participacao (aluno_gremista1, aluno_gremista2, jovem_acolhedor1, jovem_acolhedor2, lider_turma1, lider_turma2, clube_juvenil1, clube_juvenil2, eletiva1, eletiva2) 
VALUES (true, false, false, false, true, false, 'Clube de Xadrez', '', 'Robótica', '');

INSERT INTO tb_participacao (aluno_gremista1, aluno_gremista2, jovem_acolhedor1, jovem_acolhedor2, lider_turma1, lider_turma2, clube_juvenil1, clube_juvenil2, eletiva1, eletiva2) 
VALUES (false, false, true, false, false, false, '', '', 'Teatro', '');

INSERT INTO tb_participacao (aluno_gremista1, aluno_gremista2, jovem_acolhedor1, jovem_acolhedor2, lider_turma1, lider_turma2, clube_juvenil1, clube_juvenil2, eletiva1, eletiva2) 
VALUES (false, false, false, false, false, false, '', '', '', '');

-- Ocorrências de teste
INSERT INTO tb_ocorrencia (num_bi1, num_bi2, num_bi3, num_bi4) VALUES (0, 1, 0, 0);
INSERT INTO tb_ocorrencia (num_bi1, num_bi2, num_bi3, num_bi4) VALUES (2, 1, 0, 0);
INSERT INTO tb_ocorrencia (num_bi1, num_bi2, num_bi3, num_bi4) VALUES (0, 0, 0, 0);

-- Alunos de teste (associando aos registros criados acima - IDs 4, 5, 6 para dados familiares, 4,5,6 para escolaridade, etc)
-- Nota: IDs começam após os dados iniciais do sistema
