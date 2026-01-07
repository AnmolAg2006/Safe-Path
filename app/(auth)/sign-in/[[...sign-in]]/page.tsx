import PageTransition from "@/components/PageTransition";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <PageTransition>
    <div className="min-h-screen flex items-center justify-center scale-80">
      <div className="w-full max-w-md scale-125 flex flex-col items-center px-6 py-12">
        <div className="text-center mb-7 ">
          <img
            src="/logo.svg"
            alt="SafePath"
            className="h-12 block scale-140 ml-16 mb-5"
          />
        </div>

        <SignIn
      appearance={{
        variables: {
          colorPrimary: "#4f46e5", // indigo-600
          colorText: "#0f172a",    // slate-900
          colorBackground: "#ffffff",
          borderRadius: "12px",
        },
        elements: {
          card: "shadow-xl rounded-2xl",
          headerTitle: "text-xl font-semibold",
          headerSubtitle: "text-sm text-slate-500",

          formButtonPrimary:
            "bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200",

          socialButtonsBlockButton:
            "border border-slate-200 hover:bg-slate-50 transition-colors",

          formFieldInput:
            "rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500",

          footerActionLink:
            "text-indigo-600 hover:text-indigo-700 font-medium",
        },
      }}
    />
      </div>
    </div>
    </PageTransition>
  );
}
