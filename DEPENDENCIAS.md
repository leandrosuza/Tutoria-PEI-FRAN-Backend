# Dependências Backend - Java Spring Boot

## Pré-requisitos Necessários:
- **Java 21** (ou superior)
- **Maven 3.6+** (gerenciador de dependências)

## Dependências Principais (já configuradas no pom.xml):

### Framework Spring Boot
- `spring-boot-starter-parent` 3.5.5
- `spring-boot-starter-data-jpa` - Persistência de dados
- `spring-boot-starter-web` - Aplicações web REST

### Banco de Dados
- `sqlite-jdbc` 3.45.3.0 - Driver SQLite
- `hibernate-community-dialects` - Dialetos Hibernate para SQLite

## Como Instalar:

### 1. Instalar Java 21:
```bash
# Windows (usando winget)
winget install Microsoft.OpenJDK.21

# Ou baixe de: https://adoptium.net/
```

### 2. Instalar Maven:
```bash
# Windows (usando winget)
winget install Apache.Maven

# Ou baixe de: https://maven.apache.org/download.cgi
```

### 3. Verificar Instalações:
```bash
java -version
mvn -version
```

### 4. Instalar Dependências do Backend:
```bash
cd Tutoria-PEI-FRAN-Backend
mvn clean install
```

### 5. Executar Backend:
```bash
cd Tutoria-PEI-FRAN-Backend
.\mvnw spring-boot:run
```

## Porta Padrão:
- Backend roda na porta **8080**
- Acesso: http://localhost:8080
