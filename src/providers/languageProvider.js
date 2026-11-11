import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { DEFAULT_LANGUAGE, LANGUAGES, translations } from '../data/translations'

const STORAGE_KEY = 'take-me.language'

const isSupported = (language) => LANGUAGES.includes(language)

// Storage can throw (private mode, blocked site data), the site still works without it
function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isSupported(stored) ? stored : null
  } catch (error) {
    return null
  }
}

function storeLanguage(language) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language)
  } catch (error) {
    // The choice just isn't remembered for the next visit
  }
}

// First visit: the first supported language in the browser preferences, English otherwise
function detectBrowserLanguage() {
  const preferred = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]

  for (const tag of preferred) {
    const base = (tag || '').toLowerCase().split('-')[0]
    if (isSupported(base)) return base
  }

  return DEFAULT_LANGUAGE
}

const getInitialLanguage = () => readStoredLanguage() || detectBrowserLanguage()

const lookup = (dictionary, key) =>
  key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dictionary)

// 'Hi {name}!' + { name: <b>Oscar</b> } -> ['Hi ', <b>Oscar</b>, '!']
function interpolate(template, values) {
  if (!values || typeof template !== 'string') return template

  return template.split(/(\{\w+\})/g).map((part, index) => {
    const name = part.match(/^\{(\w+)\}$/)?.[1]
    return name && name in values
      ? <React.Fragment key={index}>{values[name]}</React.Fragment>
      : part
  })
}

function translate(language, key, values) {
  let text = lookup(translations[language], key)

  if (text === undefined) {
    if (process.env.NODE_ENV !== 'production') console.warn(`Missing "${language}" translation for "${key}"`)
    text = lookup(translations[DEFAULT_LANGUAGE], key)
  }

  return text === undefined ? key : interpolate(text, values)
}

function createValue(language, setLanguage) {
  return {
    language,
    otherLanguage: LANGUAGES.find((candidate) => candidate !== language),
    setLanguage,
    t: (key, values) => translate(language, key, values),
  }
}

// The default value lets components render in English even without the provider (e.g. in tests)
const LanguageContext = createContext(createValue(DEFAULT_LANGUAGE, () => {}))

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  const setLanguage = useCallback((next) => {
    if (!isSupported(next)) return
    setLanguageState(next)
    storeLanguage(next)
  }, [])

  // Before the browser paints, so the Japanese text never shows with the Latin font stack
  // (the Japanese fonts are picked with html:lang(ja))
  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.title = translate(language, 'meta.title')
  }, [language])

  // Keeps other open tabs in the same language (Credits opens in a new one)
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY && isSupported(event.newValue)) setLanguageState(event.newValue)
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => createValue(language, setLanguage), [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
