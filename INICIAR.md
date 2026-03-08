# 🚀 INICIAR PROJETO - INSTRUÇÕES

## ⚡ MÉTODO RÁPIDO (Execute no CMD, não PowerShell)

### 1. Abra o Prompt de Comando (CMD)
Pressione `Win + R`, digite `cmd` e pressione Enter

### 2. Navegue até a pasta do projeto
```cmd
cd C:\Users\SOUZAS\Desktop\backjava
```

### 3. Execute o script
```cmd
iniciar.bat
```

---

## 📋 MÉTODO MANUAL (Se o script falhar)

### Terminal 1 - Backend:
```cmd
cd C:\Users\SOUZAS\Desktop\backjava\Tutoria-PEI-FRAN-Backend
.\mvnw spring-boot:run
```

### Terminal 2 - Frontend:
```cmd
cd C:\Users\SOUZAS\Desktop\backjava\fronttutoria
npm run dev -- --host
```

---

## 🌐 ACESSO NA REDE

Depois de iniciar:
- **Frontend**: http://10.234.170.209:3000
- **Backend**: http://10.234.170.209:8080

---

## ⚠️ IMPORTANTE

- **Use CMD (Prompt de Comando)**, não PowerShell
- Aguarde o backend iniciar antes de usar o frontend
- O Maven é baixado automaticamente (não precisa instalar)

---

## 🔧 DEPENDÊNCIAS NECESSÁRIAS

1. **Java 21+** - https://adoptium.net/
2. **Node.js 18+** - https://nodejs.org/

Maven é opcional (usa wrapper `mvnw`)
