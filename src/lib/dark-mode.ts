export function getColorScheme(): 'light' |'dark' {
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let isSystemDarkMode = darkModeMediaQuery.matches;
  let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode);
  return isDarkMode ? 'dark' : 'light';
}
