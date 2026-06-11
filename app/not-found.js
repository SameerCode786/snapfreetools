import Link from "next/link";
import { Hammer } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-50 text-red-500 p-4 rounded-3xl mb-6">
        <Hammer size={48} className="rotate-45" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4">404 - Page Not Found</h1>
      <p className="text-slate-600 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-100 hover:shadow-emerald-250 hover:bg-primary-dark transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
}
