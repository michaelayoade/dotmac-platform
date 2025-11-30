// src/utils/csp.ts
function generateNonce() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + "==";
}
function generateCSP(nonce, isDevelopment = false) {
  const policies = [
    `default-src 'self'`,
    // Use nonce for scripts instead of unsafe-inline
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    // Tightened CSP: Remove unsafe-inline in production, use nonce for inline styles
    `style-src 'self'${isDevelopment ? " 'unsafe-inline'" : ` 'nonce-${nonce}'`} fonts.googleapis.com`,
    `font-src 'self' fonts.gstatic.com data:`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' ws: wss: https:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`
  ];
  return policies.join("; ");
}
function generateCSPMeta(nonce) {
  const csp = generateCSP(nonce, process.env["NODE_ENV"] === "development");
  return `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
}
function extractNonce(cspHeader) {
  const match = cspHeader.match(/'nonce-([^']+)'/);
  return match ? match[1] : null;
}
function isValidNonce(nonce) {
  return /^[A-Za-z0-9+/]{22}==$/.test(nonce);
}

export { extractNonce, generateCSP, generateCSPMeta, generateNonce, isValidNonce };
//# sourceMappingURL=csp.mjs.map
//# sourceMappingURL=csp.mjs.map