import { profile } from '@/data/profile'
import { cx } from './ui'

/**
 * The portrait cropped to the face for small round spots. The full photo is a
 * half-length portrait, so at small sizes it zooms in, centred on the face.
 */
export function Avatar({ className }: { className?: string }) {
  if (!profile.portrait) return null
  return (
    <span className={cx('block shrink-0 overflow-hidden rounded-full', className)}>
      <img
        src={profile.portrait}
        alt=""
        width={648}
        height={1080}
        loading="lazy"
        decoding="async"
        className="size-full origin-[39%_42%] scale-[1.9] object-cover object-[50%_22%]"
      />
    </span>
  )
}
