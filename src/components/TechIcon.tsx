import styles from './TechIcon.module.css'

/**
 * A vendor mark. `adaptive` marks are near-black silhouettes that vanish on
 * this page and are inverted; `tile` marks are app icons with their own ground
 * and get the rounded corners they were drawn for.
 */
export default function TechIcon({
  src,
  size = 24,
  adaptive,
  tile,
}: {
  src: string
  size?: number
  adaptive?: boolean | undefined
  tile?: boolean | undefined
}) {
  return (
    <img
      className={styles['icon']}
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      data-adaptive={adaptive || undefined}
      data-tile={tile || undefined}
    />
  )
}
