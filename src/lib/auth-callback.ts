// Inspect the callback before the Auth client consumes its URL parameters.
// Preserve the URL for the SDK; never log or display callback credentials.
export function authCallbackRoute(url: URL): { pathname: string; error: string } {
  const hash = new URLSearchParams(url.hash.slice(1))
  const hasCallback = hash.has('access_token') || hash.has('refresh_token') ||
    hash.has('error') || hash.has('error_code') || url.searchParams.has('code') ||
    url.searchParams.has('error') || url.searchParams.has('error_code')
  const failed = hash.has('error') || hash.has('error_code') ||
    url.searchParams.has('error') || url.searchParams.has('error_code')
  return {
    pathname: url.pathname === '/' && hasCallback ? '/' : url.pathname,
    error: failed ? 'This confirmation link is invalid, expired or already used. If you have already confirmed your email, sign in below.' : '',
  }
}
