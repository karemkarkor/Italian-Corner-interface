import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

function appWithAuth(auth) {
  return createApp({
    authenticate: (req, res, next) => next(),
    readAuth: () => auth,
  });
}

test("GET /api/me rejects an unauthenticated request", async () => {
  const app = appWithAuth({
    isAuthenticated: false,
    userId: null,
  });

  const response = await request(app).get("/api/me").expect(401);

  assert.deepEqual(response.body, { error: "Unauthorized" });
});

test("GET /api/me returns the authenticated user ID", async () => {
  const app = appWithAuth({
    isAuthenticated: true,
    userId: "user_test_employee",
  });

  const response = await request(app).get("/api/me").expect(200);

  assert.deepEqual(response.body, {
    userId: "user_test_employee",
  });
});
