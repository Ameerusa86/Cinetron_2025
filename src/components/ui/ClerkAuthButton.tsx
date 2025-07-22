"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ClerkAuthButton() {
  return (
    <>
      {/* When signed out */}
      <SignedOut>
        <div className="flex items-center space-x-2">
          <Link href="/sign-in">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </motion.button>
          </Link>
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </SignedOut>

      {/* When signed in */}
      <SignedIn>
        <div className="flex items-center">
          {/* Clerk User Button */}
          <UserButton
            afterSignOutUrl="/"
            userProfileUrl="/profile"
            appearance={{
              elements: {
                avatarBox:
                  "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 border-2 border-orange-500/50 hover:border-orange-500 transition-colors",
                userButtonPopoverCard: `
                  bg-slate-900/90 
                  backdrop-blur-xl 
                  border 
                  border-white/10 
                  shadow-2xl 
                  shadow-black/50 
                  rounded-2xl
                `,
                userButtonPopoverActions: "bg-transparent",
                userButtonPopoverActionButton: `
                  text-slate-300 
                  hover:text-white 
                  hover:bg-white/10 
                  rounded-lg 
                  transition-all 
                  duration-200
                `,
                userButtonPopoverActionButtonText:
                  "text-slate-300 hover:text-white",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}
