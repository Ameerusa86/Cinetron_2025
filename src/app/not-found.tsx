import Link from "next/link";
import { Film, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="surface-card max-w-md w-full p-8 sm:p-10 text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
          <Film className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Error 404
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Scene Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The film, series, or page you&apos;re looking for doesn&apos;t exist
            or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/" className="btn-cinema">
            <Home className="h-4 w-4" />
            <span>Back Home</span>
          </Link>
          <Link href="/search" className="btn-cinema-outline">
            <Search className="h-4 w-4" />
            <span>Search Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
