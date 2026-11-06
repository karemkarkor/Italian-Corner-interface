import test from "node:test";
import assert from "node:assert/strict";
import { ORDER_STATUS, canTransition } from "../src/domain/order-status.js";

const cases = [
  [ORDER_STATUS.NEW, ORDER_STATUS.PREPARING, true],
  [ORDER_STATUS.NEW, ORDER_STATUS.READY, true],
  [ORDER_STATUS.PREPARING, ORDER_STATUS.READY, true],
  [ORDER_STATUS.READY, ORDER_STATUS.SHIPPED, true],
  [ORDER_STATUS.SHIPPED, ORDER_STATUS.COMPLETED, true],

  [ORDER_STATUS.NEW, ORDER_STATUS.SHIPPED, false],
  [ORDER_STATUS.COMPLETED, ORDER_STATUS.PREPARING, false],
  [ORDER_STATUS.READY, ORDER_STATUS.READY, false],

  ["unknown", ORDER_STATUS.READY, false],
  [ORDER_STATUS.NEW, "unknown", false],
  ["constructor", ORDER_STATUS.READY, false],
  ["__proto__", ORDER_STATUS.READY, false],
];

for (const [from, to, expected] of cases) {
  test(`${from} -> ${to}: expected ${expected}`, () => {
    assert.equal(canTransition(from, to), expected);
  });
}
