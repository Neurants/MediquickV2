import React, { useContext } from "react";
import { ERPContext } from "../context/ERPContext";

export default function NursePage() {
  const { prescriptions, addOrder, orders } = useContext(ERPContext);

  const handleOrder = (prescription) => {
    addOrder({
      patientName: prescription.patientName,
      medicine: prescription.medicine,
      dosage: prescription.dosage,
      nurse: "Nurse User",
    });

    alert("Order sent to Clerk!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold text-purple-300 mb-6">
        Nurse Dashboard
      </h1>

      {/* PRESCRIPTIONS */}
      <div className="bg-white/10 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Prescriptions from Doctor
        </h2>

        {prescriptions.length === 0 && (
          <p className="text-gray-300">No prescriptions yet.</p>
        )}

        {prescriptions.map((p, index) => (
          <div
            key={index}
            className="bg-white/10 p-4 rounded mb-4"
          >
            <p><strong>Patient:</strong> {p.patientName}</p>
            <p><strong>Medicine:</strong> {p.medicine}</p>
            <p><strong>Dosage:</strong> {p.dosage}</p>

            <button
              onClick={() => handleOrder(p)}
              className="mt-3 bg-purple-600 px-4 py-1 rounded"
            >
              Order Medicine
            </button>
          </div>
        ))}
      </div>

      {/* ORDER TRACKING */}
      <div className="bg-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          My Orders
        </h2>

        {orders.length === 0 && (
          <p className="text-gray-300">No orders yet.</p>
        )}

        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white/10 p-4 rounded mb-4"
          >
            <p><strong>Patient:</strong> {order.patientName}</p>
            <p><strong>Medicine:</strong> {order.medicine}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}