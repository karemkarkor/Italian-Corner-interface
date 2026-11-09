export class SessionError extends Error {
  constructor(code) {
    super(code);
    this.name = "SessionError";
    this.code = code;
  }
}

export async function getCurrentEmployee({ getToken, userId, signal }) {
  const token = await getToken();
  if (!token) throw new SessionError("signedOut");
  signal?.throwIfAborted();

  const response = await fetch("/api/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal,
  });
  if (response.status === 401) throw new SessionError("signedOut");
  if (response.status === 403) throw new SessionError("forbidden");
  if (!response.ok) throw new SessionError("offline");

  let employee;
  try {
    employee = await response.json();
  } catch {
    throw new SessionError("invalidResponse");
  }
  if (!userId || employee?.userId !== userId) {
    throw new SessionError("invalidResponse");
  }
  return employee;
}
