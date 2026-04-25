import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Redo2, Search, Undo2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, AppButton } from '@hyeonm1339/mes-ui-kit'
import { toast } from '@/lib/toast'
import { useTokenState } from '../hooks/useTokenState'
import { useLiveTokens } from '../hooks/useLiveTokens'
import { defaultTokens, tokenDefs } from '../tokens.config'
import { themePresets } from '../presets'
import type { TokenCategory } from '../types'
import { buildCss, copyToClipboard, downloadJson, readJsonFile } from '../utils/exportImport'
import { deriveDependents, isAnchor } from '../utils/derive'
import { TokenRow } from './TokenRow'
import { PreviewPanel } from './PreviewPanel'

export const TokenEditorView = () => {
  const { t } = useTranslation('designTokens')
  const { tokens, setValue, setValues, reset, replaceAll, undo, redo, canUndo, canRedo } =
    useTokenState()
  useLiveTokens(tokens)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key.toLowerCase() !== 'z') return
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  const filteredGrouped = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? tokenDefs.filter((def) => {
          const label = t(`${def.label}.label`, { defaultValue: def.label })
          return label.toLowerCase().includes(q) || def.key.toLowerCase().includes(q)
        })
      : tokenDefs

    const map = new Map<TokenCategory, typeof tokenDefs>()
    for (const def of filtered) {
      const list = map.get(def.category) ?? []
      list.push(def)
      map.set(def.category, list)
    }
    return Array.from(map.entries())
  }, [search, t])

  const handleCopyCss = async () => {
    const ok = await copyToClipboard(buildCss(tokens))
    if (ok) toast.success(t('toast.cssCopied'))
    else toast.error(t('toast.cssCopyFailed'))
  }

  const handleExport = () => {
    downloadJson(tokens)
    toast.success(t('toast.jsonExported'))
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const next = await readJsonFile(file)
      replaceAll(next)
      toast.success(t('toast.jsonImported'))
    } catch {
      toast.error(t('toast.jsonInvalid'))
    }
  }

  const handleReset = () => {
    reset()
    setSelectedPresetId('')
    toast.info(t('toast.resetDone'))
  }

  const handlePresetChange = (id: string) => {
    if (!id) return
    const preset = themePresets.find((p) => p.id === id)
    if (!preset) return
    replaceAll(preset.tokens)
    setSelectedPresetId(id)
    toast.success(t('toast.presetApplied', { name: preset.label }))
  }

  const handleDerive = (anchorKey: string) => {
    const lightAnchor = tokens.light[anchorKey] ?? defaultTokens.light[anchorKey]
    const darkAnchor = tokens.dark[anchorKey] ?? defaultTokens.dark[anchorKey]
    if (lightAnchor) {
      const patch = deriveDependents(anchorKey, lightAnchor, tokenDefs)
      if (Object.keys(patch).length) setValues('light', patch)
    }
    if (darkAnchor) {
      const patch = deriveDependents(anchorKey, darkAnchor, tokenDefs)
      if (Object.keys(patch).length) setValues('dark', patch)
    }
    toast.success(t('toast.deriveDone', { key: anchorKey }))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 액션 바 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-card-foreground">{t('title') ?? '디자인 토큰 편집기'}</div>
          <select
            value={selectedPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="" disabled>{t('preset.placeholder')}</option>
            {themePresets.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-0.5">
            <button onClick={undo} disabled={!canUndo} title={t('toolbar.undoTitle')} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:hover:bg-transparent">
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button onClick={redo} disabled={!canRedo} title={t('toolbar.redoTitle')} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:hover:bg-transparent">
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <AppButton size="sm" variant="outline" onClick={handleCopyCss}>{t('toolbar.copyCss')}</AppButton>
          <AppButton size="sm" variant="outline" onClick={handleExport}>{t('toolbar.exportJson')}</AppButton>
          <AppButton size="sm" variant="outline" onClick={handleImportClick}>{t('toolbar.importJson')}</AppButton>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
          <AppButton size="sm" variant="ghost" onClick={handleReset}>{t('toolbar.reset')}</AppButton>
        </div>
      </div>

      {/* 본문 */}
      <div className="grid min-h-0 flex-1 overflow-hidden grid-cols-1 gap-2 md:gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* 좌측 토큰 리스트 */}
        <div className="flex min-h-0 flex-col overflow-y-auto border-b border-r border-border bg-card md:border-b-0">
          <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search.placeholder')} className="h-6 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
            {search && (
              <button onClick={() => setSearch('')} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="sticky top-[33px] z-10 grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-border bg-muted px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
            <div>{t('column.token')}</div>
            <div className="w-[7.5rem] text-center">Light</div>
            <div className="w-[7.5rem] text-center">Dark</div>
          </div>
          {filteredGrouped.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">{t('search.noResults')}</div>
          ) : (
            filteredGrouped.map(([category, defs]) => {
              const isCollapsed = collapsedCategories.has(category)
              return (
                <div key={category}>
                  <button onClick={() => toggleCategory(category)} className="flex w-full items-center justify-between bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground hover:bg-accent/80 transition-colors">
                    <span>{t(`categories.${category}`, { defaultValue: category })}</span>
                    <span className="flex items-center gap-1 text-accent-foreground/60">
                      <span className="tabular-nums">{defs.length}</span>
                      <ChevronDown className={cn('h-3 w-3 transition-transform duration-150', isCollapsed && '-rotate-90')} />
                    </span>
                  </button>
                  {!isCollapsed && defs.map((def) => (
                    <TokenRow
                      key={def.key}
                      def={def}
                      lightValue={tokens.light[def.key] ?? defaultTokens.light[def.key] ?? ''}
                      darkValue={tokens.dark[def.key] ?? defaultTokens.dark[def.key] ?? ''}
                      lightAll={tokens.light}
                      darkAll={tokens.dark}
                      isAnchor={isAnchor(def, tokenDefs)}
                      onChangeLight={(next) => setValue('light', def.key, next)}
                      onChangeDark={(next) => setValue('dark', def.key, next)}
                      onDerive={() => handleDerive(def.key)}
                    />
                  ))}
                </div>
              )
            })
          )}
        </div>

        {/* 우측 프리뷰 */}
        <div className="h-full min-h-0 flex flex-col overflow-hidden rounded-md border border-border md:rounded-none md:border-0">
          <PreviewPanel />
        </div>
      </div>
    </div>
  )
}
