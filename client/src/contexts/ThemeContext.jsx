import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('sr-dark') === 'true')
  const [largeText, setLargeText] = useState(() => localStorage.getItem('sr-large-text') === 'true')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('sr-dark', dark)
  }, [dark])

  useEffect(() => {
    document.documentElement.classList.toggle('text-lg-mode', largeText)
    localStorage.setItem('sr-large-text', largeText)
  }, [largeText])

  const value = {
    dark, toggleDark: () => setDark((d) => !d),
    largeText, toggleLargeText: () => setLargeText((v) => !v)
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
