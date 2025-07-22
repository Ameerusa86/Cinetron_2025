"use client";

import { useSession } from "next-auth/react";
import { User, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    // Use the API route for sign out
    window.location.href = "/api/auth/signout";
  };

  if (status === "loading") {
    return (
      <div className="btn btn-sm btn-ghost loading">
        <span className="loading loading-spinner loading-xs"></span>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-8 rounded-full ring-2 ring-primary/20">
            {session.user.image ? (
              <Image
                alt={session.user.name || "User"}
                src={session.user.image}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
        >
          <li>
            <div className="flex flex-col gap-1 py-2 px-2 cursor-default">
              <span className="font-medium text-sm">{session.user.name}</span>
              <span className="text-xs text-base-content/60">
                {session.user.email}
              </span>
            </div>
          </li>
          <div className="divider my-1"></div>
          <li>
            <a className="text-sm">
              <User className="w-4 h-4" />
              Profile
            </a>
          </li>
          <li>
            <a className="text-sm">Settings</a>
          </li>
          <div className="divider my-1"></div>
          <li>
            <button
              onClick={handleSignOut}
              className="text-sm text-error hover:bg-error/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-primary gap-2">
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-48 border border-base-300"
      >
        <li>
          <Link href="/auth/signin" className="text-sm gap-3 py-3">
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </li>
      </ul>
    </div>
  );
}
