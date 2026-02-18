import React, { useState, useContext } from "react";
import { ERPContext } from "../context/ERPContext";

export default function Login() {
  const { login } = useContext(ERPContext);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/mediquick-api/process_login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (data.success) {
        login(data.user_email); // Use the data from your DB
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/mediquick-api/process_register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        setIsSignUp(false); // Switch to login view
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Register" : "Login"}
        </h1>

        <form
          onSubmit={isSignUp ? handleRegister : handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            {isSignUp ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isSignUp ? "Login here" : "Sign Up here"}
          </button>
        </p>
      </div>
    </div>
  );
}
