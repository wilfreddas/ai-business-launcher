// src/lib/format.ts
//
// Small formatting helpers applied to real user-entered data (never used to
// invent facts — only to present what was actually typed more cleanly).

/**
 * Formats a phone number for display. If the owner already typed dashes (or
 * any other separator), it's left exactly as entered. If they typed plain
 * digits, dashes are added for a standard US-style layout.
 */
export function formatPhoneDisplay(phone: string | undefined | null): string {
  if (!phone) return "";
  if (phone.includes("-")) return phone;

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone;
}

/** Strips a phone number down to a tel: href-safe value (digits and a leading +). */
export function phoneHref(phone: string | undefined | null): string {
  if (!phone) return "";
  return phone.replace(/[^\d+]/g, "");
}

const US_STATE_ABBR = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN",
  "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV",
  "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN",
  "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
]);

/**
 * Best-effort extraction of a US state abbreviation from a free-text address
 * like "Sterling, VA" or "123 Main St, Albany, NY 12207". Returns "—" if
 * nothing recognizable is found (e.g. international addresses).
 */
export function extractState(address: string | undefined | null): string {
  if (!address) return "—";
  const tokens = address.toUpperCase().match(/\b[A-Z]{2}\b/g);
  if (!tokens) return "—";

  // States typically appear right before the zip, near the end of the
  // address, so check from the end first.
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    if (US_STATE_ABBR.has(tokens[i])) return tokens[i];
  }
  return "—";
}
