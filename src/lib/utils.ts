import { clsx, type ClassValue } from "clsx";

/** Tailwind-friendly className combiner. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Generate a short, human-friendly pickup code, e.g. "CHS-4F7K". */
export function generatePickupCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CHS-${code}`;
}

/** Short id generator, URL-safe. */
export function genId(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}
