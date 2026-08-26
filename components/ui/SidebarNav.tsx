"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLink {
  href: string;
  label: string;
}

export function SidebarNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-white/10 text-white font-medium"
                : "hover:bg-white/5 text-zinc-300 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
