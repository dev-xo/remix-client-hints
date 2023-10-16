/**
 * Source: https://github.com/epicweb-dev/epic-stack
 * Source code adapted for this template.
 *
 * Client Hints MDX:
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints
 */
import { useRequestInfo } from '~/utils/hooks/use-request-info.ts'

export const CH_PREFERS_COLOR_SCHEME_COOKIE_KEY = 'CH-prefers-color-scheme'
export const CH_TIME_ZONE_COOKIE_KEY = 'CH-time-zone'

export const clientHints = {
  theme: {
    cookieName: CH_PREFERS_COLOR_SCHEME_COOKIE_KEY,
    getValueCode: `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`,
    fallback: 'light',
    transform(value: string) {
      return value === 'dark' ? 'dark' : 'light'
    },
  },
  timeZone: {
    cookieName: CH_TIME_ZONE_COOKIE_KEY,
    getValueCode: `Intl.DateTimeFormat().resolvedOptions().timeZone`,
    fallback: 'UTC',
  },
  // Add more Client Hints here.
  // ...
}

type ClientHintsNames = keyof typeof clientHints

/**
 * Returns the value of a Client Hint from the provided Cookie string.
 */
function getClientHintCookieValue(cookieString: string, name: ClientHintsNames) {
  const hint = clientHints[name]

  if (!hint) {
    throw new Error(`Unknown Client Hint: ${name}.`)
  }

  const value = cookieString
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(hint.cookieName + '='))
    ?.split('=')[1]

  return value ? decodeURIComponent(value) : null
}

/**
 * Returns an object with the Client Hints and their values.
 */
export function getHints(request?: Request) {
  const cookieString =
    typeof document !== 'undefined'
      ? document.cookie
      : typeof request !== 'undefined'
      ? request.headers.get('Cookie') ?? ''
      : ''

  return Object.entries(clientHints).reduce(
    (acc, [name, hint]) => {
      const hintName = name as ClientHintsNames

      if ('transform' in hint) {
        acc[hintName] = hint.transform(
          getClientHintCookieValue(cookieString, hintName) ?? hint.fallback,
        )
      } else {
        // @ts-expect-error - No error on here, requires Epic Stack PR fix.
        acc[hintName] = getClientHintCookieValue(cookieString, hintName) ?? hint.fallback
      }

      return acc
    },
    {} as {
      [name in ClientHintsNames]: (typeof clientHints)[name] extends {
        transform: (value: any) => infer ReturnValue
      }
        ? ReturnValue
        : (typeof clientHints)[name]['fallback']
    },
  )
}

/**
 * Returns the Client Hints from the Root loader.
 */
export function useHints() {
  const requestInfo = useRequestInfo()
  return requestInfo.hints
}
