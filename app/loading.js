import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <Loader2 size={48} className="animate-spin text-primary mb-4" />
      <p className="text-slate-500 font-bold tracking-tight">Loading SnapFreeTools...</p>
    </div>
  );
}
