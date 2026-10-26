/**
 * A very short vibration to confirm a tap on phones that support it (Android).
 * Silently does nothing elsewhere, and when the visitor prefers reduced motion.
 */
export function tap() {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  navigator.vibrate(6)
}
