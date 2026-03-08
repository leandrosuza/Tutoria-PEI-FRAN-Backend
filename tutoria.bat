@echo off
chcp 65001 >nul
cls

echo ========================================
echo   TUTORIA PEI-FRAN - INICIANDO...
echo ========================================
echo.
echo Abrindo PowerShell com comandos automatizados...
echo.

REM Abrir PowerShell e executar comandos do backend
start "BACKEND - PowerShell" powershell -NoExit -Command "
    Write-Host '========================================' -ForegroundColor Cyan;
    Write-Host '  TUTORIA PEI-FRAN - BACKEND' -ForegroundColor Cyan;
    Write-Host '========================================' -ForegroundColor Cyan;
    Write-Host '';
    Write-Host '[VERIFICANDO DEPENDENCIAS...]' -ForegroundColor Yellow;
    
    # Verificar Java
    try {
        $java = java -version 2>&1
        Write-Host '[OK] Java encontrado' -ForegroundColor Green
    } catch {
        Write-Host '[ERRO] Java nao encontrado!' -ForegroundColor Red
        Write-Host 'Instale Java 21+: https://adoptium.net/' -ForegroundColor Yellow
        Read-Host 'Pressione Enter para sair'
        exit 1
    }
    
    Write-Host '';
    Write-Host '[INSTALANDO BACKEND...]' -ForegroundColor Yellow;
    Set-Location '%~dp0Tutoria-PEI-FRAN-Backend';
    & .\mvnw.cmd clean install -q;
    if ($LASTEXITCODE -ne 0) {
        Write-Host '[ERRO] Falha na instalacao!' -ForegroundColor Red
        Read-Host 'Pressione Enter'
        exit 1
    }
    Write-Host '[OK] Backend instalado!' -ForegroundColor Green;
    Write-Host '';
    Write-Host '[INICIANDO SPRING BOOT...]' -ForegroundColor Cyan;
    & .\mvnw.cmd spring-boot:run
"

timeout /t 3 >nul

REM Abrir PowerShell e executar comandos do frontend
start "FRONTEND - PowerShell" powershell -NoExit -Command "
    Write-Host '========================================' -ForegroundColor Green;
    Write-Host '  TUTORIA PEI-FRAN - FRONTEND' -ForegroundColor Green;
    Write-Host '========================================' -ForegroundColor Green;
    Write-Host '';
    Write-Host '[VERIFICANDO DEPENDENCIAS...]' -ForegroundColor Yellow;
    
    # Verificar Node.js
    try {
        $node = node --version 2>&1
        Write-Host '[OK] Node.js encontrado' -ForegroundColor Green
    } catch {
        Write-Host '[ERRO] Node.js nao encontrado!' -ForegroundColor Red
        Write-Host 'Instale Node.js 18+: https://nodejs.org/' -ForegroundColor Yellow
        Read-Host 'Pressione Enter para sair'
        exit 1
    }
    
    # Verificar npm
    try {
        $npm = npm --version 2>&1
        Write-Host '[OK] npm encontrado' -ForegroundColor Green
    } catch {
        Write-Host '[ERRO] npm nao encontrado!' -ForegroundColor Red
        Read-Host 'Pressione Enter para sair'
        exit 1
    }
    
    Write-Host '';
    Write-Host '[INSTALANDO FRONTEND...]' -ForegroundColor Yellow;
    Set-Location '%~dp0fronttutoria';
    & npm install --quiet;
    if ($LASTEXITCODE -ne 0) {
        Write-Host '[ERRO] Falha na instalacao!' -ForegroundColor Red
        Read-Host 'Pressione Enter'
        exit 1
    }
    Write-Host '[OK] Frontend instalado!' -ForegroundColor Green;
    Write-Host '';
    Write-Host '[INICIANDO VITE...]' -ForegroundColor Green;
    & npm run dev -- --host
"

timeout /t 2 >nul

cls
echo ========================================
echo   TUTORIA PEI-FRAN - APLICACOES INICIADAS
echo ========================================
echo.
echo Duas janelas do PowerShell foram abertas:
echo   - BACKEND: Compilando e iniciando Spring Boot
echo   - FRONTEND: Instalando e iniciando React
echo.
echo Aguarde a instalacao completar em ambas as janelas.
echo.
echo URLs de acesso:
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:3000
echo   Rede:     http://SEU_IP:3000
echo.
pause
