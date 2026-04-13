import Link from "next/link";
import { Nav } from "@/components/nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-md px-6">
          <p className="text-6xl font-bold text-primary mb-4">404</p>
          <h1 className="text-xl font-bold text-primary mb-2">Page not found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
          >
            Go home
          </Link>
        </div>
      </main>
    </>
  );
}
