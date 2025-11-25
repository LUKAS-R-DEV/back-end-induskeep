# Configuração de Variáveis de Ambiente

Este documento descreve as variáveis de ambiente necessárias para o funcionamento do backend.

## Variáveis Obrigatórias

Crie um arquivo `.env` na raiz do diretório `backend/` com as seguintes variáveis:

```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/induskeep?schema=public"

# JWT Secret - GERE UM NOVO PARA PRODUÇÃO!
# Use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="6299e2ba17cbf4d6b2a1e350b30577f9f567634783767245e4ca14edecc632467dda7fb7f557b043c8443c10a712baadea38443cec10513a1d356535e212c892"

# Porta do Servidor
PORT=3000

# Ambiente (development, production)
NODE_ENV="development"

# URL do Frontend (para CORS)
FRONTEND_URL="http://localhost:5173"
```

## Gerando um JWT_SECRET Seguro

**IMPORTANTE:** Para produção, você DEVE gerar um novo JWT_SECRET único e seguro.

### Método 1: Usando Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Método 2: Usando OpenSSL
```bash
openssl rand -hex 64
```

### Método 3: Usando Python
```bash
python3 -c "import secrets; print(secrets.token_hex(64))"
```

## Variáveis Opcionais

```env
# Configurações de Email (se necessário)
# EMAIL_SERVICE_API_KEY=""
# EMAIL_FROM=""
```

## Segurança

⚠️ **NUNCA** commite o arquivo `.env` no repositório Git!

- O arquivo `.env` deve estar no `.gitignore`
- Use variáveis de ambiente do sistema ou serviços de gerenciamento de secrets em produção
- Gere um JWT_SECRET único para cada ambiente (desenvolvimento, staging, produção)
- Mantenha o JWT_SECRET em segredo e não o compartilhe

## Exemplo para Deploy

Para deploy em produção, configure as variáveis de ambiente diretamente no serviço de hospedagem:

- **Heroku**: Use `heroku config:set JWT_SECRET=seu_secret_aqui`
- **Railway**: Configure nas variáveis de ambiente do projeto
- **Vercel/Netlify**: Configure nas variáveis de ambiente do projeto
- **Docker**: Use `-e JWT_SECRET=seu_secret_aqui` ou um arquivo `.env`










