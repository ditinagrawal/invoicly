"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { InvoiceActions } from "./invoice-actions";
import { Spinner } from "@/components/ui/spinner";

export const InvoiceList = () => {
  const trpc = useTRPC();
  const { data: allInvoices, isLoading } = useQuery(
    trpc.invoice.getInvoices.queryOptions(),
  );
  if (isLoading) return <Spinner className="mx-auto" />;
  if (!allInvoices || allInvoices.length === 0)
    return (
      <div className="text-muted-foreground text-center text-sm">
        No invoices found
      </div>
    );
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(value);
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(date);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allInvoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.toName}</TableCell>
            <TableCell>
              {formatCurrency(invoice.total, invoice.currency)}
            </TableCell>
            <TableCell>
              <Badge
                variant={invoice.status === "PAID" ? "success" : "secondary"}
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(invoice.date)}</TableCell>
            <TableCell className="text-right">
              <InvoiceActions invoiceId={invoice.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
