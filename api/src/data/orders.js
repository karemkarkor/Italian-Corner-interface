import { rowToRecord } from "./sheet-row.js";
import { recordToOrder } from "./order-mapper.js";

export async function listOrders(sheets, spreadsheetId) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Orders'!A:Z",
    majorDimension: "ROWS",
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  const [headers = [], ...rows] = response.data.values ?? [];

  if (headers.length === 0) {
    throw new Error("The Orders tab is missing its header row");
  }

  const orders = rows
    .filter(row => row.some(cell => cell !== ""))
    .map(row => recordToOrder(rowToRecord(headers, row)));

  return orders;
}
