import { afterEach, describe, expect, it, vi } from "vitest";
import { getCurrentEmployee } from "../src/lib/api.js";

afterEach(() => vi.unstubAllGlobals());

function readEmployee(options = {}) {
  return getCurrentEmployee({
    getToken: async () => "test-session-token",
    userId: "user_employee",
    ...options,
  });
}

describe("authenticated requests", () => {
  it("sends the session token and returns the matching user", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ userId: "user_employee" }))
      );
    vi.stubGlobal("fetch", fetchMock);
    await expect(readEmployee()).resolves.toEqual({ userId: "user_employee" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-session-token" },
        cache: "no-store",
      })
    );
  });

  it("does not call the API when Clerk has no session token", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      readEmployee({ getToken: async () => null })
    ).rejects.toMatchObject({ code: "signedOut" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [401, "signedOut"],
    [403, "forbidden"],
    [503, "offline"],
  ])("handles HTTP %s without claiming access", async (status, code) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status }))
    );
    await expect(readEmployee()).rejects.toMatchObject({ code });
  });

  it.each([
    "<html>upstream error</html>",
    "{}",
    '{"userId":"user_someone_else"}',
  ])("rejects an invalid identity response: %s", async body => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body)));
    await expect(readEmployee()).rejects.toMatchObject({
      code: "invalidResponse",
    });
  });

  it("does not send a request after the page cancels it", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();
    controller.abort();
    await expect(
      readEmployee({ signal: controller.signal })
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
