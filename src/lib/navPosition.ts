import { useState } from 'react'

export type NavPosition = 'left' | 'top'

const KEY = 'nav_position'

export function useNavPosition() {
  const [position, setPositionState] = useState<NavPosition>(
    () => (localStorage.getItem(KEY) as NavPosition | null) ?? 'left',
  )

  const setPosition = (pos: NavPosition) => {
    localStorage.setItem(KEY, pos)
    setPositionState(pos)
  }

  return { position, setPosition }
}
