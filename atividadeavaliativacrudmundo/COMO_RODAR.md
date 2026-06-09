# Como Rodar o Projeto CRUD Mundo

Este arquivo descreve os passos necessários para executar o projeto localizado em `atividadeavaliativacrudmundo`.

## 1. Instalar dependências
1. Abra um terminal na pasta `atividadeavaliativacrudmundo`.
2. Execute:
   ```bash
   npm install
   ```

## 2. Configurar variáveis de ambiente
1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   copy .env.example .env
   ```
2. Abra `.env` e preencha os valores:
   - `DATABASE_URL`: URL de conexão com seu PostgreSQL
   - `JWT_SECRET`: chave secreta para gerar tokens JWT
   - `OPENWEATHER_API_KEY`: chave da API OpenWeatherMap

Exemplo:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/crud_mundo?schema=public
JWT_SECRET=troca_para_uma_chave_secreta_forte
OPENWEATHER_API_KEY=sua_chave_openweather
```

## 3. Criar o esquema do banco de dados com Prisma
Execute:
```bash
npx prisma db push
```

## 4. Popular dados iniciais
Execute:
```bash
npm run db:seed
```

## 5. Build e execução
### Modo desenvolvimento
Execute:
```bash
npm run dev
```

### Modo produção
1. Compile o servidor e cliente:
   ```bash
   npm run build
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```

## 6. Acessar a aplicação
Abra o navegador em:
```
http://localhost:4000
```

## 7. Credenciais iniciais de login
- Email: `admin@crudmundo.local`
- Senha: `Admin123!`

## 8. Observações importantes
- A aplicação depende de PostgreSQL local funcionando.
- `OPENWEATHER_API_KEY` é necessária para buscar dados de clima.
- Caso queira mudar a porta, ajuste a variável `PORT` no arquivo `.env` ou no `server.ts`.
