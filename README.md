# Sistema de Conciliação Bancária Profissional

Este é um sistema de conciliação bancária profissional completo, desenvolvido com uma arquitetura robusta e foco em integridade e governança financeira. Ele inclui módulos de importação, conciliação inteligente, governança e controles internos, uma interface de usuário profissional e geração de relatórios detalhados.

## Estrutura do Projeto

O projeto é dividido em `backend` (Node.js com NestJS) e `frontend` (React com Vite e Tailwind CSS), com Docker para orquestração.

```
bank-reconciliation-system/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   ├── core/
│   │   └── entities/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   └── services/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── setup.sh
├── .vscode/
└── README.md
```

## Tecnologias Utilizadas

- **Backend**: Node.js, NestJS, TypeScript, TypeORM, PostgreSQL, OpenAI API (para IA), `csv-parser`, `ofx`, `pdf2json`, `jaro-winkler`.
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, `react-router-dom`, `zustand`, Axios.
- **Banco de Dados**: PostgreSQL.
- **Orquestração**: Docker, Docker Compose.
- **Servidor Web**: Nginx.

## Requisitos

- Docker Desktop (inclui Docker Engine e Docker Compose)
- Uma chave de API da OpenAI (para funcionalidades de IA).

## Como Configurar e Executar

Siga os passos abaixo para colocar o sistema em funcionamento:

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd bank-reconciliation-system
    ```

2.  **Configurar Variáveis de Ambiente:**
    Crie arquivos `.env` baseados nos exemplos fornecidos:
    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```
    Edite `backend/.env` e `frontend/.env` com suas configurações. **A chave `OPENAI_API_KEY` em `backend/.env` é essencial para as funcionalidades de IA.**

3.  **Executar o Script de Setup:**
    O script `setup.sh` irá instalar as dependências de Node.js, construir as imagens Docker, subir os serviços, executar as migrações do banco de dados e popular dados iniciais (se configurado).
    ```bash
    chmod +x setup.sh # Garante que o script é executável
    ./setup.sh
    ```

    **Observação**: O script `setup.sh` assume que `docker-compose` está disponível no PATH. Se você estiver no Windows, certifique-se de que o Docker Desktop está rodando e o terminal está configurado para executar comandos bash (ex: Git Bash, WSL). Se houver problemas com `docker-compose exec`, você pode precisar rodar os comandos manualmente dentro dos containers ou usar `winpty docker-compose exec ...` no Git Bash.

4.  **Acessar a Aplicação:**
    Após a conclusão do script de setup, a aplicação estará disponível nos seguintes endereços:
    -   **Frontend**: `http://localhost:80` (via Nginx)
    -   **Backend API**: `http://localhost:3001/api/v1` (diretamente) ou `http://localhost:80/api/v1` (via Nginx)

## Funcionalidades Principais

-   **Módulo de Importação**: Suporte a JSON, CSV, OFX e PDF (com IA/OCR para extração de dados).
-   **Conciliação Inteligente**: Comparação de lançamentos e sugestão de categorização.
-   **Governança e Controles Internos**:
    -   Trilha de auditoria completa.
    -   Princípio do "Segundo Olhar" (aprovação de supervisor).
    -   Bloqueios sistêmicos para períodos fechados e lançamentos inconsistentes.
    -   Gestão de acessos baseada em papéis (Admin, Gestor, Analista, Auditor).
-   **Interface do Usuário**: Design moderno e responsivo com painel de conciliação 'split-screen' e sinalização de status por cores.
-   **Relatórios**: Demonstração de Conciliação Bancária (DCB) e análise de variações.
-   **Validação de Saldos**: Verificação automática de saldo inicial com saldo final do mês anterior.
-   **Justificativa de Divergências**: Campo obrigatório para justificar diferenças.

## Desenvolvimento

### Backend

-   O backend é construído com NestJS, seguindo uma arquitetura modular.
-   Entidades TypeORM são mapeadas para o banco de dados PostgreSQL.
-   Os serviços utilizam injeção de dependência e seguem o padrão de repositório.

### Frontend

-   O frontend é um aplicativo React, construído com Vite.
-   Utiliza Tailwind CSS para estilização e `zustand` para gerenciamento de estado.
-   Rotas protegidas por autenticação e permissões.

## Testes

-   **Backend**: Testes unitários e de integração serão implementados para os principais serviços e controladores. (Exemplo em `backend/test/reconciliation.service.spec.ts`)
-   **Frontend**: Testes de componentes e de integração para garantir a funcionalidade da interface.

## Documentação da API

A especificação OpenAPI (Swagger) está disponível em `backend/docs/api-spec.yaml`.

---

Este projeto visa ser uma solução robusta e escalável para conciliação bancária, aderindo às melhores práticas de desenvolvimento e governança financeira.
