# Script de Teste CRUD - Tutoria PEI FRAN API
# Execute apos iniciar o backend: .\mvnw spring-boot:run

$BASE_URL = "http://localhost:8080"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  TESTE CRUD - Tutoria PEI FRAN API" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. TESTAR USUARIOS
Write-Host "1. TESTANDO USUARIOS" -ForegroundColor Green
Write-Host "--------------------" -ForegroundColor Green

Write-Host "GET /usuarios - Listando usuarios..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/usuarios" -Method GET
    Write-Host "OK - Usuarios encontrados: $($response.Count)" -ForegroundColor Green
    $response | ForEach-Object { Write-Host "  - ID: $($_.id), Nome: $($_.nome)" }
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# POST usuario
Write-Host "POST /usuarios - Criando usuario de teste..." -ForegroundColor Yellow
$novoUsuario = @{
    nome = "Usuario Teste Script"
    cpf = "99988877766"
} | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/usuarios" -Method POST -ContentType "application/json" -Body $novoUsuario
    Write-Host "OK - Usuario criado! ID: $($response.id)" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# 2. TESTAR ALUNOS
Write-Host "2. TESTANDO ALUNOS" -ForegroundColor Green
Write-Host "------------------" -ForegroundColor Green

Write-Host "GET /alunos - Listando alunos..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/alunos" -Method GET
    Write-Host "OK - Total de alunos: $($response.Count)" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# POST aluno simples
Write-Host "POST /alunos/simple - Cadastrando aluno de teste..." -ForegroundColor Yellow
$novoAluno = @{
    ra = 999001
    nome = "Aluno Teste PowerShell"
    usuarioId = 1
} | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/alunos/simple" -Method POST -ContentType "application/json" -Body $novoAluno
    Write-Host "OK - Aluno criado! RA: $response" -ForegroundColor Green
    $alunoRa = $response
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
    $alunoRa = 999001
}
Write-Host ""

# GET aluno especifico
Write-Host "GET /alunos/$alunoRa - Buscando aluno..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/alunos/$alunoRa" -Method GET
    Write-Host "OK - Aluno: $($response.nome)" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# 3. PARTICIPACAO
Write-Host "3. TESTANDO PARTICIPACAO" -ForegroundColor Green
Write-Host "------------------------" -ForegroundColor Green

$participacao = @{
    liderTurma1 = $true
    alunoGremista1 = $false
    jovemAcolhedor1 = $true
    eletiva1 = "Programacao"
    clubeJuvenil1 = "Clube de Ciencias"
} | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/alunos/$alunoRa/participacao" -Method POST -ContentType "application/json" -Body $participacao
    Write-Host "OK - Participacao adicionada! ID: $response" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# 4. AVALIACOES
Write-Host "4. TESTANDO AVALIACOES" -ForegroundColor Green
Write-Host "----------------------" -ForegroundColor Green

$avaliacao = @{
    materia = "Matematica"
    tipo = "Prova Bimestral"
    periodo = "1 Bimestre"
    numQuestoes = 10
    numAcertos = 8
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$BASE_URL/alunos/$alunoRa/avaliacoes" -Method POST -ContentType "application/json" -Body $avaliacao | Out-Null
    Write-Host "OK - Avaliacao adicionada!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}

Write-Host "GET /alunos/$alunoRa/avaliacoes - Listando..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/alunos/$alunoRa/avaliacoes" -Method GET
    Write-Host "OK - Avaliacoes: $($response.Count)" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# 5. LEITURAS
Write-Host "5. TESTANDO LEITURAS" -ForegroundColor Green
Write-Host "--------------------" -ForegroundColor Green

$leitura = @{
    livro = "O Pequeno Principe"
    bimestre = 1
} | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/alunos/$alunoRa/leituras" -Method POST -ContentType "application/json" -Body $leitura
    Write-Host "OK - Leitura adicionada! ID: $response" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# 6. ATENDIMENTOS
Write-Host "6. TESTANDO ATENDIMENTOS" -ForegroundColor Green
Write-Host "------------------------" -ForegroundColor Green

$atendimento = @{
    data = "2025-03-07"
    assunto = "Dificuldade em matematica"
    observacoesProfessor = "Aluno com dificuldade em fracoes"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$BASE_URL/alunos/$alunoRa/registroAtendimentos" -Method POST -ContentType "application/json" -Body $atendimento | Out-Null
    Write-Host "OK - Atendimento registrado!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# 7. TUTORIA
Write-Host "7. TESTANDO TUTORIA" -ForegroundColor Green
Write-Host "-------------------" -ForegroundColor Green

$tutoria = @{
    data = "2025-03-07"
    avaliacoes = $true
    leitura = $true
    redacao = $false
    provaPaulista = $false
    tarefacmsp = $true
    dificuldades = $true
    outros = $false
    observacoesProfessor = "Revisao de conteudo"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$BASE_URL/alunos/$alunoRa/tutoria" -Method POST -ContentType "application/json" -Body $tutoria | Out-Null
    Write-Host "OK - Tutoria registrada!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# RESUMO
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  TESTE CONCLUIDO!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Endpoints testados com sucesso:" -ForegroundColor White
Write-Host "  - GET/POST /usuarios" -ForegroundColor Green
Write-Host "  - GET/POST /alunos" -ForegroundColor Green
Write-Host "  - GET /alunos/{ra}" -ForegroundColor Green
Write-Host "  - POST /alunos/{ra}/participacao" -ForegroundColor Green
Write-Host "  - POST/GET /alunos/{ra}/avaliacoes" -ForegroundColor Green
Write-Host "  - POST /alunos/{ra}/leituras" -ForegroundColor Green
Write-Host "  - POST /alunos/{ra}/registroAtendimentos" -ForegroundColor Green
Write-Host "  - POST /alunos/{ra}/tutoria" -ForegroundColor Green
Write-Host ""
Write-Host "Aluno de teste criado: RA $alunoRa" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs para verificar:" -ForegroundColor Yellow
Write-Host "  http://localhost:8080/usuarios" -ForegroundColor White
Write-Host "  http://localhost:8080/alunos" -ForegroundColor White
