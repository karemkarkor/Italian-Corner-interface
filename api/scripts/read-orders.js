import { createSheetsClient } from "../src/data/google-sheets.js";
import { listOrders } from "../src/data/orders.js";

async function main() {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!keyFile || !spreadsheetId) {
    throw new Error(
      "Set GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_SHEETS_SPREADSHEET_ID"
    );
  }

  const sheets = await createSheetsClient(keyFile);
  const orders = await listOrders(sheets, spreadsheetId);

  console.log(`Read ${orders.length} orders.`);

  if (orders.length > 0) {
    console.table(orders.map(({ ticketId, status }) => ({ ticketId, status })));
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
