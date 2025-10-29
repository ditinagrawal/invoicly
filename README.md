# Invoicly

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Database**: MongoDB with Prisma
- **Auth**: Better Auth
- **Email**: NodeMailer
- **API**: tRPC
- **UI**: Shadcn UI + Tailwind CSS
- **Package Manager**: Bun

## Quick Start

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Set up environment variables**

   ```bash
   mv .env.example .env
   ```

   Fill in your database URL and GitHub OAuth credentials.

3. **Set up the database**

   ```bash
   bun run db:generate
   bun run db:push
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run db:push` - Push schema to database
- `bun run db:studio` - Open Prisma Studio
- `bun run lint` - Run linter
- `bun run format` - Format code

---

If you like this template, consider giving it a ⭐ star!
