import React, { useContext } from "react";
import { ERPContext } from "./context/ERPContext";
import Sidebar from "./components/Sidebar";
import StartPage from "./pages/StartPage";
import OrderPage from "./pages/OrderPage";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const { isLoggedIn, currentPage } = useContext(ERPContext);

  if (!isLoggedIn) return <Login />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen p-8">
        {currentPage === "start" && <StartPage />}
        {currentPage === "order" && <OrderPage />}
        {currentPage === "admin" && <AdminPage />}
      </div>
    </div>
  );
}