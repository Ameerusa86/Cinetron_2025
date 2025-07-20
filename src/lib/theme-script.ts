// Theme initialization script that runs before React hydrates
// This prevents flash of unstyled content (FOUC) during theme transitions

export const themeScript = `
(function() {
  try {
    // Get theme from localStorage
    const storedTheme = localStorage.getItem('cinema-theme');
    const theme = storedTheme ? JSON.parse(storedTheme).state.theme : 'system';
    
    // Function to apply theme classes
    function applyTheme(isDark, themeType) {
      const root = document.documentElement;
      
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', themeType === 'cinema' || themeType === 'cinema-dark' ? 'cinema-dark' : 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', themeType === 'cinema' || themeType === 'cinema-dark' ? 'cinema' : 'light');
      }
    }
    
    // Apply theme immediately
    if (theme === 'light') {
      applyTheme(false, theme);
    } else if (theme === 'dark') {
      applyTheme(true, theme);
    } else if (theme === 'cinema') {
      applyTheme(false, theme);
    } else if (theme === 'cinema-dark') {
      applyTheme(true, theme);
    } else if (theme === 'system' || theme === 'auto') {
      const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(isDarkSystem, theme);
    }
    
  } catch (error) {
    // Fallback to system preference if there's an error
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const root = document.documentElement;
    
    if (isDarkSystem) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }
})();
`;
