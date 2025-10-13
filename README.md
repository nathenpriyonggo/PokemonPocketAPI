# PokemonPocketAPI

Create, share, and see trending decks for Pokemon's PTCGP app.

# Setup

This guide walks you through setting up the **PTCGP full-stack project** from scratch, including backend (Node.js + Express + Prisma + PostgreSQL) and frontend (React + Vite + TypeScript + Tailwind + React Query).

## 1. Prerequisites

Make sure you have installed:

- [Node.js ≥ 18](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [Docker](https://www.docker.com/get-started)

It is recommended to have Postman for API testing, Docker app for GUI, and Github Desktop if you are novice to Git.

## 2. Backend Setup

### a. Navigate to backend folder

```bash
cd backend
```

### b. Install dependencies

```bash
npm install
```

Dependencies include:

- express, cors, dotenv
- prisma, @prisma/client
- pg
- nodemon (dev only)

### c. Start PostgreSQL with Docker

```bash
docker run --name ptcgp-db -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=ptcgp -p 5432:5432 -d postgres
```

- Username: `postgres`
- Password: `pass`
- Database: `ptcgp`
- Port: `5432`

### d. Configure `.env`

Create a `.env` file in `backend`:

```env
DATABASE_URL="postgresql://postgres:pass@localhost:5432/ptcgp"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-6d14e2f40e1e7183545a9ab7594ea9d1a08cc4f490b5d29e71db1fe020e01a5b"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

On Mac, if Prisma fails with P1000 error, try:

```env
DATABASE_URL="postgresql://postgres:pass@host.docker.internal:5432/ptcgp"
```

### e. Run migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### f. Start backend server

```bash
npm run dev
```

- Server runs at [http://localhost:4000](http://localhost:4000)

### g. Seed the Database

Run the following command to seed the database with initial data (e.g., roles and users):

```bash
npm run db:seed
```

### h. JWT_SECRET Configuration

Ensure your `.env` file includes the following variable for authentication:

```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## 3. Frontend Setup

### a. Navigate to frontend folder

```bash
cd ../frontend
```

### b. Install Dependencies

```bash
npm install
```

### c. Start frontend server

```bash
npm run dev
```

- Vite dev server runs at [http://localhost:5173](http://localhost:5173)

### d. Configure Environment Variables

If the frontend needs to communicate with the backend, create a `.env` file in the `frontend` folder with the following content:

```env
VITE_API_URL=http://localhost:4000
```

# Commands

### Backend

```bash
npm run dev                         # start backend in dev mode
npx prisma migrate dev --name <name> # run migrations
npx prisma studio                   # web GUI for database
```

### Frontend

```bash
npm run dev                         # start Vite frontend
```

### Docker

```bash
docker ps                           # list containers
docker start ptcgp-db               # start DB container
docker logs ptcgp-db                # view Postgres logs
```

# API

- GET / - Test Route

### Roles

- GET /roles
- POST /role

# Additional Notes

### Tailwind CSS Setup

Ensure Tailwind CSS is properly configured in the `frontend/src/styles/index.css` file. It should include:

```css
@import "tailwindcss";
```

### Docker Container Management

When not in use, stop the PostgreSQL Docker container to save resources:

```bash
docker stop ptcgp-db
```

### Frontend Routing

The frontend uses React Router. Ensure your browser supports HTML5 history mode for proper routing.
