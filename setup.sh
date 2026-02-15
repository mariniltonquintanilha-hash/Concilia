#!/bin/bash
# setup.sh

echo "Iniciando a instalação do projeto..."

# Instalar dependências do backend
echo "Instalando dependências do backend..."
cd bank-reconciliation-system/backend
npm install
cd ../..

# Instalar dependências do frontend
echo "Instalando dependências do frontend..."
cd bank-reconciliation-system/frontend
npm install
cd ../..

# Configurar variáveis de ambiente
echo "Copiando .env.example para .env no backend e frontend..."
cp bank-reconciliation-system/backend/.env.example bank-reconciliation-system/backend/.env
cp bank-reconciliation-system/frontend/.env.example bank-reconciliation-system/frontend/.env

# Build das imagens Docker
echo "Construindo imagens Docker..."
docker-compose build

# Iniciar serviços
echo "Iniciando serviços Docker..."
docker-compose up -d

# Aguardar o PostgreSQL estar pronto (exemplo simplificado)
echo "Aguardando o PostgreSQL iniciar..."
sleep 10 # Ajuste conforme necessário

# Executar migrações do banco de dados
echo "Executando migrações do banco de dados..."
docker-compose exec backend npm run migration:run

# Popular dados iniciais (se houver)
echo "Populando dados iniciais..."
docker-compose exec backend npm run seed

echo "Configuração e inicialização concluídas!"
echo "Você pode acessar o frontend em http://localhost:80"
echo "O backend está disponível em http://localhost:3001/api/v1 (ou via Nginx em http://localhost/api/v1)"
