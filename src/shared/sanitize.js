const SENSITIVE_KEYS = ["password", "token", "authorization", "jwt", "newPassword"];

export function sanitize(obj, depth = 0) {
  try {
    if (!obj || typeof obj !== "object" || depth > 3) return obj;
    const copy = Array.isArray(obj) ? [] : {};
    for (const k of Object.keys(obj)) {
      if (SENSITIVE_KEYS.includes(k.toLowerCase())) {
        copy[k] = "***";
      } else if (typeof obj[k] === "object") {
        copy[k] = sanitize(obj[k], depth + 1);
      } else {
        copy[k] = obj[k];
      }
    }
    return copy;
  } catch {
    return {};
  }
}
