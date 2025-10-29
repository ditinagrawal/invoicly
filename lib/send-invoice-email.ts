import { Invoice } from "@/lib/generated/prisma/client";
import { transporter } from "./nodemailer";
import { ENV } from "./env";

export const sendInvoiceEmail = async (invoice: Invoice) => {
  const appUrl = ENV.NEXT_PUBLIC_APP_URL;
  const downloadUrl = `${appUrl}/api/invoice/${invoice.id}`;

  const currency = invoice.currency ?? "USD";
  const qty = Number(invoice.itemQuantity ?? 0);
  const rate = Number(invoice.itemRate ?? 0);
  const lineAmount = qty * rate;
  const taxRate = Number(invoice.taxRate ?? 0);
  const taxAmount = (lineAmount * taxRate) / 100;
  const subtotal = lineAmount;
  const total = subtotal + taxAmount;

  const formatMoney = (amount: number, code: string) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
    }).format(amount);
  };

  const issuedOn = invoice.date ? new Date(invoice.date) : new Date();
  const dueOn = (() => {
    const base = issuedOn;
    const d = new Date(base);
    if (invoice.dueDate) d.setDate(base.getDate() + Number(invoice.dueDate));
    return d;
  })();

  const subject = `Invoice #${invoice.invoiceNumber ?? invoice.id} from ${invoice.fromName}`;

  const html = `
  <div style="background-color:#f6f8fb;padding:24px;font-family:Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:24px 24px 8px 24px;background:#0f172a;color:#ffffff;">
          <div style="font-size:18px;font-weight:600;">Invoicly</div>
          <div style="font-size:12px;opacity:0.8;">Your invoice is ready</div>
        </td>
      </tr>

      <tr>
        <td style="padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
            <div>
              <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Invoice</div>
              <div style="font-size:16px;font-weight:600;">#${invoice.invoiceNumber ?? invoice.id}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:8px;">${invoice.invoiceName ?? "Invoice"}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:12px;color:#6b7280;">Issued</div>
              <div style="font-size:14px;font-weight:500;">${issuedOn.toLocaleDateString()}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:8px;">Due</div>
              <div style="font-size:14px;font-weight:500;">${dueOn.toLocaleDateString()}</div>
            </div>
          </div>

          <div style="display:flex;gap:24px;margin-top:24px;">
            <div style="flex:1;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
              <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">From</div>
              <div style="font-size:14px;font-weight:600;">${invoice.fromName}</div>
              <div style="font-size:13px;color:#374151;">${invoice.fromEmail}</div>
              <div style="font-size:13px;color:#374151;margin-top:4px;white-space:pre-line;">${invoice.fromAddress}</div>
            </div>
            <div style="flex:1;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
              <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Bill To</div>
              <div style="font-size:14px;font-weight:600;">${invoice.toName}</div>
              <div style="font-size:13px;color:#374151;">${invoice.toEmail}</div>
              <div style="font-size:13px;color:#374151;margin-top:4px;white-space:pre-line;">${invoice.toAddress}</div>
            </div>
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-collapse:collapse;">
            <thead>
              <tr>
                <th align="left" style="font-size:12px;color:#6b7280;font-weight:600;padding:12px;border-bottom:1px solid #e5e7eb;">Description</th>
                <th align="right" style="font-size:12px;color:#6b7280;font-weight:600;padding:12px;border-bottom:1px solid #e5e7eb;">Qty</th>
                <th align="right" style="font-size:12px;color:#6b7280;font-weight:600;padding:12px;border-bottom:1px solid #e5e7eb;">Rate</th>
                <th align="right" style="font-size:12px;color:#6b7280;font-weight:600;padding:12px;border-bottom:1px solid #e5e7eb;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size:14px;color:#111827;padding:12px;border-bottom:1px solid #f3f4f6;">${invoice.itemDescription}</td>
                <td align="right" style="font-size:14px;color:#111827;padding:12px;border-bottom:1px solid #f3f4f6;">${qty}</td>
                <td align="right" style="font-size:14px;color:#111827;padding:12px;border-bottom:1px solid #f3f4f6;">${formatMoney(rate, currency)}</td>
                <td align="right" style="font-size:14px;color:#111827;padding:12px;border-bottom:1px solid #f3f4f6;">${formatMoney(lineAmount, currency)}</td>
              </tr>
            </tbody>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
            <tr>
              <td></td>
              <td width="320">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="right" style="font-size:14px;color:#374151;padding:8px;">Subtotal</td>
                    <td align="right" style="font-size:14px;color:#111827;padding:8px;">${formatMoney(subtotal, currency)}</td>
                  </tr>
                  <tr>
                    <td align="right" style="font-size:14px;color:#374151;padding:8px;">Tax (${taxRate.toFixed(0)}%)</td>
                    <td align="right" style="font-size:14px;color:#111827;padding:8px;">${formatMoney(taxAmount, currency)}</td>
                  </tr>
                  <tr>
                    <td align="right" style="font-size:14px;color:#111827;font-weight:700;padding:12px;border-top:1px solid #e5e7eb;">Total</td>
                    <td align="right" style="font-size:16px;color:#111827;font-weight:700;padding:12px;border-top:1px solid #e5e7eb;">${formatMoney(total, currency)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          ${
            invoice.note
              ? `<div style="margin-top:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
            <div style=\"font-size:12px;color:#6b7280;margin-bottom:6px;\">Notes</div>
            <div style=\"font-size:13px;color:#374151;white-space:pre-line;\">${invoice.note}</div>
          </div>`
              : ""
          }

          <div style="margin-top:24px;text-align:center;">
            <a href="${downloadUrl}"
               style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:600;font-size:14px;">
              Download Invoice
            </a>
          </div>

          <div style="margin-top:24px;font-size:12px;color:#6b7280;text-align:center;">
            Thank you for your business.
          </div>
        </td>
      </tr>
    </table>
  </div>`;

  await transporter.sendMail({
    from: '"Invoicly" <' + ENV.EMAIL_USER + ">",
    to: invoice.toEmail,
    subject,
    html,
  });
};
