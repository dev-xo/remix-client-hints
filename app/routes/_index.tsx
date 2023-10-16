import type { DataFunctionArgs } from '@remix-run/node'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { getHints } from '~/utils/hooks/use-hints.ts'
import { useRequestInfo } from '~/utils/hooks/use-request-info.ts'
import { useOptimisticThemeMode } from '~/utils/hooks/use-theme.ts'

import { Navigation } from '~/components/navigation.tsx'
import { Footer } from '~/components/footer.tsx'

import LightGif from '~/public/images/light.gif'
import DarkGif from '~/public/images/dark.gif'
import SystemGif from '~/public/images/system.gif'

/**
 * Demo App!
 *
 * Hey! 👋 Thank you for checking out the source code.
 * Hope it helps you learn something new! 🙌
 *
 * I'm on Twitter as: @see https://twitter.com/DanielKanem | @DanielKanem
 * I usually post this kind of examples & best practices for Remix.
 *
 * If you have any questions, feel free to reach out!
 */
const themeGifs = {
  light: LightGif,
  dark: DarkGif,
  system: SystemGif,
} as const

type Mode = keyof typeof themeGifs

export async function loader({ request }: DataFunctionArgs) {
  /**
   * NOTE❕:
   * For server-side usage, we'll use `getHints(request).timeZone`.
   * For client-side usage, we'll use `useHints().timeZone`.
   *
   * Use `getDateTimeFormat` utility on the server-side to get a DateTimeFormat object in the user's timezone.
   * It also considers the accept-language header for locale.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
   */
  const timeZone = getHints(request).timeZone

  // Get user's preferred language from the accept-language header.
  // This is useful to set the `locale` option of `DateTimeFormat`.
  const requestLanguage = request.headers.get('accept-language')?.split(',')[0]

  // Create a DateTimeFormat object in the user's timezone.
  // Not used in the demo, but it's here for reference.
  const userDateTimeFormat = new Intl.DateTimeFormat(requestLanguage, {
    timeZone,
  }).format(new Date())

  return json({ timeZone, userDateTimeFormat } as const)
}

export default function Index() {
  const { timeZone } = useLoaderData<typeof loader>()

  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()

  const userPreference = requestInfo.userPrefs.theme
  const mode: Mode = optimisticMode ?? userPreference ?? 'system'

  // Local state that controls Framer Animations (Demo only - not required).
  const [animateKey, setAnimateKey] = useState<string>(mode)
  const [currentGif, setCurrentGif] = useState<string>(themeGifs[mode])

  useEffect(() => {
    setCurrentGif(themeGifs[mode])
    setAnimateKey(`${mode}-${Date.now()}`)
  }, [mode])

  return (
    <div className="mx-auto flex h-screen w-screen max-w-7xl flex-col overflow-hidden px-6">
      {/* Navigation */}
      <Navigation />

      {/* Content */}
      <div className="relative mx-auto flex h-full w-full max-w-3xl select-none flex-col items-center justify-center gap-8">
        <div className="absolute -top-36 flex h-full">
          <div className="flex flex-col items-center justify-center opacity-40 transition hover:opacity-100">
            <span className="select-no relative overflow-hidden bg-gradient-to-b from-black to-black/60 bg-clip-text text-base font-semibold text-transparent transition dark:from-white dark:to-white/60">
              Your timezone is
            </span>
            <h2 className="select-no overflow-hidden bg-gradient-to-b from-black to-black/60 bg-clip-text text-[38px] font-bold leading-[46px] text-transparent transition hover:-translate-y-3 dark:from-white dark:to-white/60 md:text-6xl md:leading-[85px]">
              {timeZone}
            </h2>
          </div>
        </div>

        <AnimatePresence>
          {animateKey && (
            <motion.span
              key={animateKey}
              className="absolute text-8xl"
              initial={{ opacity: 0, x: '-200%' }}
              animate={{ opacity: 1, x: '0%' }}
              exit={{ opacity: 0, x: '200%' }}
              transition={{ type: 'spring' }}>
              <img
                src={currentGif}
                alt=""
                className="h-64 w-64 cursor-pointer drop-shadow-xl transition duration-300 hover:scale-125 active:scale-95"
              />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
