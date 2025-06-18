# ZAP Serv - Plataforma de Serviços Dockerizada

![ZAP Serv Logo](https://via.placeholder.com/150x50?text=ZAP+Serv)
Link do Arquivo MP4: https://drive.google.com/file/d/1GHsZrDCKWpriHIBhfcEhhwmYP6VE3GMK/view?usp=sharing

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Requisitos](#requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Acesso ao Sistema](#acesso-ao-sistema)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Dockerização](#dockerização)
- [Solução de Problemas](#solução-de-problemas)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🔍 Visão Geral

ZAP Serv é uma plataforma que conecta prestadores de serviços domésticos com clientes. Os clientes podem solicitar serviços, e os prestadores podem aceitar e gerenciar esses serviços. O sistema inclui funcionalidades de agendamento, mensagens, avaliações e gerenciamento de perfil.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada em microserviços containerizados com Docker:

- **Frontend**: Interface de usuário desenvolvida em React
- **Backend**: API RESTful desenvolvida em PHP
- **Banco de Dados**: MySQL para armazenamento de dados
- **Armazenamento de Arquivos**: MinIO (compatível com S3) para armazenamento de imagens
- **Servidor Web**: Nginx para servir a aplicação e gerenciar requisições

![Arquitetura](https://via.placeholder.com/800x400?text=Arquitetura+do+Sistema)

## 💻 Tecnologias Utilizadas

- **Frontend**:
  - React 
  - Bootstrap 5
  - React Router
  - Axios

- **Backend**:
  - PHP 8.1
  - AWS SDK para PHP (comunicação com MinIO)

- **Banco de Dados**:
  - MySQL 8.0

- **Armazenamento**:
  - MinIO (compatível com S3)

- **Infraestrutura**:
  - Docker
  - Docker Compose
  - Nginx

## 📁 Estrutura do Projeto

```
trabalhoFinalWeb/
├── app/                    # Código backend PHP
│   ├── config/             # Configurações
│   ├── controllers/        # Controladores
│   ├── core/               # Classes principais
│   ├── helpers/            # Funções auxiliares
│   ├── models/             # Modelos de dados
│   ├── public/             # Ponto de entrada da API
│   ├── services/           # Serviços
│   └── views/              # Templates
├── db/                     # Scripts de banco de dados
│   └── init.sql            # Script de inicialização
├── frontend/               # Código frontend React
│   ├── public/             # Arquivos estáticos
│   ├── src/                # Código fonte React
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── styles/         # Estilos CSS
│   ├── Dockerfile          # Dockerfile para produção
│   └── Dockerfile.dev      # Dockerfile para desenvolvimento
├── nginx/                  # Configuração do Nginx
│   └── default.conf        # Configuração principal
├── php/                    # Configuração do PHP
│   └── Dockerfile          # Dockerfile do PHP
├── uploads/                # Diretório para uploads
├── docker-compose.yml      # Configuração do Docker Compose
└── README.md               # Este arquivo
```

## 📋 Requisitos

- Docker
- Docker Compose
- Git (opcional, para clonar o repositório)

## 🚀 Instalação e Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/trabalhoFinalWeb.git
   cd trabalhoFinalWeb
   ```

2. **Inicie os contêineres Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Verifique se todos os contêineres estão em execução**:
   ```bash
   docker-compose ps
   ```

4. **Inicialize os dados de exemplo** (opcional):
   - Acesse http://localhost:8000/requests
   - Clique no botão "Inicializar Dados"

## 🖥️ Uso

Após a instalação, você pode acessar:

- **Frontend (Aplicação principal)**: http://localhost:8000
- **API Backend**: http://localhost:8000/api
- **MinIO Console (Gerenciamento de arquivos)**: http://localhost:9001

## ✨ Funcionalidades

### Para Clientes
- Criar solicitações de serviço
- Agendar serviços
- Avaliar prestadores
- Gerenciar perfil
- Comunicar-se com prestadores

### Para Prestadores
- Visualizar solicitações disponíveis
- Aceitar/recusar serviços
- Gerenciar agenda
- Comunicar-se com clientes
- Receber avaliações

### Para Administradores
- Gerenciar usuários
- Monitorar solicitações
- Visualizar estatísticas
- Configurar sistema

## 🔑 Acesso ao Sistema

### Acesso Administrativo
- **URL**: http://localhost:8000/admin
- **Credenciais**:
  - Usuário: admin
  - Senha: admin

### Usuários de Teste
- **Cliente**: 
  - Email: john@example.com
  - Senha: password
- **Prestador**: 
  - Email: jane@example.com
  - Senha: password

## 🗄️ Estrutura do Banco de Dados

O banco de dados "marido_aluguel" contém as seguintes tabelas principais:

- **users**: Informações dos usuários (clientes, prestadores, administradores)
- **service_providers**: Dados específicos dos prestadores de serviço
- **service_requests**: Solicitações de serviço criadas pelos clientes
- **request_photos**: Fotos associadas às solicitações
- **reviews**: Avaliações dos prestadores pelos clientes
- **appointments**: Agendamentos de serviços

![Diagrama ER](https://via.placeholder.com/800x400?text=Diagrama+ER)

## 🐳 Dockerização

### Contêineres

1. **Web (Nginx)**
   - **Imagem**: nginx:alpine
   - **Porta**: 8000:80
   - **Volumes**: 
     - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
     - ./:/var/www
     - ./uploads:/var/www/uploads

2. **PHP**
   - **Imagem**: Personalizada baseada em php:8.1-fpm
   - **Volumes**: 
     - ./:/var/www
     - ./uploads:/var/www/uploads

3. **Frontend (React)**
   - **Imagem**: Personalizada baseada em node:16-alpine
   - **Volumes**: ./frontend:/app
   - **Variáveis de ambiente**: REACT_APP_API_URL=http://localhost:8000/api

4. **DB (MySQL)**
   - **Imagem**: mysql:8.0
   - **Porta**: 3307:3306
   - **Volumes**: 
     - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
     - mysql_data:/var/lib/mysql
   - **Credenciais**:
     - Database: marido_aluguel
     - User: user
     - Password: senha_user

5. **File-storage (MinIO)**
   - **Imagem**: minio/minio
   - **Portas**: 
     - 9000:9000 (API)
     - 9001:9001 (Console)
   - **Volumes**: minio_data:/data
   - **Credenciais**:
     - User: minio_user
     - Password: minio_password

6. **MinIO-setup**
   - **Imagem**: minio/mc
   - **Função**: Configura buckets e políticas do MinIO

### Redes e Volumes

- **Rede**: app-network (bridge)
- **Volumes**:
  - mysql_data: Armazena dados do MySQL
  - minio_data: Armazena arquivos do MinIO

## ❓ Solução de Problemas

### Docker Daemon não está em execução
Se você encontrar erros como:
```
error during connect: this error may indicate that the docker daemon is not running
```

**Solução:**
1. Verifique se o Docker Desktop está instalado e em execução
2. Inicie o Docker Desktop pelo menu Iniciar do Windows
3. Aguarde até que o serviço seja inicializado completamente
4. Verifique o status com `docker info`

### Conflitos de porta
Se algum serviço não iniciar devido a conflitos de porta:

**Solução:**
1. Verifique quais processos estão usando as portas necessárias:
   ```bash
   netstat -ano | findstr "8000"
   netstat -ano | findstr "3306"
   ```
2. Encerre os processos conflitantes ou altere as portas no docker-compose.yml

### Botões ou funcionalidades da interface não funcionam
Se algum botão ou funcionalidade da interface não estiver funcionando corretamente:

**Solução:**
1. Verifique os logs do contêiner frontend:
   ```bash
   docker-compose logs frontend
   ```
2. Abra o console do navegador (F12) para verificar erros JavaScript
3. Verifique se os dados estão sendo carregados corretamente
4. Reinicie o contêiner frontend:
   ```bash
   docker-compose restart frontend
   ```

### Controle de acesso e segurança
Se houver problemas com o controle de acesso:

**Solução:**
1. Limpe o localStorage do navegador para remover tokens e dados de sessão
2. Verifique se as rotas estão protegidas adequadamente

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido por [Seu Nome] - [Ano]
