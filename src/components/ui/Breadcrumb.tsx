"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Home, User } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showBackButton = true,
  className = "",
}) => {
  const router = useRouter();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-2 mb-6 ${className}`}
    >
      {showBackButton && (
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>
      )}

      <ol className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </Link>
              ) : item.action ? (
                <button
                  type="button"
                  onClick={item.action}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 font-medium ${
                    isLast ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

interface ProfileBreadcrumbProps {
  currentPage: string;
  showBackButton?: boolean;
}

export const ProfileBreadcrumb: React.FC<ProfileBreadcrumbProps> = ({
  currentPage,
  showBackButton = true,
}) => {
  const router = useRouter();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Profile", action: () => router.push("/profile"), icon: User },
    { label: currentPage },
  ];

  return (
    <Breadcrumb
      items={breadcrumbItems}
      showBackButton={showBackButton}
      className="mb-6"
    />
  );
};

export default Breadcrumb;
