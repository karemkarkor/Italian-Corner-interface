import { ORDER_STATUS } from "../domain/order-status.js";

const ORDER_FIELDS = {
  ticketId: "Ticket ID",
  createdAt: "Created At",
  customerName: "Customer Name",
  customerPhone: "Customer Phone",
  address: "Address",
  orderDetails: "Order Details",
  photoFolderUrl: "photoFolderUrl",
  orderValue: "Order Value",
  shippingCost: "Shipping cost",
  prepaid: "Prepaid",
  netCharge: "Net charce",
  salesEmployee: "Sales Employee",
  source: "Source",
  orderDate: "Order Date",
  warehouseStatus: "Warehouse Status",
  preparedBy: "Prepared By",
  warehouseUpdatedAt: "Warehouse Updated At",
  warehouseNotes: "Warehouse Notes",
  shippingCompany: "Shipping Company",
  trackingNumber: "Tracking Number",
  shippedBy: "Shipped By",
  shippingNotes: "Shipping Notes",
  status: "Order Status",
  completedBy: "Completed By",
  completedAt: "Completed At",
  completionNotes: "Completion Notes",
};

const STATUS_FROM_SHEET = new Map([
  ["جديد", ORDER_STATUS.NEW],
  ["قيد التجهيز", ORDER_STATUS.PREPARING],
  ["جاهز للشحن", ORDER_STATUS.READY],
  ["تم الشحن", ORDER_STATUS.SHIPPED],
  ["مكتمل", ORDER_STATUS.COMPLETED],
]);

export function recordToOrder(record) {
  const order = {};

  for (const [property, header] of Object.entries(ORDER_FIELDS)) {
    if (!Object.hasOwn(record, header)) {
      throw new Error(`Missing required column: "${header}"`);
    }

    order[property] = record[header];
  }

  const translatedStatus = STATUS_FROM_SHEET.get(order.status);

  if (translatedStatus === undefined) {
    throw new Error(`Invalid or unknown status value: "${order.status}"`);
  }
  order.status = translatedStatus;

  return order;
}
