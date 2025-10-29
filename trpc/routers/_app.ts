import { createTRPCRouter } from "../init";
import { invoiceRouter } from "./invoice";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  invoice: invoiceRouter,
});

export type AppRouter = typeof appRouter;
