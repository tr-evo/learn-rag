"use client"

import { useEffect } from 'react'
import '../lib/i18n'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is already initialized by the import above
    // This component ensures it only runs on the client side
  }, [])

  return <>{children}</>
} 