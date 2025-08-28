"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "text-indigo-600 font-semibold" : "hover:text-indigo-600";

  return (
    <nav className="bg-dark shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          BlogApp
        </Link>

        <div className="flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>

          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className={isActive("/dashboard")}>
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              {pathname === "/auth/login" ? (
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              ) : pathname === "/auth/register" ? (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className={isActive("/auth/login")}>
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
