export const deliveryOptions = [
    {
      id: "priority",
      label: "Ưu tiên",
      time: "< 30 phút",
      price: 23000,
      description:
        "Đơn hàng của bạn sẽ được ưu tiên giao trong thời gian ngắn hơn. Bạn cũng sẽ nhận được một phiếu ưu đãi nếu đ...",
    },
    {
      id: "fast",
      label: "Nhanh",
      time: "30 phút",
      price: 18000,
    },
    {
      id: "saving",
      label: "Tiết kiệm",
      time: "45 phút",
      price: 14000,
    },
    {
      id: "later",
      label: "Đặt giao sau",
      time: "",
      price: 0,
    },
  ];

  export const deliveryOptionIds = ["priority", "fast", "saving", "later"] as const;
  