export const ORDER_STATUS = {
  NEW: "new",
  PREPARING: "preparing",
  READY: "ready",
  SHIPPED: "shipped",
  COMPLETED: "completed",
};

const allowedTransitions = {
  [ORDER_STATUS.NEW]: [ORDER_STATUS.PREPARING, ORDER_STATUS.READY],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY],
  [ORDER_STATUS.READY]: [ORDER_STATUS.SHIPPED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.COMPLETED],
};

export function canTransition(from, to) {
  const allowedNext = allowedTransitions[from];
  if (!Array.isArray(allowedNext)) {
    return false;
  }
  return allowedNext.includes(to);
}
