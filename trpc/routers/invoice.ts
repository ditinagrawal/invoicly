import { sendInvoiceEmail } from "@/lib/send-invoice-email";
import { sendReminderEmail } from "@/lib/send-reminder-email";
import { TRPCError } from "@trpc/server";
import { generateId } from "better-auth";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const invoiceRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(
      z.object({
        invoiceName: z.string(),
        invoiceNo: z.string(),
        currency: z.string(),
        fromName: z.string(),
        fromEmail: z.string(),
        fromAddress: z.string(),
        toName: z.string(),
        toEmail: z.string(),
        toAddress: z.string(),
        date: z.date(),
        due: z.number(),
        item: z.object({
          description: z.string(),
          quantity: z.number(),
          rate: z.number(),
        }),
        taxRate: z.number(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const total =
        input.item.quantity * input.item.rate +
        (input.item.quantity * input.item.rate * input.taxRate) / 100;
      const newInvoice = await ctx.db.invoice.create({
        data: {
          id: generateId(),
          invoiceName: input.invoiceName,
          invoiceNumber: Number(input.invoiceNo),
          currency: input.currency,
          fromName: input.fromName,
          fromEmail: input.fromEmail,
          fromAddress: input.fromAddress,
          toName: input.toName,
          toEmail: input.toEmail,
          toAddress: input.toAddress,
          date: input.date,
          dueDate: input.due,
          itemDescription: input.item.description,
          itemQuantity: input.item.quantity,
          itemRate: input.item.rate,
          taxRate: input.taxRate,
          note: input.note,
          total,
          status: "PENDING",
          userId: ctx.session.user.id,
        },
      });
      await sendInvoiceEmail(newInvoice);
      return newInvoice;
    }),

  getInvoices: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const invoices = await ctx.db.invoice.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        invoiceNumber: true,
        toName: true,
        total: true,
        status: true,
        date: true,
        currency: true,
      },
    });
    return invoices;
  }),

  deleteInvoice: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      await ctx.db.invoice.delete({
        where: { id: input },
      });
      return { success: true };
    }),

  markAsPaid: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      await ctx.db.invoice.update({
        where: { id: input },
        data: { status: "PAID" },
      });
      return { success: true };
    }),

  sendReminderEmail: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const invoice = await ctx.db.invoice.findUnique({
        where: { id: input },
      });
      if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await sendReminderEmail(invoice);
      return { success: true };
    }),

  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const invoices = await ctx.db.invoice.findMany({
      where: { userId: ctx.session.user.id },
    });
    const totalRevenue = invoices.reduce((acc, invoice) => acc + invoice.total, 0);
    const totalInvoices = invoices.length;
    const totalPaidInvoices = invoices.filter((invoice) => invoice.status === "PAID").length;
    const totalOpenInvoices = invoices.filter((invoice) => invoice.status === "PENDING").length;
    return {
      totalRevenue,
      totalInvoices,
      totalPaidInvoices,
      totalOpenInvoices,
    };
  }),

  getRevenueSeries: protectedProcedure
    .input(
      z
        .object({
          days: z.number().int().min(1).max(365).default(30),
          includePending: z.boolean().default(false),
        })
        .default({ days: 30, includePending: false }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - (input?.days ?? 30) + 1);

      const invoices = await ctx.db.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          date: { gte: start, lte: now },
          ...(input?.includePending
            ? {}
            : { status: "PAID" as const }),
        },
        select: {
          total: true,
          date: true,
        },
        orderBy: { date: "asc" },
      });

      const seriesMap = new Map<string, number>();
      const iter = new Date(start);
      while (iter <= now) {
        const key = iter.toISOString().slice(0, 10);
        seriesMap.set(key, 0);
        iter.setDate(iter.getDate() + 1);
      }

      for (const inv of invoices) {
        const key = inv.date.toISOString().slice(0, 10);
        seriesMap.set(key, (seriesMap.get(key) ?? 0) + inv.total);
      }

      const data = Array.from(seriesMap.entries()).map(([date, revenue]) => ({
        date,
        revenue,
      }));

      return { data };
    }),
});
