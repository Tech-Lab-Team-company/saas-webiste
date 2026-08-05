export type AppTheme = "light" | "dark";

export const useAppTheme = () => {
  const themeCookie = useCookie<AppTheme | null>("app-theme", {
    default: () => null,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  const theme = useState<AppTheme>("app-theme", () =>
    themeCookie.value === "dark" ? "dark" : "light",
  );

  const setTheme = (value: AppTheme) => {
    theme.value = value;
    themeCookie.value = value;
  };

  const toggleTheme = () => setTheme(theme.value === "dark" ? "light" : "dark");

  onMounted(() => {
    if (themeCookie.value !== "light" && themeCookie.value !== "dark") {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  });

  return {
    theme: readonly(theme),
    isDark: computed(() => theme.value === "dark"),
    setTheme,
    toggleTheme,
  };
};
