import { readFile } from "node:fs/promises";
import { google } from "googleapis";

export async function createSheetsClient(keyFile) {
  const credentials = JSON.parse(await readFile(keyFile, "utf8"));

  if (
    credentials?.type !== "service_account" ||
    typeof credentials.client_email !== "string" ||
    typeof credentials.private_key !== "string"
  ) {
    throw new Error("Expected a Google service-account key file");
  }

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}
