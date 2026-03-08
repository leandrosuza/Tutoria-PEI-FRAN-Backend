@echo off
echo ========================================
echo   TUTORIA PEI-FRAN - SETUP AUTOMATIZADO
echo ========================================
echo.

REM Verificar dependencias
echo [VERIFICANDO DEPENDENCIAS]
echo.

java -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado
    pause
    exit /b 1
)
echo [OK] Java

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado
    pause
    exit /b 1
)
echo [OK] Node.js

echo.
echo [!] Maven: Usando wrapper (mvnw)
echo.

REM Instalar backend
echo [INSTALANDO BACKEND...]
cd Tutoria-PEI-FRAN-Backend 2>nul
if errorlevel 1 (
    echo [ERRO] Pasta Tutoria-PEI-FRAN-Backend nao encontrada
    pause
    exit /b 1
)
call mvnw clean install -q
cd ..
echo [OK] Backend instalado
echo.

REM Instalar frontend
echo [INSTALANDO FRONTEND...]
cd fronttutoria 2>nul
if errorlevel 1 (
    echo [ERRO] Pasta fronttutoria nao encontrada
    pause
    exit /b 1
)
call npm install --quiet
cd ..
echo [OK] Frontend instalado
echo.

REM Iniciar aplicacoes
echo ========================================
echo   INICIANDO APLICACOES
echo ========================================
echo.

echo.
echo [INICIANDO EM NOVAS JANELAS...]
echo.

REM Iniciar Backend em nova janela visível
start "BACKEND - Spring Boot" cmd /k "cd Tutoria-PEI-FRAN-Backend && .\mvnw spring-boot:run"

timeout /t 5 /nobreak >nul

REM Iniciar Frontend em nova janela visível  
start "FRONTEND - React" cmd /k "cd fronttutoria && npm run dev -- --host"

echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Acesso na rede: http://SEU_IP:3000
echo.
pause
