import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('oai-dark') === 'true')
  const [largeText, setLargeText] = useState(() => localStorage.getItem('oai-large-text') === 'true')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('oai-dark', dark)
  }, [dark])

  useEffect(() => {
    document.documentElement.classList.toggle('text-lg-mode', largeText)
    localStorage.setItem('oai-large-text', largeText)
  }, [largeText])

  const value = {
    dark, toggleDark: () => setDark((d) => !d),
    largeText, toggleLargeText: () => setLargeText((v) => !v)
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
