export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <div
        className="w-full h-full flex flex-col items-center justify-center animate-fade-in"
        style={{
          backgroundImage: 'url(https://png.pngtree.com/png-vector/20220721/ourmid/pngtree-grunge-canada-flag-brush-stroke-transparent-png-png-image_6027240.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <span className="absolute inset-2 rounded-full bg-primary/30 animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="relative w-14 h-14 rounded-2xl bg-primary flex items-center justify-center overflow-hidden shadow-lg">
              <img src="https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/34a7de8f6_generated_image.png" alt="SettleSmart" className="w-14 h-14 object-cover" />
            </div>
          </div>
          <h1 className="font-heading font-bold text-xl text-foreground tracking-tight">SettleSmart</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}