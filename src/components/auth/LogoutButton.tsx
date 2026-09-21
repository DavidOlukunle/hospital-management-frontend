"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/src/components/providers/AuthProvider";
import { Button } from "@/src/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
    >
      Sign out
    </Button>
  );
}