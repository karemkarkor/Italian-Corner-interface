import { clerkMiddleware, getAuth } from "@clerk/express";
import { createApp } from "./app.js";

if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  throw new Error("Set CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY");
}

const app = createApp({
  authenticate: clerkMiddleware({
    authorizedParties: ["http://localhost:5173"],
  }),
  readAuth: getAuth,
});

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
