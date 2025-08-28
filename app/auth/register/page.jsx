"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function validateForm() {
    if (!name.trim() || name.length < 2) {
      return "Name must be at least 2 characters long.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  }

  async function handle(e) {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        { name, email, password }
      );
      router.push("/auth/login");
    } catch (err) {
      console.log("err", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handle} className="space-y-4">
          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
          <input
            type="email"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); 
            }}
          />
          <input
            type="password"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <span
            className="text-green-600 font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
