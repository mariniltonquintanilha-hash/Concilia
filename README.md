![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

# Concilia — Sistema de Conciliação Bancária

> Sistema de conciliação bancária profissional com arquitetura robusta, foco em integridade e governança financeira.

## 📌 Sobre o Projeto

Plataforma completa de conciliação bancária com módulos de **importação**, **conciliação inteligente**, **governança e controles internos**, interface profissional e geração de **relatórios detalhados**.

O projeto é dividido em `backend` (Node.js com NestJS) e `frontend` (React com Vite e Tailwind CSS), com orquestração via Docker.

## ✨ Funcionalidades

- 📥 Importação de extratos e transações bancárias
- 🤝 Conciliação inteligente com regras automatizadas
- 🛡️ Governança, trilha de auditoria e controles internos
- 📊 Relatórios detalhados de conciliação
- 📖 API REST documentada (OpenAPI / Swagger)
- 🖥️ Frontend moderno e responsivo (React + Tailwind)
- 🐳 Orquestração completa com Docker

## 🚀 Como Executar

### Com Docker

```bash
docker compose up
```

### Manual — Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

### Manual — Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
├── backend/                  → API NestJS
│   ├── src/
│   │   ├── modules/          → Módulos de negócio
│   │   ├── core/             → Config, banco e migrações
│   │   └── entities/         → Entidades do domínio
│   ├── docs/api-spec.yaml    → Especificação da API
│   └── Dockerfile
├── frontend/                 → Interface React + Vite + Tailwind
└── docker-compose.yml
```

## 📄 Licença

Projeto desenvolvido para fins de portfólio.
