export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <div className="absolute inset-0 rounded-full border-t-white/80 border-r-white/10 border-b-white/10 border-l-white/10 animate-spin" />
          <div className="absolute inset-2 rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 animate-pulse" />
        </div>

        <div className="text-center">
          <p className="text-sm text-white/80">Loading</p>
          <p className="text-xs text-white/40">Please wait...</p>
        </div>
      </div>
    </div>
  );
}
