/**
 * HTTP.
 */
export function getDomainUrl(request: Request) {
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('Host')
  if (!host) return null

  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}
