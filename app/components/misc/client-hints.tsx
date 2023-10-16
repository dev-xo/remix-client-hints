/**
 * Source: https://github.com/epicweb-dev/epic-stack
 * Source code adapted for this template.
 */
import { useEffect } from 'react'
import { useRevalidator } from '@remix-run/react'
import { clientHints } from '~/utils/hooks/use-hints.ts'

/**
 * Injects an inline script that checks/sets CH Cookies (if not present).
 * Reloads the page if any Cookie was set to an inaccurate value.
 */
export function ClientHints() {
  const { revalidate } = useRevalidator()

  useEffect(() => {
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleThemeChange() {
      document.cookie = `${clientHints.theme.cookieName}=${
        themeQuery.matches ? 'dark' : 'light'
      }; Max-Age=31536000; Path=/`
      revalidate()
    }

    themeQuery.addEventListener('change', handleThemeChange)

    return () => {
      themeQuery.removeEventListener('change', handleThemeChange)
    }
  }, [revalidate])

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
					const cookies = document.cookie.split(';').map(c => c.trim()).reduce((acc, cur) => {
						const [key, value] = cur.split('=');
						acc[key] = value;
						return acc;
					}, {});
					let hasCookieChanged = false;
					
					const hints = [
						${Object.values(clientHints)
              .map((hint) => {
                const cookieName = JSON.stringify(hint.cookieName)
                return `{ name: ${cookieName}, actual: String(${hint.getValueCode}), cookie: cookies[${cookieName}] }`
              })
              .join(',\n')}
					];

					for (const hint of hints) {
						if (decodeURIComponent(hint.cookie) !== hint.actual) {
							hasCookieChanged = true;
							document.cookie = encodeURIComponent(hint.name) + '=' + encodeURIComponent(hint.actual) + '; Max-Age=31536000; path=/';
						}
					}

					// On Cookie change, reload the page, unless the browser doesn't support Cookies. 
					if (hasCookieChanged && navigator.cookieEnabled) {
						window.location.reload();
					}
				`,
      }}
    />
  )
}
