import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { MailboxIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="mx-auto max-w-7xl px-4">
      <header className="h-16">
        <nav className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <MailboxIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-lg font-medium">Invoicly</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href={session ? "/dashboard" : "/login"}>
                {session ? "Dashboard" : "Login"}
              </Link>
            </Button>
            <Button size="icon-sm" variant="secondary" asChild>
              <Link href="https://github.com/ditinagrawal/invoicly">
                <svg
                  viewBox="0 0 1024 1024"
                  fill="none"
                  role="img"
                  aria-label="Invoicly"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                    transform="scale(64)"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:py-16 lg:gap-24 lg:py-24">
        {/* Hero Content */}
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
          <Badge className="rounded-full">Easy Invoicing</Badge>

          <h1 className="text-3xl leading-[1.29167] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Manage your invoices
            <br />
            <span className="relative">
              with ease,
              <svg
                width="223"
                height="12"
                viewBox="0 0 223 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-x-0 bottom-0 w-full translate-y-1/2 max-sm:hidden"
              >
                <path
                  d="M1.11716 10.428C39.7835 4.97282 75.9074 2.70494 114.894 1.98894C143.706 1.45983 175.684 0.313587 204.212 3.31596C209.925 3.60546 215.144 4.59884 221.535 5.74551"
                  stroke="url(#paint0_linear_10365_68643)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_10365_68643"
                    x1="18.8541"
                    y1="3.72033"
                    x2="42.6487"
                    y2="66.6308"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--primary)" />
                    <stop offset="1" stopColor="var(--primary-foreground)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            speed, and clarity.
          </h1>

          <p className="text-muted-foreground">
            Invoicly is a platform that helps you manage your invoices easily
            and quickly. It&apos;s a simple and easy <br /> to use platform that
            allows you to create, send, and track your invoices.
          </p>

          <Button size="lg" asChild>
            <a href="/login">Get Started</a>
          </Button>
        </div>

        {/* Image */}
        <div className="bg-muted rounded-2xl p-4 shadow-lg">
          <img
            src="/dashboard.png"
            alt="Dashboard"
            className="min-h-67 w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <footer className="text-muted-foreground py-4 text-center">
        <p>Copyright © 2025 Invoicly. All rights reserved.</p>
      </footer>
    </div>
  );
}
