# StackIt

A minimal question-and-answer platform focused on structured knowledge sharing and collaborative learning.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dhruv-programmes/stackit.git
cd stackit
```

### 2. Install dependencies

Make sure you have [pnpm](https://pnpm.io/) installed:

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the project and add the following variables:

```
# Supabase Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

> Use `.env.example` as a reference if provided.

### 4. Set up the database

Push the Prisma schema to your Supabase database:

```bash
npx prisma db push
```

(Optional) Open Prisma Studio to inspect the DB:

```bash
npx prisma studio
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer       | Technology            |
|-------------|------------------------|
| Framework   | Next.js (App Router)   |
| Styling     | Tailwind CSS           |
| Auth        | NextAuth.js (Google)   |
| Editor      | TipTap                 |
| ORM         | Prisma                 |
| Database    | PostgreSQL (Supabase)  |
| Hosting     | Vercel + Supabase      |

---

## Credits

| Member          | Email                       |
|-----------------|-----------------------------|
| Purav Shah      | 24bce005@nirmauni.ac.in     |
| Dhruv P         | 24bce045@nirmauni.ac.in     |
| Bhavya Vaishnav | 24bce039@nirmauni.ac.in     |

### GitHub Collaborators

- [@PuravShah07](https://github.com/PuravShah07)
- [@Bhavya-Vaishnav](https://github.com/Bhavya-Vaishnav)
- [@dhruv-programmes](https://github.com/dhruv-programmes) (Maintainer)
