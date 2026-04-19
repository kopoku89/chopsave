import Link from "next/link";

import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-surface-cream px-6 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-hero text-white shadow-pop">
        <span className="text-3xl font-black">404</span>
      </div>
      <h1 className="text-xl font-extrabold text-ink">Page off the menu</h1>
      <p className="max-w-xs text-sm text-ink-muted">
        The page you're looking for has been rescued already. Try one of our
        fresh deals instead.
      </p>
      <Link href="/">
        <Button size="lg">Back to home</Button>
      </Link>
    </div>
  );
}
