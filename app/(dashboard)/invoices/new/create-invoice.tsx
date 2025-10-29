"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const CreateInvoice = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    invoiceName: "",
    invoiceNo: "",
    currency: "INR",
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    date: new Date() as Date | undefined,
    due: "0",
    item: {
      description: "",
      quantity: 0,
      rate: 0,
    },
    taxRate: 18,
    note: "",
  });

  const trpc = useTRPC();
  const createInvoice = useMutation(
    trpc.invoice.createInvoice.mutationOptions(),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formValues.invoiceName ||
      !formValues.invoiceNo ||
      !formValues.currency ||
      !formValues.fromName ||
      !formValues.fromEmail ||
      !formValues.fromAddress ||
      !formValues.toName ||
      !formValues.toEmail ||
      !formValues.toAddress ||
      !formValues.date ||
      !formValues.due ||
      !formValues.item.description ||
      !formValues.item.quantity ||
      !formValues.item.rate
    ) {
      return;
    }
    if (formValues.item.quantity <= 0 || formValues.item.rate <= 0) {
      return;
    }
    if (formValues.taxRate <= 0) {
      return;
    }
    try {
      await createInvoice.mutateAsync({
        invoiceName: formValues.invoiceName,
        invoiceNo: formValues.invoiceNo,
        currency: formValues.currency,
        fromName: formValues.fromName,
        fromEmail: formValues.fromEmail,
        fromAddress: formValues.fromAddress,
        toName: formValues.toName,
        toEmail: formValues.toEmail,
        toAddress: formValues.toAddress,
        date: formValues.date as Date,
        due: Number(formValues.due) || 0,
        item: {
          description: formValues.item.description,
          quantity: Number(formValues.item.quantity) || 0,
          rate: Number(formValues.item.rate) || 0,
        },
        taxRate: Number(formValues.taxRate) || 0,
        note: formValues.note || undefined,
      });
      toast.success("Invoice created successfully");
      router.push("/invoices");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create invoice");
    }
  };

  const lineAmount =
    (formValues.item.quantity || 0) * (formValues.item.rate || 0);
  const subtotal = lineAmount;
  const taxRateDecimal = (formValues.taxRate || 0) / 100;
  const total = subtotal + subtotal * taxRateDecimal;

  const formatCurrency = (value: number, currency: string) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currency}`;
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardContent>
        <form className="space-y-6 p-6" onSubmit={handleSubmit}>
          <div className="flex w-fit flex-col gap-1">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                type="text"
                placeholder="Invoice Name"
                value={formValues.invoiceName}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    invoiceName: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="bg-muted flex items-center rounded-l-md border border-r-0 px-3">
                  #
                </span>
                <Input
                  type="number"
                  placeholder="1"
                  className="rounded-l-none"
                  value={formValues.invoiceNo}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      invoiceNo: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Currency</Label>
              <Select
                value={formValues.currency}
                onValueChange={(val) =>
                  setFormValues((prev) => ({ ...prev, currency: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                  <SelectItem value="USD">
                    United States Dollar (USD)
                  </SelectItem>
                  <SelectItem value="EUR">European Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formValues.fromName}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      fromName: e.target.value,
                    }))
                  }
                />
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formValues.fromEmail}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      fromEmail: e.target.value,
                    }))
                  }
                />
                <Input
                  type="text"
                  placeholder="123 Main St, Anytown, USA"
                  value={formValues.fromAddress}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      fromAddress: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>To</Label>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Jane Smith"
                  value={formValues.toName}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      toName: e.target.value,
                    }))
                  }
                />
                <Input
                  type="email"
                  placeholder="jane.smith@example.com"
                  value={formValues.toEmail}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      toEmail: e.target.value,
                    }))
                  }
                />
                <Input
                  type="text"
                  placeholder="456 Main St, Anytown, USA"
                  value={formValues.toAddress}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      toAddress: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" type="button">
                    <CalendarIcon />{" "}
                    {formValues.date
                      ? new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                        }).format(formValues.date)
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={formValues.date}
                    onSelect={(date) =>
                      setFormValues((prev) => ({ ...prev, date }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Invoice Due</Label>
              <Select
                value={formValues.due}
                onValueChange={(val) =>
                  setFormValues((prev) => ({ ...prev, due: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Due Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <div className="mb-2 grid grid-cols-12 gap-4 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
            <div className="mb-4 grid grid-cols-12 gap-4">
              <Input
                type="text"
                placeholder="Description"
                className="col-span-6"
                value={formValues.item.description}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    item: { ...prev.item, description: e.target.value },
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Quantity"
                className="col-span-2"
                value={
                  Number.isFinite(formValues.item.quantity)
                    ? formValues.item.quantity
                    : 0
                }
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      quantity: Number(e.target.value) || 0,
                    },
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Rate"
                className="col-span-2"
                value={
                  Number.isFinite(formValues.item.rate)
                    ? formValues.item.rate
                    : 0
                }
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    item: { ...prev.item, rate: Number(e.target.value) || 0 },
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Amount"
                className="col-span-2"
                value={
                  (formValues.item.quantity || 0) * (formValues.item.rate || 0)
                }
                disabled
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, formValues.currency)}</span>
              </div>
              <div className="flex justify-between border-t py-2">
                <span>Tax</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20 text-right"
                    value={
                      Number.isFinite(formValues.taxRate)
                        ? formValues.taxRate
                        : 0
                    }
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        taxRate: Number(e.target.value) || 0,
                      }))
                    }
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="flex justify-between border-t py-2">
                <span>Total</span>
                <span className="font-medium">
                  {formatCurrency(total, formValues.currency)}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="space-y-1">
              <Label>Note</Label>
              <Textarea
                placeholder="Note"
                value={formValues.note}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button type="submit" disabled={createInvoice.isPending}>
              {createInvoice.isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
