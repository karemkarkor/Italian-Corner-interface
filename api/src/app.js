import express from "express";

export function createApp({ authenticate, readAuth }) {
  const app = express();

  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "italian-corner-api",
    });
  });

  app.use(authenticate);

  app.get("/api/me", (req, res) => {
    const { isAuthenticated, userId } = readAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.json({ userId });
  });

  return app;
}
