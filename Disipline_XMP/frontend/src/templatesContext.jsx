import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { TEMPLATES as INITIAL_TEMPLATES } from './autopostData.js'

const TemplatesContext = createContext(null)

export function TemplatesProvider({ children }) {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const nextIdRef = useRef(INITIAL_TEMPLATES.length + 1)

  const value = useMemo(
    () => ({
      templates,
      getTemplate: (id) => templates.find((t) => t.id === id),
      addTemplate: ({ name, html }) => {
        const id = `t${nextIdRef.current++}`
        setTemplates((prev) => [
          ...prev,
          { id, name: name || `Template ${prev.length + 1}`, gradient: 'linear-gradient(135deg, #111827, #1f2937)', dark: true, html },
        ])
        return id
      },
      updateTemplate: (id, patch) => {
        setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
      },
    }),
    [templates]
  )

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext)
  if (!ctx) throw new Error('useTemplates must be used within a TemplatesProvider')
  return ctx
}
