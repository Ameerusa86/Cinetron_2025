"use client";

import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function ClerkAuthButton() {
  return (
    <>
      <Show when="signed-out">
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-secondary/70 px-3.5 text-sm font-medium text-foreground hover:bg-secondary hover:border-foreground/20 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-sm shadow-primary/20"
          >
            Join
          </Link>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="flex items-center clerk-avatar-btn">
          <UserButton
            userProfileUrl="/profile"
            appearance={{
              elements: {
                avatarBox:
                  "ring-1 ring-border hover:ring-primary transition-all duration-200",
                userButtonPopoverCard:
                  "bg-popover border border-border shadow-2xl rounded-xl",
                userButtonPopoverActions: "bg-transparent",
                userButtonPopoverActionButton:
                  "text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors",
                userButtonPopoverActionButtonText:
                  "text-foreground",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </div>
      </Show>
    </>
  );
}
