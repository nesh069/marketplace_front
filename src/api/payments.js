import api from "./client";

export function initiatePayment(listingId, phoneNumber) {
  return api.post("/payments/pay/", {
    listing_id: Number(listingId),
    phone_number: phoneNumber,
  });
}

export function getPaymentStatus(transactionId) {
  return api.get(`/payments/status/${transactionId}/`);
}

export function getSavedTransactions() {
  try {
    return JSON.parse(localStorage.getItem("transactions") || "[]");
  } catch {
    return [];
  }
}

export function saveTransaction(tx) {
  const list = getSavedTransactions();
  if (!list.find((t) => t.id === tx.id)) {
    list.push(tx);
    localStorage.setItem("transactions", JSON.stringify(list));
  }
}
