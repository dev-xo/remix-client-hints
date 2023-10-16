import type { DataFunctionArgs } from '@remix-run/node'

import { z } from 'zod'
import { safeRedirect } from 'remix-utils/safe-redirect'
import { json, redirect } from '@remix-run/node'

import { setTheme } from '~/utils/hooks/use-theme.ts'

export const ROUTE_PATH = '/resources/theme' as const

export const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  redirectTo: z.string().optional(),
})

export async function action({ request }: DataFunctionArgs) {
  try {
    // Get the form data and parse its values.
    const formData = Object.fromEntries(await request.formData())
    const { theme, redirectTo } = ThemeFormSchema.parse(formData)

    // Set the theme cookie.
    const responseInit = {
      headers: { 'Set-Cookie': setTheme(theme === 'system' ? undefined : theme) },
    }

    // Redirect to the given URL or return a JSON response.
    if (redirectTo) {
      return redirect(safeRedirect(redirectTo), responseInit)
    } else {
      return json({ success: true } as const, responseInit)
    }
  } catch (err: unknown) {
    console.log(err)
    return json({ success: false, error: err }, { status: 400 })
  }
}
