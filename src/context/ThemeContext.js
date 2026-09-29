import { createContext, useContext, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeModeContext = createContext();
export const useThemeMode = () => useContext(ThemeModeContext);

const heading = { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800 };

export function ThemeModeProvider({ children }) {
  // Default to the OS preference the first time the app is opened.
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const [mode, setMode] = useLocalStorage('themeMode', prefersDark ? 'dark' : 'light');
  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const theme = useMemo(
    () =>
      createTheme({
        palette:
          mode === 'dark'
            ? { mode, primary: { main: '#f2a33a' }, background: { default: '#12121a', paper: '#1c1c28' } }
            : { mode, primary: { main: '#b86e00' }, background: { default: '#f6f4f0', paper: '#ffffff' } },
        shape: { borderRadius: 10 },
        typography: { h3: heading, h4: heading, h5: { ...heading, fontWeight: 600 }, h6: { ...heading, fontWeight: 600 } },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
