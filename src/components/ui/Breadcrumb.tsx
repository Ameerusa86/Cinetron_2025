"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Home, User } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className={`flex items-center gap-2 mb-6 ${className}`}>
      {showBackButton && (
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-lg text-slate-300 hover:text-white transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      )}

      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className="w-4 h-4 text-slate-400" />}

              {item.href ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-slate-400 hover:text-orange-400 transition-colors"
                >
                  {item.label}
                </Link>
              ) : item.action ? (
                <button
                  onClick={item.action}
                  className="text-sm font-medium text-slate-400 hover:text-orange-400 transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={`text-sm font-medium ${
                    index === items.length - 1 ? "text-white" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </div>

            {index < items.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Profile-specific breadcrumb component
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
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Profile",
      action: () => router.push("/profile"),
      icon: User,
    },
    {
      label: currentPage,
    },
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
