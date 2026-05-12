import { cn } from "@/lib/utils";

interface CTASectionProps {
  phoneNumber?: string;
}

export function HeroCTA({ phoneNumber = "+4922069090990" }: CTASectionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href={`tel:${phoneNumber}`}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl bg-taxi-yellow px-8 py-4",
          "text-base font-bold text-black shadow-lg shadow-taxi-yellow/25",
          "hover:bg-taxi-yellow-hover transition-all duration-200",
          "hover:scale-105 active:scale-95"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Jetzt anrufen
      </a>
      <a
        href="mailto:info@taxi-overath.de"
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-4",
          "text-base font-semibold text-white",
          "hover:border-taxi-yellow hover:text-taxi-yellow transition-all duration-200",
          "hover:scale-105 active:scale-95"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        Fahrt anfragen
      </a>
    </div>
  );
}
