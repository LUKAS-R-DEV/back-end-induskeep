# Backend - Sistema de Manutenção IndusKeep

Backend Node.js/Express para o sistema de gestão de manutenção industrial.

## 🚀 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

**IMPORTANTE:** Para produção, gere um novo JWT_SECRET seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Veja mais detalhes em [ENV_SETUP.md](./ENV_SETUP.md)

### 3. Configurar Banco de Dados

Execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

### 4. Popular Banco de Dados (Opcional)

```bash
npm run seed
```

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

## 📋 Variáveis de Ambiente Necessárias

- `DATABASE_URL` - URL de conexão com o PostgreSQL
- `JWT_SECRET` - Chave secreta para assinatura de tokens JWT (gerar novo para produção)
- `PORT` - Porta do servidor (padrão: 3000)
- `NODE_ENV` - Ambiente (development/production)
- `FRONTEND_URL` - URL do frontend para CORS

## 🔐 Segurança

⚠️ **NUNCA** commite o arquivo `.env` no repositório!

Para produção:
- Gere um JWT_SECRET único e seguro
- Use variáveis de ambiente do sistema ou serviços de gerenciamento de secrets
- Configure CORS adequadamente para o domínio de produção

## 📚 Documentação Adicional

- [Configuração de Variáveis de Ambiente](./ENV_SETUP.md)










