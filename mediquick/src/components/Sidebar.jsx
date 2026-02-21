import React, { useContext } from "react";
import { ERPContext } from "../context/ERPContext";

export default function Sidebar() {
  const { user, logout } = useContext(ERPContext);

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-10">MediQuick</h1>

      <div className="space-y-6">
        <div className="bg-blue-800 p-4 rounded">
          <p className="font-semibold">Profile</p>
          <p className="text-sm">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-500 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}