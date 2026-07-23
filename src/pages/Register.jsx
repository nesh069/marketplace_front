import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ email: "", username: "", password: "", phone_number: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email.trim()) { setError("Please enter your email."); return; }
    if (!form.username.trim()) { setError("Please enter a username."); return; }
    if (!form.phone_number.trim()) { setError("Please enter your phone number."); return; }
    if (form.phone_number.length < 10) { setError("Phone number must be at least 10 digits."); return; }
    if (!form.password) { setError("Please enter a password."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      const firstError = data ? Object.values(data).flat().join(". ") : null;
      setError(firstError || "Something went wrong creating your account.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark:bg-navy-900 transition-colors">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-navy-700 dark:text-navy-100 mb-1">Create your account</h1>
        <p className="text-navy-500 dark:text-navy-400 text-sm mb-6">Use your student email so buyers know you&apos;re verified.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Student email</label>
            <input type="email" required value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1 w-full rounded-md border border-navy-200 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500"
              placeholder="student@example.edu" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Username</label>
            <input required value={form.username}
              onChange={(e) => update("username", e.target.value)}
              className="mt-1 w-full rounded-md border border-navy-200 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Phone number</label>
            <input required value={form.phone_number}
              onChange={(e) => update("phone_number", e.target.value)}
              placeholder="2547XXXXXXXX"
              className="mt-1 w-full rounded-md border border-navy-200 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
            <p className="text-xs text-navy-500 dark:text-navy-400 mt-1">Used for payment processing when you buy something.</p>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Password</label>
            <input type="password" required minLength={8} value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="mt-1 w-full rounded-md border border-navy-200 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" className="w-full bg-navy-600 dark:bg-navy-700 text-white rounded-md py-2 text-sm font-medium hover:bg-navy-700 dark:hover:bg-navy-600 transition">
            Create account
          </button>
        </form>

        <p className="text-sm text-navy-500 dark:text-navy-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-navy-600 dark:text-mustard-400 font-medium underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}