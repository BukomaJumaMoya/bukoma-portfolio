import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { profile } from '@/data/profile'

const setAttr = (selector: string, attr: string, value: string) => document.head.querySelector(selector)?.setAttribute(attr, value)

/**
 * Updates the tags already in index.html rather than adding new ones, so link-preview
 * crawlers (which don't run JS) still see a complete set of defaults.
 */
export function Seo({ title, description }: { title?: string; description: string }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const full = title ? `${title} | ${profile.name}` : `${profile.name} | ${profile.title}`
    const url = `${profile.siteUrl}${pathname}`
    document.title = full
    setAttr('meta[name="description"]', 'content', description)
    setAttr('meta[property="og:title"]', 'content', full)
    setAttr('meta[property="og:description"]', 'content', description)
    setAttr('meta[property="og:url"]', 'content', url)
    setAttr('link[rel="canonical"]', 'href', url)
  }, [title, description, pathname])

  return null
}
