import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { caller } from "@/trpc/server";
import {
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  FileTextIcon,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RevenueChart from "./revenue-chart";

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
  const dashboardData = await caller.invoice.getDashboardData();
  const revenueSeries = await caller.invoice.getRevenueSeries({ days: 30 });
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="size-4" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              ${dashboardData.totalRevenue}
            </h2>
            <p className="text-muted-foreground text-xs">
              Based on your last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileTextIcon className="size-4" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {dashboardData.totalInvoices}
            </h2>
            <p className="text-muted-foreground text-xs">
              Invoices issued to your clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CheckCircleIcon className="size-4" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {dashboardData.totalPaidInvoices}
            </h2>
            <p className="text-muted-foreground text-xs">
              Invoices paid by your clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Invoices</CardTitle>
            <ClockIcon className="size-4" />
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {dashboardData.totalOpenInvoices}
            </h2>
            <p className="text-muted-foreground text-xs">
              Invoices that are due to be paid
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <RevenueChart data={revenueSeries.data} />
      </div>
    </div>
  );
}
