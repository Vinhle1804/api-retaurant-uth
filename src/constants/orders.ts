//ORDER OFFLINE

export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Rejected: "Rejected",
  Delivered: "Delivered",
  Paid: "Paid",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid,
] as const;
export type OrderStatusType = (typeof OrderStatusValues)[number];

//ORDER ONLINE
export enum PaymentMethod {
  MoMo = "MoMo",
  Cod = "COD",
}

export type DeliveryOption = "priority" | "fast" | "saving" | "later";
