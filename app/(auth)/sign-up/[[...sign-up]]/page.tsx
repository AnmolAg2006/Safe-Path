"use client";

import PageTransition from "@/components/PageTransition";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <PageTransition>
    <div className="min-h-screen flex items-center justify-center scale-75">
          <div className="w-full max-w-md scale-125 flex flex-col items-center px-6 pb-12">
            <div className="text-center mb-7 ">
              <img
                src="/logo.svg"
                alt="SafePath"
                className="h-12 block scale-140 ml-16 mt-5"
              />
            </div>
    
            <SignUp
              appearance={{
                elements: {
                  card: "shadow-lg rounded-xl",
                  headerTitle: "text-2xl font-bold",
                  formButtonPrimary:
                    "bg-blue-600 hover:bg-blue-700 text-sm font-medium",
                },
              }}
            />
          </div>
        </div>
        </PageTransition>
      );
    }
    
