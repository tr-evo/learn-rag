'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { locales, getLocale, defaultLocale } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const current = getLocale(segments[1])
  const other = locales.find(l => l !== current) || defaultLocale
  const newPath = '/' + other + segments.slice(2).join('/')

  return (
    <Link href={newPath} className="text-sm text-emerald-400 hover:underline">
      {other.toUpperCase()}
    </Link>
  )
}
