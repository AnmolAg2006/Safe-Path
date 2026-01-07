export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      
      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-[45%] h-screen items-center justify-center  ">
        <img
          src="/auth-hero.jpg"
          alt="SafePath Auth Visual"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            objectFit: "contain",
            borderRadius: "28px",
            scale: "0.875",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            
          }}
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>

    </div>
  )
}
