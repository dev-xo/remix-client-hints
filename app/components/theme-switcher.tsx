import type { Theme } from '~/utils/hooks/use-theme.ts' // Returns: type Theme = "light" | "dark" | undefined

import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { motion, AnimatePresence } from 'framer-motion'

import { useRequestInfo } from '~/utils/hooks/use-request-info.ts'
import { useOptimisticThemeMode } from '~/utils/hooks/use-theme.ts'

import { ROUTE_PATH as THEME_PATH } from '~/routes/resources.theme.tsx'

type ExtendedTheme = Theme | 'system'

export function ThemeSwitcher({ userPreference }: { userPreference?: 'light' | 'dark' }) {
  const fetcher = useFetcher()
  const isHydrated = useHydrated()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()

  const mode = optimisticMode ?? userPreference ?? 'system'

  // Available themes based on your `Theme` type + 'system'.
  const availableThemes: ExtendedTheme[] = ['light', 'dark', 'system']

  return (
    <div className="flex select-none flex-col rounded-2xl bg-white/60 px-1 py-1 drop-shadow-sm backdrop-blur-md transition hover:bg-white dark:bg-white/20">
      <fetcher.Form method="POST" action={THEME_PATH} className="flex">
        {isHydrated ? null : (
          <input type="hidden" name="redirectTo" value={requestInfo.path} />
        )}

        <div className="flex items-center">
          {availableThemes.map((theme) => (
            <button
              key={theme}
              type="submit"
              name="theme"
              value={theme}
              className={`${
                mode === theme &&
                'rounded-xl bg-black/80 text-white drop-shadow-md dark:bg-white/80 dark:text-black'
              } actionable h-9 px-4`}>
              <span className="font-semibold">
                {theme && theme.charAt(0).toUpperCase() + theme.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </fetcher.Form>
    </div>
  )
}
