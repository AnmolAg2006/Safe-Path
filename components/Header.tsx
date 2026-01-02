"use client";

import { useState, useRef, useEffect } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-[1000] bg-white border-b">
      <div className="flex items-center justify-between px-8 py-4">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="/logo.svg"
            alt="SafePath"
            className="h-16 w-auto"
          />
        </div>

        {/* RIGHT: User dropdown */}
        <div className="relative cursor-pointer">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 focus:outline-none cursor-pointer"
          >
            <img
              src={user.imageUrl}
              alt="avatar"
              className="h-10 w-10 rounded-full border cursor-pointer"
            />
            <span className="hidden md:block font-medium text-gray-800 cursor-pointer">
              {user.fullName || user.firstName || "User"}  
            </span>
          </button>

          {/* DROPDOWN */}
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 mt-4 w-72 rounded-xl 
                           bg-slate-900 text-white 
                           shadow-2xl border border-white/10
                           z-[1100] "
              >
                {/* Profile info */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                  <img
                    src={user.imageUrl}
                    className="h-12 w-12 rounded-full "
                    alt="avatar"
                  />
                  <div>
                    <div className="font-semibold">
                      {user.fullName}
                    </div>
                    <div className="text-sm text-slate-400">
                      {user.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                </div>

                {/* Actions */}
<div className="py-2">
  <button
    onClick={() => {
      setOpen(false);
      window.location.href = "/profile";
    }}
    className="flex items-center gap-3 w-full px-4 py-2.5 
               text-left text-slate-200 
               hover:bg-slate-800 transition cursor-pointer"
  >
    ✏️ Edit Profile
  </button>

  <SignOutButton>
    <button
      className="flex items-center gap-3 w-full px-4 py-2.5 
                 text-left text-slate-200 
                 hover:bg-slate-800 transition cursor-pointer"
    >
      🚪 Logout
    </button>
  </SignOutButton>
</div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}

