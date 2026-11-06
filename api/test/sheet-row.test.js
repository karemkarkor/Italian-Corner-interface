import test from "node:test";
import assert from "node:assert/strict";
import { rowToRecord } from "../src/data/sheet-row.js";

test("sheet cells are assigned to their header names", () => {
  const headers = ["Ticket ID", "Customer Name", "Order Status"];
  const row = ["IC-1001", "Example Customer", "جاهز للشحن"];

  assert.deepEqual(rowToRecord(headers, row), {
    "Ticket ID": "IC-1001",
    "Customer Name": "Example Customer",
    "Order Status": "جاهز للشحن",
  });
});

test("missing trailing cells become empty strings", () => {
  const result = rowToRecord(["Ticket ID", "Completion Notes"], ["IC-1001"]);

  assert.deepEqual(result, {
    "Ticket ID": "IC-1001",
    "Completion Notes": "",
  });
});

test("zero is preserved and null becomes an empty string", () => {
  const result = rowToRecord(["Prepaid", "Warehouse Notes"], [0, null]);

  assert.deepEqual(result, {
    Prepaid: 0,
    "Warehouse Notes": "",
  });
});
