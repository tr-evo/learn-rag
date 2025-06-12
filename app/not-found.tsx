"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function NotFound() {
  const { t } = useTranslation('common')
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-4xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">{t('notFound.title', '404 - Not Found')}</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">{t('notFound.message', "The page you're looking for doesn't exist.")}</p>
      <Link href="/">
        <Button className="flex items-center gap-2">
          <Home className="h-4 w-4" /> {t('notFound.returnHome', 'Return Home')}
        </Button>
      </Link>
    </div>
  )
}
