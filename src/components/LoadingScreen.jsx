import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  // Increment the percentage in steps of 10 until 100
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          backgroundImage: 'url(https://cdn-res.keymedia.com/cdn-cgi/image/w=1000,h=600,f=auto/https://cdn-res.keymedia.com/cms/images/us/036/0363_639179796181705278.png)',
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
        <div className="relative w-48 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ animation: 'loading-shimmer 1.4s ease-in-out infinite' }}
          />
        </div>
        <h1 className="text-xs text-muted-foreground font-medium tracking-wide">
          {progress < 100 ? 'Getting everything ready…' : 'Ready!'}
        </h1>
        <span className="font-heading font-bold text-lg text-foreground tabular-nums">{progress}%</span>
      </div>
    </div>
  );
}