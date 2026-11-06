import test from "node:test";
import assert from "node:assert/strict";
import { ORDER_STATUS, canTransition } from "../src/domain/order-status.js";

test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.NEW, ORDER_STATUS.SHIPPED), false);
});
