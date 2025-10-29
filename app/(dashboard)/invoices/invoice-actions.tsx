import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCheckIcon,
  DownloadCloudIcon,
  EllipsisVerticalIcon,
  MailIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const InvoiceActions = ({ invoiceId }: { invoiceId: string }) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const deleteInvoice = useMutation(
    trpc.invoice.deleteInvoice.mutationOptions(),
  );
  const markAsPaid = useMutation(trpc.invoice.markAsPaid.mutationOptions());
  const sendReminderEmail = useMutation(
    trpc.invoice.sendReminderEmail.mutationOptions(),
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            markAsPaid.mutate(invoiceId, {
              onSuccess: () => {
                queryClient.invalidateQueries(
                  trpc.invoice.getInvoices.queryOptions(),
                );
                toast.success("Invoice marked as paid successfully");
              },
              onError: () => {
                toast.error("Failed to mark invoice as paid");
              },
            })
          }
        >
          <CheckCheckIcon />
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/api/invoice/${invoiceId}`} target="_blank">
            <DownloadCloudIcon />
            Download Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            sendReminderEmail.mutate(invoiceId, {
              onSuccess: () => {
                queryClient.invalidateQueries(
                  trpc.invoice.getInvoices.queryOptions(),
                );
                toast.success("Reminder email sent successfully");
              },
              onError: () => {
                toast.error("Failed to send reminder email");
              },
            })
          }
        >
          <MailIcon />
          Reminder Email
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            deleteInvoice.mutate(invoiceId, {
              onSuccess: () => {
                queryClient.invalidateQueries(
                  trpc.invoice.getInvoices.queryOptions(),
                );
                toast.success("Invoice deleted successfully");
              },
              onError: () => {
                toast.error("Failed to delete invoice");
              },
            })
          }
        >
          <TrashIcon />
          Delete Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
