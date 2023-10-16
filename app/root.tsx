import type { LinksFunction, DataFunctionArgs } from '@remix-run/node'
import type { Theme } from '~/utils/hooks/use-theme.ts'

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { json } from '@remix-run/node'
import { cssBundleHref } from '@remix-run/css-bundle'

import { getHints } from '~/utils/hooks/use-hints.ts'
import { getTheme, useTheme } from '~/utils/hooks/use-theme.ts'
import { getDomainUrl } from './utils/misc.server.ts'

import { ClientHints } from '~/components/misc/client-hints.tsx'
import { GenericErrorBoundary } from './components/misc/error-boundary.tsx'

import TailwindStylesheet from '~/root.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: TailwindStylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export async function loader({ request }: DataFunctionArgs) {
  return json({
    requestInfo: {
      hints: getHints(request),
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
      userPrefs: { theme: getTheme(request) },
    },
  } as const)
}

function Document({
  children,
  theme = 'light',
}: {
  children: React.ReactNode
  theme?: Theme
}) {
  return (
    <html className={`${theme}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ClientHints />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default function App() {
  const theme = useTheme()

  return (
    <Document theme={theme}>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary() {
  const theme = useTheme()

  /**
   * NOTE: `useLoaderData` is not available in the Error-Boundary.
   * The loader likely failed to run so we have to do the best we can.
   */
  return (
    <Document theme={theme}>
      <GenericErrorBoundary />
    </Document>
  )
}
