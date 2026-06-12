export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-lg px-5 py-4 shadow-lg">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full bg-primary"
            style={{
              display: "inline-block",
              animation: "bounceDot 0.6s infinite alternate",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <p
        className="text-sm font-medium text-muted-foreground"
        style={{ animation: "fadeText 1.2s infinite alternate" }}
      >
        Loading
      </p>
      <style>{`
        @keyframes bounceDot {
          0%   { transform: translateY(0px) scale(1); opacity: 0.5; }
          100% { transform: translateY(-14px) scale(1.3); opacity: 1; }
        }
        @keyframes fadeText {
          0%   { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
