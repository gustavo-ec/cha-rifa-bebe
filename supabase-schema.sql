-- ============================================================
-- SCHEMA DA RIFA — Cole isso no SQL Editor do Supabase
-- (Supabase Dashboard > SQL Editor > New Query > colar > Run)
-- ============================================================

-- Tabela com os números da rifa
create table if not exists numeros_rifa (
  numero integer primary key,
  status text not null default 'livre' check (status in ('livre', 'reservado', 'pago')),
  nome_comprador text,
  telefone_comprador text,
  reservado_em timestamptz,
  pago_em timestamptz
);

-- Popula os 200 números (00 a 199) — rode só uma vez
insert into numeros_rifa (numero)
select generate_series(0, 199)
on conflict (numero) do nothing;

-- Tabela de doações (registro informativo, não controla pagamento real)
create table if not exists doacoes (
  id uuid primary key default gen_random_uuid(),
  nome_doador text,
  valor numeric(10,2) not null,
  criado_em timestamptz not null default now()
);

-- Habilita Row Level Security
alter table numeros_rifa enable row level security;
alter table doacoes enable row level security;

-- Qualquer pessoa pode LER os números (pra ver o que está livre/reservado/pago)
create policy "Leitura publica dos numeros"
  on numeros_rifa for select
  using (true);

-- Qualquer pessoa pode RESERVAR um número livre (update controlado pelo app)
create policy "Reserva publica de numero livre"
  on numeros_rifa for update
  using (status = 'livre')
  with check (status = 'reservado');

-- Apenas usuários autenticados (você, admin) podem fazer qualquer alteração,
-- incluindo marcar como pago ou liberar um número de volta
create policy "Admin pode alterar tudo"
  on numeros_rifa for update
  to authenticated
  using (true)
  with check (true);

-- Qualquer pessoa pode registrar uma doação
create policy "Qualquer um pode doar"
  on doacoes for insert
  with check (true);

-- Qualquer pessoa pode ver o total de doações (transparência)
create policy "Leitura publica das doacoes"
  on doacoes for select
  using (true);

-- ============================================================
-- IMPORTANTE: depois de rodar este script, vá em
-- Authentication > Users > Add User no painel do Supabase
-- e crie o seu usuário admin (email + senha) manualmente.
-- É com esse login que você vai entrar no painel /admin do site.
-- ============================================================
