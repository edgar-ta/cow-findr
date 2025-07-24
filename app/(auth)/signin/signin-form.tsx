"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setLoading(false);
          setError(data.error || "An error occurred during sign-in.");
          return;
        }

        setLoading(false);
        router.push("/dashboard"); // Redirect to /dashboard on success
      } catch (err) {
        setLoading(false);
        setError("An error occurred during sign-in.");
      }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          autoComplete="on"
          placeholder="••••••••"
          required
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <div className="mt-6">
        <button
          type="submit"
          className={`btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </form>
  );
}
