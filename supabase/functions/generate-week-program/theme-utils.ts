
export const formatTheme = (themeInput: string): string | null => {
  if (!themeInput || themeInput.trim() === '') return null;
  return themeInput.charAt(0).toUpperCase() + themeInput.slice(1).toLowerCase() + ' Avontuur Thema';
};
