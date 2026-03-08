# FrontTutoria - Frontend React + Vite

Interface web moderna para o sistema Tutoria PEI FRAN.

## Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Estilização utilitária
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## Estrutura

```
fronttutoria/
├── index.html              # HTML principal
├── package.json            # Dependências
├── tailwind.config.js      # Config Tailwind
├── vite.config.ts          # Config Vite + proxy
├── tsconfig.json           # Config TypeScript
└── src/
    ├── main.tsx            # Entry point
    ├── App.tsx             # Layout com rotas
    ├── index.css           # Estilos globais
    ├── vite-env.d.ts       # Tipos Vite
    ├── types/
    │   └── index.ts        # Interfaces TypeScript
    ├── services/
    │   └── api.ts          # Serviços de API
    ├── pages/
    │   ├── Dashboard.tsx   # Dashboard com estatísticas
    │   ├── Usuarios.tsx    # Gestão de usuários
    │   └── Alunos.tsx      # Gestão de alunos
    └── components/         # Componentes reutilizáveis
```

## Instalação

### 1. Instalar dependências

```bash
cd fronttutoria
npm install
```

### 2. Iniciar backend primeiro

```bash
cd ../Tutoria-PEI-FRAN-Backend
.\mvnw spring-boot:run
```

### 3. Iniciar frontend

```bash
cd fronttutoria
npm run dev
```

Acesse: `http://localhost:3000`

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run preview` | Visualiza build de produção |

## Configuração de Proxy

O Vite está configurado com proxy para o backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

Isso evita problemas de CORS durante desenvolvimento.

## Funcionalidades implementadas

- ✅ Dashboard com estatísticas
- ✅ Listagem de usuários
- ✅ Cadastro de usuários
- ✅ Listagem de alunos
- ✅ Cadastro de alunos
- ✅ Busca/filtro em listas
- ✅ Layout responsivo (mobile/desktop)
- ✅ Navegação lateral

## Próximos passos sugeridos

- [ ] Página de detalhes do aluno
- [ ] Cadastro de avaliações
- [ ] Registro de participação
- [ ] Controle de leituras
- [ ] Registro de atendimentos
- [ ] Gestão de tutorias
- [ ] Autenticação/login
- [ ] Exportar dados para PDF/Excel

## API Endpoints consumidos

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/usuarios` | GET | Lista usuários |
| `/usuarios` | POST | Cria usuário |
| `/usuarios/:id` | DELETE | Remove usuário |
| `/alunos` | GET | Lista alunos |
| `/alunos/simple` | POST | Cria aluno |
| `/alunos/:ra` | DELETE | Remove aluno |

## Deploy

Para produção:

```bash
npm run build
```

Os arquivos estáticos serão gerados em `dist/`.

## Dúvidas?

Verifique se:
1. Backend está rodando na porta 8080
2. Node.js 18+ está instalado
3. Dependências foram instaladas (`npm install`)
