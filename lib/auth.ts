import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";

import { db } from "@/lib/db";
import { transporter } from "./nodemailer";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "mongodb",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await transporter.sendMail({
          from: '"Invoicly" <ditin.agrawal05@gmail.com>',
          to: email,
          subject: "Login to your Invoicly account",
          html: `<b>Click <a href="${url}">here</a> to login to your Invoicly account</b>`,
        });
      },
    }),
  ],
});
