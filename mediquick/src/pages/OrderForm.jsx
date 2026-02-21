import React, { useContext } from "react";
import { ERPContext } from "../context/ERPContext";

export default function OrderForm() {
  const { selectedPharmacy } = useContext(ERPContext);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="font-bold">Selected Pharmacy:</p>
        <p>{selectedPharmacy?.name}</p>
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Proceed to Chat
      </button>
    </div>
  );
}