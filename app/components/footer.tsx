import { useState } from 'react'
import { useRequestInfo } from '~/utils/hooks/use-request-info.ts'
import { ThemeSwitcher } from './theme-switcher.tsx'

export function Footer() {
  const [displayTip, setDisplayTip] = useState(false)
  const requestInfo = useRequestInfo()

  return (
    <footer className="relative flex min-h-[80px] items-center justify-center">
      <div className="absolute bottom-24">
        {/* Theme Switcher */}
        <ThemeSwitcher userPreference={requestInfo.userPrefs.theme} />
      </div>

      <div className="flex items-center">
        <p className="flex items-center whitespace-nowrap text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Source code is available on&nbsp;
          <a
            href="https://github.com/dev-xo/remix-client-hints"
            target="_blank"
            rel="noopener noreferrer"
            className="actionable flex items-center font-semibold text-gray-800 transition duration-200 hover:-translate-y-1 dark:text-gray-50">
            Github
          </a>
        </p>
      </div>

      {/* Background. */}
      <div className="blobs" />
    </footer>
  )
}
