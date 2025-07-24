"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, phone, password }),
      });
      setLoading(false);
      router.push("/dashboard");
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label
          className="mb-1 block text-sm font-medium text-gray-700"
          htmlFor="fullName"
        >
          Full Name
        </label>
        <input
          id="fullName"
          className="form-input w-full py-2"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          className="form-input w-full py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          required
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-gray-700"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          id="phone"
          className="form-input w-full py-2"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+123 456 789"
          required
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-gray-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          className="form-input w-full py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className={`mt-4 w-full rounded py-2 text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
}
