// Theme initialization script that runs before React hydrates
// Defaults to Cinema Editorial Dark when no user preference is saved

export const themeScript = `
(function() {
  try {
    const storedTheme = localStorage.getItem('cinema-theme');
    const theme = storedTheme ? JSON.parse(storedTheme).state.theme : 'dark';
    const root = document.documentElement;

    function applyTheme(isDark, themeType) {
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', themeType === 'cinema' || themeType === 'cinema-dark' ? 'cinema-dark' : 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', themeType === 'cinema' || themeType === 'cinema-dark' ? 'cinema' : 'light');
      }
    }

    if (theme === 'light' || theme === 'cinema') {
      applyTheme(false, theme);
    } else if (theme === 'dark' || theme === 'cinema-dark') {
      applyTheme(true, theme);
    } else {
      const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(isDarkSystem, theme);
    }
  } catch (error) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;
