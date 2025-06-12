"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const { i18n, t, ready } = useTranslation('common')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const changeLanguage = (lang: string) => {
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lang)
    }
  }

  if (!mounted || !ready) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-slate-400" />
        <div className="w-32 h-10 bg-slate-800 border border-slate-700 rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-slate-400" />
      <Select value={i18n?.language || 'en'} onValueChange={changeLanguage}>
        <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
          <SelectItem value="en" className="focus:bg-slate-700 focus:text-slate-100">
            {t('language.english', 'English')}
          </SelectItem>
          <SelectItem value="de" className="focus:bg-slate-700 focus:text-slate-100">
            {t('language.german', 'Deutsch')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 