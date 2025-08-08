import { paymentsMock } from "~/utils/fakeApi/mock-data";

export const getPaymentById = (id) => {
  return new Promise((resolve) => {
    const payment = paymentsMock.find((p) => p.id === id);
    resolve({ data: payment });
  });
};
