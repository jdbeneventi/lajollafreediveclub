"use client";

export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/portal";
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white/40 text-xs cursor-pointer bg-transparent border border-white/10 rounded-full px-4 py-2 hover:text-white hover:border-white/20 transition-colors"
    >
      Sign out
    </button>
  );
}
