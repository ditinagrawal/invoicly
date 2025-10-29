import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import jsPDF from "jspdf";

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;
  const invoice = await db.invoice.findUnique({
    where: { id },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // Helpers
  const currencySymbol = (code: string) => {
    switch (code) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "INR":
        return "₹";
      default:
        return code + " ";
    }
  };

  const formatMoney = (amount: number, code: string) =>
    `${currencySymbol(code)}${amount.toFixed(2)}`;
  const formatDate = (dateStr?: string | Date | null) => {
    try {
      const d = dateStr ? new Date(dateStr) : new Date();
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // Calculate amounts
  const qty = Number(invoice.itemQuantity ?? 0);
  const rate = Number(invoice.itemRate ?? 0);
  const lineAmount = qty * rate;
  const taxRate = Number(invoice.taxRate ?? 0);
  const taxAmount = (lineAmount * taxRate) / 100;
  const subtotal = lineAmount;
  const total = subtotal + taxAmount;

  // Build PDF (A4, millimeters)
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210; // A4 width in mm
  const left = 20;
  const right = pageWidth - 20; // 190mm
  let y = 20;
  // Table column anchors (right-aligned numeric columns)
  const colQty = 120;
  const colRate = 150;
  const colAmount = right; // 190

  // Header
  doc.setFont("helvetica");
  doc.setFontSize(20);
  doc.text("INVOICE", left, y);
  doc.setFontSize(10);
  y += 8;
  doc.text(`Invoice #: ${invoice.invoiceNumber ?? "-"}`, left, y);
  y += 6;
  doc.text(`Date: ${formatDate(invoice.date as unknown as string)}`, left, y);
  y += 6;
  const dueOn = (() => {
    const base = invoice.date
      ? new Date(invoice.date as unknown as string)
      : new Date();
    const d = new Date(base);
    if (invoice.dueDate) d.setDate(base.getDate() + Number(invoice.dueDate));
    return formatDate(d);
  })();
  doc.text(`Due: ${dueOn}`, left, y);

  // From / To blocks
  y += 12;
  doc.setFontSize(12);
  doc.text("Bill From", left, y);
  doc.text("Bill To", 120, y);
  doc.setFontSize(10);
  y += 6;
  doc.text(`${invoice.fromName ?? ""}`.trim(), left, y);
  doc.text(`${invoice.toName ?? ""}`.trim(), 120, y);
  y += 6;
  if (invoice.fromEmail) doc.text(`${invoice.fromEmail}`, left, y);
  if (invoice.toEmail) doc.text(`${invoice.toEmail}`, 120, y);
  y += 6;
  if (invoice.fromAddress) doc.text(`${invoice.fromAddress}`, left, y);
  if (invoice.toAddress) doc.text(`${invoice.toAddress}`, 120, y);

  // Line separator
  y += 10;
  doc.setLineWidth(0.5);
  doc.line(left, y, right, y);

  // Items table header
  y += 8;
  doc.setFontSize(11);
  doc.text("Description", left, y);
  doc.text("Qty", colQty, y, { align: "right" });
  doc.text("Rate", colRate, y, { align: "right" });
  doc.text("Amount", colAmount, y, { align: "right" });
  doc.setLineWidth(0.2);
  y += 3;
  doc.line(left, y, right, y);

  // Single line item (based on provided schema)
  y += 6;
  doc.setFontSize(10);
  // Wrap description to fit before Qty column
  const descMaxWidth = colQty - left - 8;
  const desc = doc.splitTextToSize(
    `${invoice.itemDescription ?? "Item"}`,
    descMaxWidth,
  );
  doc.text(desc, left, y);
  // Align numeric columns to their anchors
  doc.text(`${qty}`, colQty, y, { align: "right" });
  doc.text(`${formatMoney(rate, invoice.currency ?? "USD")}`, colRate, y, {
    align: "right",
  });
  doc.text(
    `${formatMoney(lineAmount, invoice.currency ?? "USD")}`,
    colAmount,
    y,
    { align: "right" },
  );

  // Summary
  y += 10;
  doc.setLineWidth(0.2);
  doc.line(colRate, y, right, y);
  y += 8;
  doc.text("Subtotal:", colRate, y, { align: "right" });
  doc.text(
    `${formatMoney(subtotal, invoice.currency ?? "USD")}`,
    colAmount,
    y,
    { align: "right" },
  );
  y += 6;
  doc.text(`Tax (${taxRate.toFixed(0)}%):`, colRate, y, { align: "right" });
  doc.text(
    `${formatMoney(taxAmount, invoice.currency ?? "USD")}`,
    colAmount,
    y,
    { align: "right" },
  );
  y += 6;
  doc.setFontSize(12);
  doc.text("Total:", colRate, y, { align: "right" });
  doc.text(`${formatMoney(total, invoice.currency ?? "USD")}`, colAmount, y, {
    align: "right",
  });

  // Notes
  if (invoice.note) {
    y += 28;
    doc.setFontSize(11);
    doc.text("Notes", left, y);
    doc.setFontSize(10);
    y += 14;
    const split = doc.splitTextToSize(invoice.note, right - left);
    doc.text(split, left, y);
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120);
  const pageHeight = 297; // A4 height in mm
  doc.text("Thank you for your business!", left, pageHeight - 20);

  const arrayBuffer = doc.output("arraybuffer");
  const buffer = Buffer.from(arrayBuffer);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${invoice.invoiceNumber ?? invoice.id}.pdf`,
      "Cache-Control": "no-store",
    },
  });
};
