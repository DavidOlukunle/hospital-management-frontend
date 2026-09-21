"use client";

import { useState } from "react";
import Link from "next/link";

import { LogoutButton } from "@/src/components/auth/LogoutButton";
import { useAuth } from "@/src/components/providers/AuthProvider";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

type NavigationItem = {
  label: string;
  href: string;
};

const patientNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/patient/dashboard",
  },
  {
    label: "Find a specialist",
    href: "/patient/specialists",
  },
  {
    label: "Appointments",
    href: "/patient/appointments",
  },
];

const specialistNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/specialist/dashboard",
  },
];

const adminNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Specialists",
    href: "/admin/specialists",
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
  },
  {
    label: "Users",
    href: "/admin/users",
  },
];

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const navigation =
    user?.role === "ADMIN"
      ? adminNavigation
      : user?.role === "SPECIALIST"
        ? specialistNavigation
        : patientNavigation;

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop / Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border bg-white">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(true)
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-slate-100 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <MenuIcon />
            </button>

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-xl font-bold text-primary"
            >
              CarePoint
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-foreground">
                  {user.name}
                </p>

                <p className="text-xs text-muted">
                  {user.role}
                </p>
              </div>
            )}

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-60 border-r border-border bg-white md:block">
        <div className="flex h-full flex-col">
          <nav className="flex-1 overflow-y-auto p-4">
            <NavigationLinks
              navigation={navigation}
              onNavigate={closeMobileMenu}
            />
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 w-72 max-w-[85vw] border-r border-border bg-white shadow-xl transition-transform duration-200 ease-out md:hidden ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-xl font-bold text-primary"
            >
              CarePoint
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-slate-100 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close navigation menu"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="border-b border-border px-4 py-4">
            {user && (
              <>
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {user.role}
                </p>
              </>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <NavigationLinks
              navigation={navigation}
              onNavigate={closeMobileMenu}
            />
          </nav>

          <div className="border-t border-border p-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen pt-16 md:ml-60">
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavigationLinks({
  navigation,
  onNavigate,
}: {
  navigation: NavigationItem[];
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="block rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-primary-light hover:text-primary-dark"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6l12 12M18 6L6 18"
      />
    </svg>
  );
}