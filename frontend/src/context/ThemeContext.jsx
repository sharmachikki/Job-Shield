import { createContext, useContext, useEffect, useState } from 'react';

const DEFAULT_ACCENT = '#B8863B';
const DEFAULT_BASE = '#14213D';

const ThemeContext = createContext(null);

// Applies the Settings > Theme colors as CSS custom properties on :root
// (see assets/styles/index.css) so any element styled with
// var(--theme-accent) / var(--theme-base) updates live, the same way the
// static demo.html preview does.
export function ThemeProvider({ children }) {
  const [accent, setAccentState] = useState(DEFAULT_ACCENT);
  const [base, setBaseState] = useState(DEFAULT_BASE);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-accent', accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-base', base);
  }, [base]);

  const setAccent = (hex) => setAccentState(hex);
  const setBase = (hex) => setBaseState(hex);
  const setTheme = (nextAccent, nextBase) => {
    setAccentState(nextAccent);
    setBaseState(nextBase);
  };

  return (
    <ThemeContext.Provider value={{ accent, base, setAccent, setBase, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
