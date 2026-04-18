import { createElement } from 'react'
import { navItems } from './navigation'
import type { NavLevel1, NavLeaf } from './navigation'

function collectLeaves(items: NavLevel1[]): NavLeaf[] {
  return items.flatMap((l1) => l1.children.flatMap((l2) => l2.children))
}

export const pageRegistry: Record<string, React.ReactElement> = Object.fromEntries(
  collectLeaves(navItems).map((leaf) => [leaf.to, createElement(leaf.component)]),
)
