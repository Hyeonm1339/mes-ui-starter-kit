import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppBadge, AppButton, AppCard, AppInput, AppSwitch, AppBarChart } from '@hyeonm1339/mes-ui-kit'

const CHART_DATA = [
  { month: '1월', production: 1200, defect: 32, rate: 97 },
  { month: '2월', production: 1350, defect: 28, rate: 98 },
  { month: '3월', production: 1180, defect: 41, rate: 96 },
  { month: '4월', production: 1420, defect: 22, rate: 98 },
  { month: '5월', production: 1560, defect: 35, rate: 98 },
  { month: '6월', production: 1490, defect: 19, rate: 99 },
]

const ZOOM_OPTIONS = [0.8, 1, 1.2] as const
type ZoomScale = (typeof ZOOM_OPTIONS)[number]

export const PreviewPanel = () => {
  const { t } = useTranslation('designTokens')
  const [zoom, setZoom] = useState<ZoomScale>(1)

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-card px-3 py-1.5">
        <span className="text-[11px] font-semibold text-muted-foreground">
          {t('preview.title')}
        </span>
        <div className="flex items-center gap-1">
          {ZOOM_OPTIONS.map((scale) => (
            <button
              key={scale}
              onClick={() => setZoom(scale)}
              className={`h-6 rounded px-2 text-[11px] tabular-nums transition-colors ${
                zoom === scale
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              title={t('preview.zoomTitle', { zoom: scale * 100 })}
            >
              {scale * 100}%
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-4" style={{ zoom }}>
          {/* Header */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">
              {t('preview.sections.header')}
            </div>
            <div
              className="flex items-center justify-between rounded-md border px-2"
              style={{
                height: '40px',
                backgroundColor: 'var(--header)',
                borderColor: 'var(--header-border)',
                color: 'var(--header-foreground)',
              }}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded" style={{ backgroundColor: 'var(--header-foreground)', opacity: 0.1 }} />
                <span className="text-xs font-bold" style={{ color: 'var(--header-foreground)' }}>MES</span>
                <span style={{ color: 'var(--header-foreground)', opacity: 0.6 }}>{t('preview.ui.breadcrumb1')}</span>
                <span style={{ color: 'var(--header-foreground)', opacity: 0.4 }}>/</span>
                <span style={{ color: 'var(--header-foreground)' }}>{t('preview.ui.breadcrumb2')}</span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-5 w-5 rounded" style={{ backgroundColor: 'var(--header-foreground)', opacity: 0.15 }} />
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.sidebar')}</div>
            <div className="overflow-hidden rounded-md border text-xs" style={{ borderColor: 'var(--sidebar-border)', backgroundColor: 'var(--sidebar)' }}>
              <div className="px-3 py-2" style={{ color: 'var(--sidebar-foreground)' }}>
                <span className="opacity-70">{t('preview.ui.sidebarNormal')}</span>
              </div>
              <div className="px-3 py-2 font-medium" style={{ backgroundColor: 'var(--sidebar-primary)', color: 'var(--sidebar-primary-foreground)' }}>
                {t('preview.ui.sidebarActive')}
              </div>
              <div className="px-3 py-2" style={{ backgroundColor: 'var(--sidebar-accent)', color: 'var(--sidebar-accent-foreground)' }}>
                {t('preview.ui.sidebarHover')}
              </div>
            </div>
          </section>

          {/* Feedback Colors */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.feedback')}</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <div className="rounded-md px-2 py-2 text-center font-medium" style={{ backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)' }}>destructive</div>
              <div className="rounded-md px-2 py-2 text-center font-medium" style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>success</div>
              <div className="rounded-md px-2 py-2 text-center font-medium" style={{ backgroundColor: 'var(--warning)', color: 'var(--warning-foreground)' }}>warning</div>
            </div>
          </section>

          {/* Buttons */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.buttons')}</div>
            <div className="flex flex-wrap gap-2 rounded-md border border-border bg-card p-3">
              <AppButton variant="default">Primary</AppButton>
              <AppButton variant="secondary">Secondary</AppButton>
              <AppButton variant="outline">Outline</AppButton>
              <AppButton variant="ghost">Ghost</AppButton>
              <AppButton variant="destructive">Destructive</AppButton>
            </div>
          </section>

          {/* Inputs */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.inputs')}</div>
            <div className="space-y-2 rounded-md border border-border bg-card p-3">
              <AppInput label={t('preview.ui.inputLabel')} placeholder={t('preview.ui.inputPlaceholder')} labelAlign="top" />
              <div className="flex items-center gap-3 flex-wrap">
                <AppSwitch id="preview-notify" label={t('preview.ui.switchLabel')} checked onCheckedChange={() => {}} />
                <AppBadge>{t('preview.ui.badgeText')}</AppBadge>
                <AppBadge variant="secondary">Secondary</AppBadge>
                <AppBadge variant="destructive">Destructive</AppBadge>
              </div>
            </div>
          </section>

          {/* Card */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.card')}</div>
            <AppCard title={t('preview.ui.cardTitle')} description={t('preview.ui.cardDescription')}>
              <p className="text-sm text-card-foreground">{t('preview.ui.cardBody')}</p>
            </AppCard>
          </section>

          {/* Table Tokens */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.tableTokens')}</div>
            <div className="overflow-hidden rounded-md border" style={{ borderColor: 'var(--table-border)' }}>
              <table className="w-full border-collapse" style={{ fontSize: 'var(--table-font-size)' }}>
                <thead style={{ backgroundColor: 'var(--table-header)' }}>
                  <tr>
                    {['#', t('preview.ui.colTask'), t('preview.ui.colStatus'), t('preview.ui.colQty')].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium" style={{ color: 'var(--table-header-foreground)', borderBottom: '1px solid var(--table-border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: 1, label: '작업지시 A', state: '일반', bg: 'var(--table-row)' },
                    { n: 2, label: '작업지시 B', state: t('preview.ui.stateHover'), bg: 'var(--table-row-hover)' },
                    { n: 3, label: '작업지시 C', state: t('preview.ui.stateSelected'), bg: 'var(--table-row-selected)' },
                    { n: 4, label: '작업지시 D', state: t('preview.ui.stateStripe'), bg: 'var(--table-row-stripe)' },
                  ].map((row) => (
                    <tr key={row.n} style={{ backgroundColor: row.bg, color: 'var(--table-row-foreground)', height: 'var(--table-row-height)', borderBottom: '1px solid var(--table-border)' }}>
                      <td className="px-3 text-[10px] opacity-50 tabular-nums">{row.n}</td>
                      <td className="px-3">{row.label}</td>
                      <td className="px-3 text-[10px] opacity-60">{row.state}</td>
                      <td className="px-3 tabular-nums">120</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chart Swatches */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.chart')}</div>
            <div className="flex gap-2 rounded-md border border-border bg-card p-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="h-12 w-full rounded" style={{ backgroundColor: `var(--chart-${i})` }} />
                  <div className="font-mono text-[10px] text-muted-foreground">chart-{i}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Chart Preview */}
          <section className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('preview.sections.chartPreview')}</div>
            <div className="rounded-md border border-border bg-card p-3">
              <AppBarChart
                data={CHART_DATA}
                series={[
                  { key: 'production', label: '생산량' },
                  { key: 'defect', label: '불량 수' },
                ]}
                xKey="month"
                height={200}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
