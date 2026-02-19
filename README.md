# Library Management System

## Run locally

1. `npm install`
2. Create a PostgreSQL database and set `DATABASE_URL` in `.env`.
3. `npm run db:push` then `npm run dev`.
4. Optional: set `OPENAI_API_KEY` in `.env` for the AI “Suggest a book” feature.

## Deploy on Render

### Option A: Blueprint (repo has `render.yaml`)

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your GitHub account and select the **library-management** repo.
3. Render will detect `render.yaml` and create:
   - A **Web Service** (Node, build + start + release command).
   - A **PostgreSQL** database and inject `DATABASE_URL` into the web service.
4. Click **Apply**. After the first deploy, the release command runs `npm run db:push` so the schema is applied automatically.

### Option B: Manual setup

1. **Create a PostgreSQL database**
   - **New** → **PostgreSQL**.
   - Name it (e.g. `library-db`), choose a plan, **Create**.

2. **Create a Web Service**
   - **New** → **Web Service**.
   - Connect the repo and select **library-management**.

3. **Configure the Web Service**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Release Command:** `npm run db:push` (so DB schema is applied on every deploy)

4. **Environment**
   - Add `DATABASE_URL`: open your PostgreSQL service → **Info** → **Internal Database URL** (or **External** if you prefer), copy it, then in the Web Service → **Environment** → add `DATABASE_URL` = that URL.
   - Optional: add `OPENAI_API_KEY` for the AI suggestion feature.

5. **Deploy**
   - Save. Render will build and deploy. The release step runs before each deploy and creates/updates tables from your schema.

Your app URL will be like `https://library-management-xxxx.onrender.com`.
