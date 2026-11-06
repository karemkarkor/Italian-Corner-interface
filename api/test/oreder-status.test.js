import test from "node:test";
import assert from "node:assert/strict";
import { ORDER_STATUS, canTransition } from "../src/domain/order-status.js";

test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.NEW, ORDER_STATUS.PREPARING), true);
});
test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.NEW, ORDER_STATUS.READY), true);
});
test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.PREPARING, ORDER_STATUS.READY), true);
});
test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.READY, ORDER_STATUS.SHIPPED), true);
});
test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.COMPLETED, ORDER_STATUS.PREPARING), false);
});
test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.unkown, ORDER_STATUS.READY), false);
});
test("a new order cannot jump directly to shipped", () => {
  assert.equal(canTransition(ORDER_STATUS.NEW, ORDER_STATUS.unkown), false);
});

test("an inherited object property is not a valid status", () => {
  assert.equal(canTransition(ORDER_STATUS.READY, ORDER_STATUS.READY), false);
});
