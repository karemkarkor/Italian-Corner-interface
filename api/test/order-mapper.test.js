import test from "node:test";
import assert from "node:assert/strict";
import { recordToOrder } from "../src/data/order-mapper.js";

function makeRecord() {
  return {
    "Ticket ID": "IC-1001",
    "Created At": "2026-11-06T09:00:00Z",
    "Customer Name": "Example Customer",
    "Customer Phone": "01012345678",
    Address: "Example address",
    "Order Details": "Two chairs",
    photoFolderUrl: "",
    "Order Value": 125.5,
    "Shipping cost": 25,
    Prepaid: 0,
    "Net charce": 150.5,
    "Sales Employee": "Example Sales Employee",
    Source: "Website",
    "Order Date": "2026-11-06",
    "Warehouse Status": "تم تجهيز الطلب وأصبح جاهزاً للشحن",
    "Prepared By": "Example Warehouse Employee",
    "Warehouse Updated At": "2026-11-06T10:00:00Z",
    "Warehouse Notes": "",
    "Shipping Company": "",
    "Tracking Number": "",
    "Shipped By": "",
    "Shipping Notes": "",
    "Order Status": "جاهز للشحن",
    "Completed By": "",
    "Completed At": "",
    "Completion Notes": "",
  };
}

test("maps order fields and translates the status", () => {
  const order = recordToOrder(makeRecord());

  assert.equal(order.ticketId, "IC-1001");
  assert.equal(order.customerPhone, "01012345678");
  assert.equal(order.orderValue, 125.5);
  assert.equal(order.prepaid, 0);
  assert.equal(order.netCharge, 150.5);
  assert.equal(order.status, "ready");
  assert.equal(order.completionNotes, "");
});

test("rejects a missing required header", () => {
  const record = makeRecord();
  delete record["Customer Phone"];

  assert.throws(
    () => recordToOrder(record),
    /Missing required column: "Customer Phone"/
  );
});

test("rejects an unknown order status", () => {
  const record = makeRecord();
  record["Order Status"] = "غير معروف";

  assert.throws(() => recordToOrder(record), /Invalid or unknown status value/);
});
