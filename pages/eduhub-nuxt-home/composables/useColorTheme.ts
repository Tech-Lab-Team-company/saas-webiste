export type ColorTheme = 'light' | 'dark'

export const useColorTheme = () => {
  const themeCookie = useCookie<ColorTheme>('edu-theme', {
    default: () => 'light',
    sameSite: 'lax',
  })

  const theme = useState<ColorTheme>('edu-theme', () => themeCookie.value)

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
