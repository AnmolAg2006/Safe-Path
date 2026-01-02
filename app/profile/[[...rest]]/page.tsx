"use client";

import PageTransition from "@/components/PageTransition";
import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <PageTransition>
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="
  mb-6 inline-flex items-center gap-2
  rounded-lg bg-blue-600 px-4 py-2
  text-sm font-semibold text-white
  hover:bg-blue-700
  transition
  cursor-pointer
"
      >
        ← Back to Dashboard
      </button>

      {/* Profile Card */}
      <div className="flex justify-center">
        <UserProfile
          routing="path"
          path="/profile"
          appearance={{
            variables: {
              colorPrimary: "#2563eb", // blue-600
              borderRadius: "0.75rem",
            },
            elements: {
              card: "shadow-lg rounded-xl",
              headerTitle: "text-2xl font-bold",
            },
          }}
        />
      </div>
    </div>
    </PageTransition>
  );
}
