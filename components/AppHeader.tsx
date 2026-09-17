"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", stub: false },
  { href: "/calendar", label: "Kalender", stub: false },
  { href: "/start-fee", label: "Startgeld", stub: true },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="app-header" data-testid="app-header">
      <div className="app-header__brand">
        <Link href="/" aria-label="Startlist home">
          <Image
            src="/images/dsd-logo.png"
            alt="DSD"
            width={120}
            height={32}
            priority
          />
        </Link>
      </div>

      <nav className="app-header__nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              data-stub={item.stub ? "true" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="app-header__account" data-testid="account-placeholder">
        Account
      </div>
    </header>
  );
}
