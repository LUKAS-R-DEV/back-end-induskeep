# Configuração Web Push API

Este documento explica como configurar as notificações push no sistema.

## Pré-requisitos

1. Node.js instalado
2. Acesso ao terminal
3. Variáveis de ambiente configuradas

## Passo 1: Gerar VAPID Keys

As VAPID keys são necessárias para autenticar o servidor com os serviços de push (Google, Mozilla, etc).

Execute o seguinte comando no diretório `backend`:

```bash
npx web-push generate-vapid-keys
```

Isso gerará duas chaves:
- **Public Key**: Chave pública que será usada no frontend
- **Private Key**: Chave privada que deve ser mantida em segredo

## Passo 2: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env` do backend:

```env
VAPID_PUBLIC_KEY=sua_chave_publica_aqui
VAPID_PRIVATE_KEY=sua_chave_privada_aqui
VAPID_SUBJECT=mailto:seu-email@exemplo.com
```

**Importante:**
- `VAPID_SUBJECT` deve ser um email válido ou uma URL `mailto:`
- Mantenha a `VAPID_PRIVATE_KEY` em segredo
- A `VAPID_PUBLIC_KEY` será exposta ao frontend

## Passo 3: Verificar Configuração

Após configurar as variáveis, reinicie o servidor backend e verifique se a rota `/api/push-subscriptions/vapid-key` retorna a chave pública.

## Como Funciona

1. **Frontend**: Solicita permissão do usuário para notificações
2. **Service Worker**: Registra o service worker para receber notificações
3. **Subscription**: Cria uma subscription e envia para o backend
4. **Backend**: Armazena a subscription no banco de dados
5. **Notificações**: Quando uma notificação é criada, o backend envia push para todos os dispositivos do usuário

## Suporte de Navegadores

- ✅ Chrome/Edge (Windows, Android)
- ✅ Firefox (Windows, Android)
- ✅ Safari (macOS, iOS) - Requer configuração adicional
- ❌ Safari (iOS) - Suporte limitado

## Troubleshooting

### Erro: "VAPID keys não configuradas"
- Verifique se as variáveis de ambiente estão definidas
- Reinicie o servidor após adicionar as variáveis

### Notificações não aparecem
- Verifique se o usuário concedeu permissão
- Verifique se o service worker está registrado
- Verifique o console do navegador para erros

### Subscription não é criada
- Verifique se a chave pública VAPID está correta
- Verifique se o endpoint está acessível
- Verifique os logs do servidor

## Segurança

- Nunca exponha a chave privada VAPID
- Use HTTPS em produção (obrigatório para Web Push)
- Mantenha as subscriptions atualizadas (remova inválidas)



