"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Button variant="outline" size={'icon'} onClick={handleLogout} className="rounded-full">
      <LogOut className="size-4" />
    </Button>
  );
}
