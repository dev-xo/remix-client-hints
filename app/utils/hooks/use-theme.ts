/**
 * Source: https://github.com/epicweb-dev/epic-stack
 * Source code adapted for this template.
 */
import * as cookie from 'cookie'

import { useFetchers } from '@remix-run/react'
import { useHints } from '~/utils/hooks/use-hints.ts'
import { useRequestInfo } from '~/utils/hooks/use-request-info.ts'

import {
  ThemeFormSchema,
  ROUTE_PATH as THEME_UPDATE_PATH,
} from '~/routes/resources.theme.tsx'

export const THEME_COOKIE_KEY = 'theme'
export type Theme = 'light' | 'dark' | undefined

/**
 * Returns a parsed Cookie theme value, or undefined
 * if the Cookie is not present or invalid.
 */
export function getTheme(request: Request): Theme {
  const cookieHeader = request.headers.get('Cookie')
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[THEME_COOKIE_KEY] : 'light'

  if (parsed === 'light' || parsed === 'dark') {
    return parsed
  }

  return undefined
}

/**
 * Returns a serialized Cookie string for the given theme.
 */
export function setTheme(theme?: Theme) {
  if (theme) {
    return cookie.serialize(THEME_COOKIE_KEY, theme, {
      path: '/',
      sameSite: 'lax',
    })
  } else {
    return cookie.serialize(THEME_COOKIE_KEY, '', {
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    })
  }
}

/**
 * Returns the user's theme preference, or the Client Hint theme,
 * if the user has not set a preference.
 */
export function useTheme() {
  const hints = useHints()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()

  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode
  }

  return requestInfo.userPrefs.theme ?? hints.theme
}

/**
 * If the user's changing their theme mode preference,
 * this will return the value it's being changed to.
 */
export function useOptimisticThemeMode() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find((f) => f.formAction?.startsWith(THEME_UPDATE_PATH))

  if (themeFetcher && themeFetcher.formData) {
    const formData = Object.fromEntries(themeFetcher.formData)
    const { theme } = ThemeFormSchema.parse(formData)

    return theme
  }
}
