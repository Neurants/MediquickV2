import React, { useContext, useState } from "react";
import { ERPContext } from "../context/ERPContext";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { selectedPharmacy } = useContext(ERPContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  const handlePayment = () => {
    alert("Payment Successful!");
    navigate("/my-orders");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>

      <p className="mb-2">
        Pharmacy: <strong>{selectedPharmacy?.name}</strong>
      </p>

      <div className="mt-4">
        <label className="block mb-2 font-semibold">Select Payment Method</label>

        <select
          className="border p-2 rounded w-full"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="gcash">GCash</option>
          <option value="cod">Cash on Delivery</option>
          <option value="card">Credit/Debit Card</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Confirm Payment
      </button>
    </div>
  );
}