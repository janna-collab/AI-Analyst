import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes efficiently, handling conflicts automatically.
 * Standard practice in professional React/Tailwind setups.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}