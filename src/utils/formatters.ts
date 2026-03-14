/**
 * Shared formatting utilities for input fields
 */

/**
 * Format number with dots for thousands (id-ID style)
 */
export const formatWithDots = (value: number | ""): string => {
  if (value === "" || isNaN(Number(value))) return "";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    Math.round(Number(value)),
  );
};

/**
 * Parse number from formatted string (removes non-digits)
 */
export const parseDotNumber = (value: string): number | "" => {
  const normalized = value.replace(/[^\d]/g, "");
  if (!normalized) return "";
  return Number(normalized);
};

/**
 * Preserve cursor position after reformatting numeric input
 */
export const preserveCaretAfterFormat = (
  inputEl: HTMLInputElement,
  digitsBeforeCursor: number,
  formatted: string,
) => {
  if (!formatted) {
    inputEl.setSelectionRange(0, 0);
    return;
  }

  let digitSeen = 0;
  let nextCursor = formatted.length;

  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitSeen += 1;
    }
    if (digitSeen >= Math.max(1, digitsBeforeCursor)) {
      nextCursor = i + 1;
      break;
    }
  }

  inputEl.setSelectionRange(nextCursor, nextCursor);
};

/**
 * Capping numeric values (utility for input guards)
 */
export const withCap = (value: number | "", max: number): number | "" => {
  if (value === "") return "";
  return value > max ? max : value;
};
