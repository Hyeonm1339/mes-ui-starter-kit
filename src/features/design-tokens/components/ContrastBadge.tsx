import { contrastBadge, contrastRatio } from '../utils/derive'

interface ContrastBadgeProps {
  fg: string
  bg: string
}

const COLOR_CLASSES: Record<string, string> = {
  AAA: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  AA: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  'AA-Large': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Fail: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
}

export const ContrastBadge = ({ fg, bg }: ContrastBadgeProps) => {
  const ratio = contrastRatio(fg, bg)
  if (ratio === null) return null
  const { level } = contrastBadge(ratio)
  return (
    <span
      className={`inline-flex h-4 items-center rounded-sm border px-1 font-mono text-[9px] tabular-nums ${COLOR_CLASSES[level]}`}
      title={`WCAG 2.1 명도 대비비 ${ratio.toFixed(2)}:1 (${level})`}
    >
      {ratio.toFixed(1)} {level}
    </span>
  )
}
