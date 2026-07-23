import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Those details don't match an account. Check your email and password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark:bg-navy-900 transition-colors">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-navy-700 dark:text-navy-100 mb-1">Campus Marketplace</h1>
        <p className="text-navy-500 dark:text-navy-400 text-sm mb-6">Log in with your student email.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-navy-200 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500"
              placeholder="student@example.edu"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-navy-200 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500"
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" className="w-full bg-navy-600 dark:bg-navy-700 text-white rounded-md py-2 text-sm font-medium hover:bg-navy-700 dark:hover:bg-navy-600 transition">
            Log in
          </button>
        </form>

        <p className="text-sm text-navy-400 dark:text-navy-500 mt-4">
          New here?{" "}
          <Link to="/register" className="text-navy-600 dark:text-mustard-400 font-medium underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}