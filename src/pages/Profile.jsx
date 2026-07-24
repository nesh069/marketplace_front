import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100 mb-6">My Profile</h1>
      <div className="bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600 p-6 space-y-4">
        <div>
          <p className="text-xs text-navy-400 dark:text-navy-200 uppercase tracking-wide">Email</p>
          <p className="text-sm text-navy-700 dark:text-navy-200 font-medium">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
