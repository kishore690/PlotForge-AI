# PlotForge AI

PlotForge AI is a story writing workspace with a React frontend and a Spring Boot API. Writers can create an account, configure a prompt, generate and edit stories, bookmark or favorite stories, and open a theme-styled PDF export.

## Requirements

- Node.js 20.19+ or 22.12+
- Java 21
- MySQL 8 (running locally or reachable from the backend)
- A Google Gemini API key for AI story generation

## Configure the backend

Create `backend/src/main/resources/application-local.yml` by copying `application-local.yml.example`, then set `gemini.api.key` and a private `jwt.secret` of at least 32 characters. The local profile defaults to MySQL database `plotforge_db`, user `root`, password `root`. Override the database values with `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` if needed. The database is created automatically when the configured MySQL user has permission.

### Enable Google sign-in

Create an OAuth 2.0 **Web application** client ID in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Add `http://localhost:5173` and `http://127.0.0.1:5173` as authorized JavaScript origins. Set the same public client ID in `frontend/.env` as `VITE_GOOGLE_CLIENT_ID` and in `backend/src/main/resources/application-local.yml` as `google.client-id` (or use the `GOOGLE_CLIENT_ID` environment variable for the backend). Copy `frontend/.env.example` as a starting point, then restart Vite and Spring Boot. The backend verifies the Google ID token signature and audience before creating or signing in the account.

Google sign-in accepts verified Gmail and Google Workspace identities. Other Google accounts can still use email and password sign-in.

### Read aloud

The story reader uses the browser's built-in speech synthesis and offers English, Hindi, and Kannada playback. Available voices depend on voices installed in the user's browser or operating system; the reader reports when a selected language voice is unavailable.

Alternatively provide `GEMINI_API_KEY` and `JWT_SECRET` as environment variables. Never commit real keys or passwords.

## Run the application

In one terminal, start the API:

```powershell
cd backend
mvn spring-boot:run
```

In a second terminal, install frontend packages and start Vite:

```powershell
cd frontend
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`). The API listens on `http://localhost:8081`; API documentation is at `http://localhost:8081/swagger-ui/index.html`.

Set `VITE_API_BASE_URL` if the API is not at `http://localhost:8081/api`. Set `SERVER_PORT` to change the API port. For local development on a different origin, configure `app.cors.allowed-origins`; production uses `APP_CORS_ALLOWED_ORIGINS`.

## Production deployment

Build the frontend with `npm run build` and serve the generated `frontend/dist` directory. Configure the static host to rewrite unknown paths to `index.html` so routes such as `/new-story` continue to work after refresh. By default, production frontend requests use `/api`; route that path to the backend on the same host, or set `VITE_API_BASE_URL` to the full public API base URL before building.

Run the backend with `SPRING_PROFILES_ACTIVE=prod` and provide `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `GEMINI_API_KEY`, a strong `JWT_SECRET` (at least 32 characters), `APP_CORS_ALLOWED_ORIGINS` (comma-separated exact frontend origins), and `GOOGLE_CLIENT_ID` when Google sign-in is enabled. Production uses schema validation, disables SQL output and Swagger UI, and requires its database and CORS settings. Flyway applies versioned schema migrations at startup; add future changes under `backend/src/main/resources/db/migration`.

### Deploy to Railway

The repository includes Dockerfiles and Railway configuration for separate frontend and backend services. Create a Railway project from this GitHub repository and add a managed MySQL service. Name the services exactly `Backend`, `Frontend`, and `MySQL` so the reference variables below resolve. Configure the backend service with root directory `/backend` and config file `/backend/railway.toml`; configure the frontend with root directory `/frontend` and config file `/frontend/railway.toml`. Deploy the backend and frontend after adding the variables below. Railway's monorepo setup uses a separate service per root directory; its config file path stays relative to the repository root.

Set backend variables in Railway (use the MySQL service's private variables):

```text
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?serverTimezone=UTC
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
GEMINI_API_KEY=<new Gemini API key>
JWT_SECRET=<new random value of at least 32 characters>
GOOGLE_CLIENT_ID=<Google OAuth web client ID>
APP_CORS_ALLOWED_ORIGINS=https://${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
```

Set frontend service variables `API_UPSTREAM=${{Backend.RAILWAY_PRIVATE_DOMAIN}}:${{Backend.PORT}}` and `VITE_GOOGLE_CLIENT_ID=<public Google OAuth web client ID>`. Generate a public domain for the frontend service only. Then add the frontend's HTTPS origin to the Google OAuth client's authorized JavaScript origins. The frontend proxies `/api` to the backend over Railway's private network, so the API stays private and browser requests remain same-origin. The Google client ID is public and gets baked into the frontend build; keep all backend secrets in Railway's Variables panel and never add them to the repository or frontend variables.

## Build and lint

```powershell
cd frontend
npm run build
npm run lint
```

```powershell
cd backend
mvn -DskipTests package
```

## Main API routes

All routes are under `/api`. Registration and login are public. Other routes require `Authorization: Bearer <token>`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account |
| `POST` | `/auth/login` | Sign in and receive a JWT |
| `GET` | `/user/me` | Current account details |
| `GET` | `/dashboard` | Story and word counts |
| `POST` | `/story/create` | Create a story draft |
| `POST` | `/story/import` | Import plain text into the library |
| `POST` | `/story/{id}/generate` | Generate and save its prose |
| `GET` | `/story/my-stories` | List the signed-in user's stories |
| `GET` | `/story/{id}` | Read a story |
| `PUT` | `/story/{id}` | Update story details, favorite, or saved state |
| `DELETE` | `/story/{id}` | Delete a story |

Stories are scoped to their owner. Theme and language preferences are currently stored in the browser for the signed-in device.
