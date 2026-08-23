export type ColorTheme = 'light' | 'dark'

const DEFAULT_COLOR_THEME: ColorTheme = 'light'

export const useColorTheme = () => {
  const themeCookie = useCookie<ColorTheme>('app-theme', {
    default: () => DEFAULT_COLOR_THEME,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  const theme = useState<ColorTheme>('app-theme', () =>
    themeCookie.value === 'dark' ? 'dark' : DEFAULT_COLOR_THEME,
  )

  watch(theme, (value) => {
    themeCookie.value = value
  })

  useHead(() => ({
    htmlAttrs: {
      'data-theme': theme.value,
    },
  }))

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme: readonly(theme),
    toggleTheme,
  }
}
