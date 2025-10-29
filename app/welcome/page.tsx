import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Form } from "./form";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  if (session && session.user.name) {
    redirect("/dashboard");
  }
  return (
    <div>
      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        <div className="bg-muted hidden h-full p-8 lg:block">
          <div className="flex h-full flex-col justify-between">
            <p className="text-2xl font-bold">Invoicly</p>
            <Image
              src="/onboarding.svg"
              alt="Onboarding"
              width={600}
              height={600}
              className="object-cover"
            />
            <p className="text-muted-foreground">
              Manage your invoices with ease, speed, and clarity.
            </p>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-bold">Welcome to Invoicly</h2>
              <p className="text-muted-foreground text-sm">
                You&apos;re almost there, let&apos;s get started with your
                onboarding.
              </p>
            </div>
            <Form />
            <p className="text-muted-foreground text-center text-sm">
              Let&apos;s quickly finish setting up your account to get started
              with Invoicly today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
