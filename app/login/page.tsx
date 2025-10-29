import { auth } from "@/lib/auth";
import { MailboxIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Form } from "./form";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session && !session.user.name) {
    redirect("/welcome");
  }
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div>
      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        <div className="bg-muted hidden h-full p-8 lg:block">
          <div className="flex h-full flex-col justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <MailboxIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-lg font-medium">Invoicly</span>
              </div>
            </Link>
            <p className="text-muted-foreground">
              Manage your invoices with ease, speed, and clarity.
            </p>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-bold">Login to Invoicly</h2>
              <p className="text-muted-foreground text-sm">
                Enter your email below to login to your account
              </p>
            </div>
            <Form />
            <p className="text-muted-foreground text-center text-sm">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
