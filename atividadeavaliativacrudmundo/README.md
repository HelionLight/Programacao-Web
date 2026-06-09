# Atividade Avaliativa CRUD Mundo

Projeto completo de CRUD para continentes, países e cidades usando **TypeScript**, **Express** e **PostgreSQL**.

## Recursos incluídos
- Backend em **TypeScript** com **Express** e **Prisma ORM**
- Modelos relacionais: Continente → País → Cidade
- Autenticação com **JWT** e login na interface
- Integração com duas APIs externas:
  - **REST Countries** para dados de país e bandeira
  - **OpenWeatherMap** para clima de cidade
- Interface responsiva com HTML, CSS e TypeScript compilado
- Filtros e paginação em listagens
- Rota de fallback para SPA e suporte a criação/edição/exclusão

## Instalação
1. Copie `.env.example` para `.env` e preencha os valores.
2. Ajuste `DATABASE_URL` para seu banco PostgreSQL.
3. Rode `npm install`.
4. Execute `npx prisma db push` para criar o esquema no banco.
5. Rode `npm run db:seed` para criar o usuário inicial.
6. Compile o cliente e o servidor com `npm run build`.
7. Inicie o servidor com `npm run dev` para desenvolvimento ou `npm start` para produção.

## Login inicial
- Email: `admin@crudmundo.local`
- Senha: `Admin123!`

## Estrutura do projeto
- `src/` - código do servidor TypeScript
- `public/` - frontend web e assets
- `prisma/` - esquema do banco de dados
- `.env.example` - variáveis de ambiente necessárias

## Observações
- Use `OPENWEATHER_API_KEY` para habilitar o clima em tempo real.
- A interface carrega conteúdo dinâmico e exibe dados das APIs externas.
