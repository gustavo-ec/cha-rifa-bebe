# Chá Rifa da Bebê 👶

Site de rifa com pagamento via Pix (QR Code + copia e cola), painel administrativo protegido por login, e seção de doação livre.

## Funcionalidades

- 🎟️ Grade com 200 números, cada um R$ 30,00
- 📱 QR Code Pix + código copia e cola gerados automaticamente para cada número
- 🔒 Painel admin protegido por login (Supabase Auth) para confirmar pagamentos
- 💚 Seção separada de doação com valor livre
- ⚡ Atualização em tempo real entre dispositivos (Supabase Realtime)

## Primeiros passos

Veja o guia completo em **[CONFIGURACAO.md](./CONFIGURACAO.md)** — ele te leva do zero até o site publicado gratuitamente, sem precisar saber programar.

## Stack técnica

- React + Vite
- Tailwind CSS
- Supabase (banco de dados + autenticação)
- Vercel (hospedagem gratuita)

## Estrutura

```
src/
  components/      Hero, grade de números, modal de compra, doação, login
  pages/Admin.jsx  Painel administrativo
  lib/pix.js       Gerador de payload Pix (padrão BR Code / EMV)
  lib/supabaseClient.js
  config.js        Edite aqui: textos, preço, quantidade de números, dados do Pix
supabase-schema.sql  Script para criar as tabelas no Supabase
```
