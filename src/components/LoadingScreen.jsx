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
        <div className="flex flex-col items-center gap-3 bg-card/80 backdrop-blur-sm rounded-3xl px-10 py-8 shadow-lg border border-border/40">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center overflow-hidden">
            <img src="https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/34a7de8f6_generated_image.png" alt="SettleSmart" className="w-12 h-12 object-cover" />
          </div>
          <h1 className="font-heading font-bold text-lg text-foreground">SettleSmart</h1>
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}