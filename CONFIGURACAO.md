# Guia de configuração — Chá Rifa da Bebê

Este guia te leva do zero até o site no ar, de graça. São 3 partes:
1. Configurar o banco de dados (Supabase)
2. Criar seu login de administrador
3. Publicar o site (Vercel)

Não precisa saber programar para seguir os passos — é só clicar e colar.

---

## Parte 1 — Criar o banco de dados (Supabase)

O Supabase é gratuito e guarda os dados de quais números estão livres, reservados ou pagos.

1. Acesse **https://supabase.com** e clique em **Start your project**. Crie uma conta (pode ser com GitHub ou Google).
2. Clique em **New Project**.
   - Dê um nome, ex: `rifa-bebe`
   - Crie uma senha forte para o banco (guarde em lugar seguro, mas você não vai precisar usá-la no dia a dia)
   - Escolha a região mais próxima do Brasil (ex: `South America (São Paulo)`)
   - Clique em **Create new project** e aguarde alguns minutos
3. Quando o projeto estiver pronto, no menu lateral clique no ícone de **SQL Editor**.
4. Clique em **New query**.
5. Abra o arquivo `supabase-schema.sql` (está na pasta do projeto que te entreguei), copie **todo** o conteúdo, e cole no editor do Supabase.
6. Clique em **Run** (ou aperte Ctrl+Enter). Isso vai criar as tabelas e os 200 números da rifa automaticamente.

### Pegar as chaves de conexão

1. No menu lateral, clique no ícone de engrenagem **Project Settings**.
2. Clique em **API**.
3. Você vai precisar de dois valores:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (uma chave longa)
4. Guarde os dois — vai usar daqui a pouco.

---

## Parte 2 — Criar seu login de administrador

Esse é o login que você vai usar para acessar `/admin` e marcar números como pagos.

1. No Supabase, vá em **Authentication** (ícone de pessoa, no menu lateral).
2. Clique em **Users** → **Add user** → **Create new user**.
3. Preencha:
   - **Email**: o e-mail que você quer usar para logar (pode ser o seu pessoal)
   - **Password**: uma senha forte, só sua
   - Deixe **Auto Confirm User** marcado
4. Clique em **Create user**.

Pronto — esse e-mail e senha são o que você vai digitar na tela `/admin` do site.

---

## Parte 3 — Rodar localmente (opcional, para testar antes de publicar)

Se quiser ver o site no seu computador antes de publicar:

1. Na pasta do projeto, copie o arquivo `.env.example` e renomeie a cópia para `.env`.
2. Abra o `.env` e preencha:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
3. No terminal, dentro da pasta do projeto, rode:
   ```
   npm install
   npm run dev
   ```
4. Abra o endereço que aparecer (geralmente `http://localhost:5173`).

---

## Parte 4 — Publicar de graça (Vercel)

1. Acesse **https://vercel.com** e crie uma conta gratuita (pode ser com GitHub).
2. Se ainda não tiver, suba o código do projeto para um repositório no **GitHub**:
   - Crie uma conta em https://github.com se não tiver
   - Crie um novo repositório (ex: `rifa-bebe`)
   - Suba os arquivos do projeto para lá (o GitHub Desktop é a forma mais fácil se você não usa terminal: https://desktop.github.com)
3. No painel da Vercel, clique em **Add New** → **Project**.
4. Selecione o repositório `rifa-bebe` que você acabou de criar.
5. Na tela de configuração, abra **Environment Variables** e adicione:
   - `VITE_SUPABASE_URL` → cole sua Project URL
   - `VITE_SUPABASE_ANON_KEY` → cole sua anon public key
6. Clique em **Deploy**. Em cerca de 1 minuto seu site estará no ar com um link tipo `rifa-bebe.vercel.app`.

Pronto! Compartilhe esse link com a família e amigos. Para acessar o painel de controle, vá em `rifa-bebe.vercel.app/admin` e entre com o e-mail/senha que você criou na Parte 2.

---

## Como usar no dia a dia

- **Comprador**: acessa o site, escolhe um número livre (verde claro), preenche nome, vê o QR Code Pix, paga, e clica em "Já paguei". O número fica **reservado** (rosa) até você confirmar.
- **Você (admin)**: acessa `/admin`, vê a lista de números reservados, confirma no seu banco se o Pix realmente caiu, e clica em **✓ Pago** para confirmar — ou em **Liberar** se a pessoa não pagou e você quer liberar o número de novo.
- **Doações**: aparecem na parte de baixo do painel admin, sem número associado.
- **Compartilhar**: tem um botão verde "Compartilhar no WhatsApp" logo abaixo da barra de progresso, com uma mensagem já pronta e o link do site — é só clicar para abrir o WhatsApp com tudo preenchido.

## Personalizar textos e valores

Edite o arquivo `src/config.js` para mudar:
- Título e subtítulo da página
- Texto de descrição
- Quantidade de números e preço
- Dados do Pix (caso troque de chave)

Depois de editar, é só salvar — se estiver usando Vercel conectado ao GitHub, basta subir a alteração (`git push`) que o site atualiza sozinho.

## Dúvidas comuns

**E se duas pessoas clicarem no mesmo número ao mesmo tempo?**
O sistema só reserva um número que ainda esteja "livre" no banco de dados — se outra pessoa já tiver reservado um instante antes, a segunda tentativa falha e pede para escolher outro número. Não há risco de dois compradores ficarem com o mesmo número.

**Posso mudar a quantidade de números depois?**
Sim, mas com cuidado: aumentar é fácil (rode um novo `insert` no SQL Editor do Supabase). Diminuir exige cuidado para não apagar números já vendidos.

**O Pix expira?**
Não, este é um Pix estático (sempre o mesmo QR Code para aquele valor). Ele não expira, mas também não te avisa automaticamente quando alguém paga — por isso o painel admin existe, para você confirmar manualmente olhando o extrato do seu banco.
