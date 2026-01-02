"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Authenticated → go to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // Not authenticated → go to sign-in
  redirect("/sign-in");

  
}
