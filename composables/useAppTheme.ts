export type AppTheme = "light" | "dark";
export const DEFAULT_APP_THEME: AppTheme = "light";

export const resolveAppTheme = (value: unknown): AppTheme =>
  value === "dark" ? "dark" : DEFAULT_APP_THEME;

export const useAppTheme = () => {
  const themeCookie = useCookie<AppTheme | null>("app-theme", {
    default: () => DEFAULT_APP_THEME,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  const theme = useState<AppTheme>("app-theme", () =>
    resolveAppTheme(themeCookie.value),
  );

  // The cookie is SSR-readable, so it is the single persisted source of truth.
  // Invalid or missing values always settle on light without consulting the OS.
  if (theme.value !== "light" && theme.value !== "dark") {
    theme.value = DEFAULT_APP_THEME;
  }
  if (themeCookie.value !== theme.value) {
    themeCookie.value = theme.value;
  }

  const setTheme = (value: AppTheme) => {
    const nextTheme = resolveAppTheme(value);
    theme.value = nextTheme;
    themeCookie.value = nextTheme;
  };

  const toggleTheme = () => setTheme(theme.value === "dark" ? "light" : "dark");

  return {
    theme: readonly(theme),
    isDark: computed(() => theme.value === "dark"),
    setTheme,
    toggleTheme,
  };
};
