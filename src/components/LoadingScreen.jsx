export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          backgroundImage: 'url(https://images4.alphacoders.com/722/72234.jpg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.85,
        }}
      />
      <style>{`
        @keyframes loading-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.04); }
        }
        @keyframes loading-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loading-bar-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes loading-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center" style={{ animation: 'loading-float 2.4s ease-in-out infinite' }}>
          <span
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/40"
            style={{ animation: 'loading-ring-spin 1.2s linear infinite' }}
          />
          <span
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary/60 border-l-primary/20"
            style={{ animation: 'loading-ring-spin 1.8s linear infinite reverse' }}
          />
        </div>
        <h1 className="font-heading font-bold text-2xl text-foreground tracking-tight">SettleSmart</h1>
        <div className="relative w-48 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ animation: 'loading-bar-fill 2s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ animation: 'loading-shimmer 1.4s ease-in-out infinite' }}
          />
        </div>
        <p className="text-xs text-muted-foreground font-medium tracking-wide">Getting everything ready…</p>
      </div>
    </div>
  );
}