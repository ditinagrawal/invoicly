import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateInvoice } from "./create-invoice";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  if (session && !session.user.name) {
    redirect("/welcome");
  }
  return <CreateInvoice />;
}
