# Dependências Frontend - React + TypeScript + Vite

## Pré-requisitos Necessários:
- **Node.js 18+** (recomendado 20+)
- **npm** (geralmente vem com Node.js)

## Dependências Principais (já configuradas no package.json):

### Framework e Bibliotecas React
- `react` ^18.2.0 - Framework principal
- `react-dom` ^18.2.0 - Renderização DOM
- `react-router-dom` ^6.21.0 - Roteamento

### Estado e Requisições HTTP
- `axios` ^1.6.2 - Cliente HTTP
- `react-query` ^3.39.3 - Cache e gerenciamento de estado
- `zustand` ^4.4.7 - Gerenciamento de estado local

### UI e Estilização
- `lucide-react` ^0.294.0 - Ícones
- `clsx` ^2.0.0 - Utilitário de classes
- `tailwind-merge` ^2.2.0 - Merge de classes Tailwind

### Ferramentas de Desenvolvimento
- `vite` ^5.0.8 - Build tool
- `typescript` ^5.2.2 - Tipagem
- `tailwindcss` ^3.4.0 - Framework CSS
- `autoprefixer` ^10.4.16 - Prefixos CSS
- `postcss` ^8.4.32 - Processador CSS

## Como Instalar:

### 1. Instalar Node.js:
```bash
# Windows (usando winget)
winget install OpenJS.NodeJS

# Ou baixe de: https://nodejs.org/
```

### 2. Verificar Instalação:
```bash
node --version
npm --version
```

### 3. Instalar Dependências do Frontend:
```bash
cd fronttutoria
npm install
```

### 4. Executar Frontend:
```bash
cd fronttutoria
npm run dev -- --host
```

## Porta Padrão:
- Frontend roda na porta **3000**
- Acesso: http://localhost:3000
- Para acesso na rede: http://SEU_IP:3000

## Comandos Úteis:
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
```
