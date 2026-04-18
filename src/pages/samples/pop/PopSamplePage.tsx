import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Factory,
  Cpu,
  User,
  Clock,
  RotateCcw,
  ChevronRight,
  ClipboardList,
  Wrench,
} from 'lucide-react'
import {
  PopStatusBar,
  PopCard,
  PopBadge,
  PopTable,
  PopProgress,
  PopScanner,
  PopSelect,
  PopMultiSelect,
  PopDatePicker,
  PopButton,
  PopToggleGroup,
  PopDialog,
  PopKeypadDialog,
  PopTextKeypadDialog,
  cn,
} from '@hyeonm1339/mes-ui-kit'
import type { PopStatusItem, PopTableColumn } from '@hyeonm1339/mes-ui-kit'

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'list' | 'detail'
type ActiveTab = 'journal' | 'work'
type WorkStatus = 'idle' | 'running' | 'paused' | 'done'
type OrderStatus = '대기' | '진행' | '완료'

interface WorkOrder {
  id: string
  item: string
  itemCode: string
  process: string
  planQty: number
  dueDate: string
  status: OrderStatus
  stdSecs: number
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ORDERS: WorkOrder[] = [
  { id: 'WO-2026-001', item: '브래킷-A형', itemCode: 'ITM-2301', process: '프레스가공', planQty: 500, dueDate: '2026-04-20', status: '대기', stdSecs: 3600 },
  { id: 'WO-2026-002', item: '샤프트-12φ', itemCode: 'ITM-0892', process: '선반가공', planQty: 200, dueDate: '2026-04-21', status: '대기', stdSecs: 5400 },
  { id: 'WO-2026-003', item: '하우징-B', itemCode: 'ITM-1102', process: '조립', planQty: 150, dueDate: '2026-04-19', status: '완료', stdSecs: 7200 },
  { id: 'WO-2026-004', item: '커버-스틸', itemCode: 'ITM-3301', process: '프레스가공', planQty: 300, dueDate: '2026-04-22', status: '대기', stdSecs: 2700 },
  { id: 'WO-2026-005', item: '볼트-M10×40', itemCode: 'ITM-0044', process: '검사', planQty: 1000, dueDate: '2026-04-18', status: '완료', stdSecs: 1800 },
]

const DEFECT_OPTIONS = [
  { label: '치수불량', value: 'dim' },
  { label: '외관불량', value: 'app' },
  { label: '균열', value: 'crack' },
  { label: '변형', value: 'deform' },
  { label: '오염', value: 'dirty' },
  { label: '기타', value: 'etc' },
]
const EQ_OPTIONS = [
  { label: 'PRESS-001', value: 'eq1' },
  { label: 'PRESS-002', value: 'eq2' },
  { label: 'PRESS-003', value: 'eq3' },
]
const SHIFT_OPTIONS = [
  { label: '주간 1부 (06:00~14:00)', value: 'd1' },
  { label: '주간 2부 (14:00~22:00)', value: 'd2' },
  { label: '야간 (22:00~06:00)', value: 'n1' },
]
const STATUS_FILTER = [
  { label: '전체', value: 'all' },
  { label: '대기', value: '대기' },
  { label: '완료', value: '완료' },
]
const STATUS_BAR: PopStatusItem[] = [
  { label: '공정', value: '프레스가공', icon: Factory, color: 'primary' },
  { label: '설비', value: 'PRESS-001', icon: Cpu, color: 'success' },
  { label: '작업자', value: '김철수', icon: User },
  { label: '교대', value: '주간 1부', icon: Clock },
]

const TABLE_COLS: PopTableColumn<WorkOrder>[] = [
  { key: 'id', header: '작업지시번호', width: '140px' },
  { key: 'item', header: '품목명' },
  { key: 'process', header: '공정', width: '90px', align: 'center' },
  {
    key: 'planQty',
    header: '계획',
    width: '72px',
    align: 'right',
    render: (v) => `${(v as number).toLocaleString()}`,
  },
  {
    key: 'status',
    header: '상태',
    width: '66px',
    align: 'center',
    render: (v) => {
      const s = v as OrderStatus
      return (
        <PopBadge status={s === '완료' ? 'success' : 'inactive'} className="text-sm">
          {s}
        </PopBadge>
      )
    },
  },
]

// ─── Timer hook ────────────────────────────────────────────────────────────────

function useTimer(running: boolean) {
  const [secs, setSecs] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs((s) => s + 1), 1000)
    } else {
      if (ref.current) clearInterval(ref.current)
    }
    return () => {
      if (ref.current) clearInterval(ref.current)
    }
  }, [running])

  const reset = useCallback(() => setSecs(0), [])
  return { secs, reset }
}

function fmtTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

// ─── Quantity tap-to-input card ────────────────────────────────────────────────

interface QtyCardProps {
  label: string
  value: number
  unit?: string
  color?: 'default' | 'success' | 'destructive'
  disabled?: boolean
  onTap: () => void
}

const QtyCard = ({ label, value, unit = 'EA', color = 'default', disabled, onTap }: QtyCardProps) => (
  <button
    onClick={onTap}
    disabled={disabled}
    className={cn(
      'flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 py-4 transition-colors',
      'select-none active:scale-[0.98]',
      disabled
        ? 'border-border bg-muted opacity-50 cursor-not-allowed'
        : color === 'success'
          ? 'border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-900/40 cursor-pointer'
          : color === 'destructive'
            ? 'border-destructive bg-destructive/5 hover:bg-destructive/10 cursor-pointer'
            : 'border-primary bg-primary/5 hover:bg-primary/10 cursor-pointer',
    )}
  >
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span
      className={cn(
        'font-mono text-5xl font-bold tabular-nums leading-none',
        color === 'success' ? 'text-green-600' : color === 'destructive' ? 'text-destructive' : 'text-primary',
      )}
    >
      {value.toLocaleString()}
    </span>
    <span className="text-sm text-muted-foreground">{unit}</span>
    {!disabled && <span className="mt-1 text-xs text-muted-foreground opacity-60">탭하여 입력</span>}
  </button>
)

// ─── TextField tap-to-input ────────────────────────────────────────────────────

interface TapFieldProps {
  label: string
  value: string
  placeholder?: string
  disabled?: boolean
  onTap: () => void
}

const TapField = ({ label, value, placeholder = '탭하여 입력', disabled, onTap }: TapFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <button
      onClick={onTap}
      disabled={disabled}
      className={cn(
        'flex h-12 w-full items-center rounded-xl border-2 px-4 text-left text-base transition-colors',
        disabled
          ? 'border-border bg-muted cursor-not-allowed opacity-50'
          : 'border-border bg-card hover:border-primary hover:bg-primary/5 cursor-pointer',
      )}
    >
      {value ? (
        <span className="font-medium text-foreground">{value}</span>
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </button>
  </div>
)

// ─── Main component ────────────────────────────────────────────────────────────

export const PopSamplePage = () => {
  const [view, setView] = useState<View>('list')
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<ActiveTab>('work')

  const [workStatus, setWorkStatus] = useState<WorkStatus>('idle')
  const isRunning = workStatus === 'running'
  const { secs, reset: resetTimer } = useTimer(isRunning)

  const [worker, setWorker] = useState('김철수')
  const [shift, setShift] = useState('d1')
  const [equipment, setEquipment] = useState('eq1')
  const [workDate, setWorkDate] = useState(new Date().toISOString().slice(0, 10))
  const [memo, setMemo] = useState('')
  const [defectTypes, setDefectTypes] = useState<string[]>([])

  const [lotNo, setLotNo] = useState('')
  const [goodQty, setGoodQty] = useState(0)
  const [defectQty, setDefectQty] = useState(0)

  const [kpGood, setKpGood] = useState(false)
  const [kpDefect, setKpDefect] = useState(false)
  const [tkWorker, setTkWorker] = useState(false)
  const [tkMemo, setTkMemo] = useState(false)
  const [dlgComplete, setDlgComplete] = useState(false)
  const [dlgReset, setDlgReset] = useState(false)
  const [completing, setCompleting] = useState(false)

  const planQty = selectedOrder?.planQty ?? 0
  const progressPct = planQty > 0 ? Math.min(100, Math.round((goodQty / planQty) * 100)) : 0
  const progressVariant = progressPct >= 100 ? 'success' : progressPct >= 70 ? 'default' : 'warning'
  const filteredOrders = statusFilter === 'all' ? ORDERS : ORDERS.filter((o) => o.status === statusFilter)

  const handleSelectOrder = (row: WorkOrder) => {
    setSelectedOrder(row)
    setWorkStatus('idle')
    setGoodQty(0)
    setDefectQty(0)
    setLotNo('')
    setDefectTypes([])
    resetTimer()
    setView('detail')
    setActiveTab('work')
  }

  const handleBack = () => {
    setView('list')
    setSelectedOrder(null)
    setWorkStatus('idle')
    resetTimer()
  }

  const handleComplete = () => {
    setCompleting(true)
    setTimeout(() => {
      setCompleting(false)
      setDlgComplete(false)
      setWorkStatus('done')
    }, 1000)
  }

  const handleReset = () => {
    setWorkStatus('idle')
    setGoodQty(0)
    setDefectQty(0)
    setLotNo('')
    setDefectTypes([])
    resetTimer()
    setDlgReset(false)
  }

  const handleJournalSave = () => {
    alert(`일지 저장 완료\n작업자: ${worker}\n교대: ${shift}\n비고: ${memo}`)
  }

  const statusLabel =
    workStatus === 'done' ? '작업완료' : workStatus === 'running' ? '작업중' : workStatus === 'paused' ? '일시정지' : '대기'
  const statusBadge =
    workStatus === 'done' ? 'success' : workStatus === 'running' ? 'active' : workStatus === 'paused' ? 'warning' : 'inactive'

  if (view === 'list') {
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        <PopStatusBar items={STATUS_BAR} layout="equal" />
        <PopCard title="작업지시 목록" description="작업지시를 선택하면 실행 화면으로 이동합니다." className="flex-1">
          <div className="flex flex-col gap-3">
            <PopToggleGroup options={STATUS_FILTER} value={statusFilter} onChange={setStatusFilter} fullWidth />
            <PopTable columns={TABLE_COLS} data={filteredOrders} onRowClick={handleSelectOrder} emptyMessage="해당 조건의 작업지시가 없습니다." />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>총 {filteredOrders.length}건</span>
              <span className="flex items-center gap-1 text-primary">
                항목 선택 → 실행화면 <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </PopCard>
      </div>
    )
  }

  if (!selectedOrder) return null

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className={cn(
          'flex items-center gap-4 border-b-2 px-5 py-3 transition-colors',
          workStatus === 'running'
            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
            : workStatus === 'paused'
              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20'
              : workStatus === 'done'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card',
        )}
      >
        <button
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-background hover:bg-muted active:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-bold text-foreground">{selectedOrder.id}</span>
            <PopBadge status={statusBadge} pulse={workStatus === 'running'}>{statusLabel}</PopBadge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedOrder.item}</span>
            <span>{selectedOrder.itemCode}</span>
            <span>{selectedOrder.process}</span>
            <span>계획 <strong>{selectedOrder.planQty.toLocaleString()} EA</strong></span>
            <span>납기 <strong>{selectedOrder.dueDate}</strong></span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div
            className={cn(
              'font-mono text-3xl font-bold tabular-nums',
              workStatus === 'running' ? 'text-green-600' : workStatus === 'paused' ? 'text-yellow-600' : 'text-muted-foreground',
            )}
          >
            {fmtTime(secs)}
          </div>
          <div className="text-xs text-muted-foreground">작업시간</div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[88px] shrink-0 flex-col border-r-2 border-border bg-muted/40">
          {(
            [
              { key: 'work', icon: Wrench, label: '작업\n화면' },
              { key: 'journal', icon: ClipboardList, label: '일지\n작성' },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex flex-col items-center justify-center gap-2 px-2 py-6 text-center transition-colors',
                'border-b border-border text-sm font-medium',
                activeTab === key
                  ? 'bg-background text-primary border-l-2 border-l-primary ml-[-2px]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="whitespace-pre-line leading-tight">{label}</span>
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto">
          {activeTab === 'work' ? (
            <WorkTab
              order={selectedOrder}
              workStatus={workStatus}
              secs={secs}
              planQty={planQty}
              goodQty={goodQty}
              defectQty={defectQty}
              progressPct={progressPct}
              progressVariant={progressVariant}
              lotNo={lotNo}
              defectTypes={defectTypes}
              kpGood={kpGood}
              kpDefect={kpDefect}
              setLotNo={setLotNo}
              setGoodQty={setGoodQty}
              setDefectQty={setDefectQty}
              setDefectTypes={setDefectTypes}
              setKpGood={setKpGood}
              setKpDefect={setKpDefect}
              onStart={() => setWorkStatus('running')}
              onPause={() => setWorkStatus('paused')}
              onResume={() => setWorkStatus('running')}
              onCompleteClick={() => setDlgComplete(true)}
              onResetClick={() => setDlgReset(true)}
            />
          ) : (
            <JournalTab
              workStatus={workStatus}
              worker={worker}
              shift={shift}
              equipment={equipment}
              workDate={workDate}
              memo={memo}
              defectTypes={defectTypes}
              tkWorker={tkWorker}
              tkMemo={tkMemo}
              setShift={setShift}
              setEquipment={setEquipment}
              setWorkDate={setWorkDate}
              setDefectTypes={setDefectTypes}
              setTkWorker={setTkWorker}
              setTkMemo={setTkMemo}
              onWorkerConfirm={setWorker}
              onMemoConfirm={setMemo}
              onSave={handleJournalSave}
            />
          )}
        </div>
      </div>

      <PopDialog
        open={dlgComplete}
        onClose={() => setDlgComplete(false)}
        title="실적등록 확인"
        description="아래 내용으로 실적을 등록합니다. 등록 후에는 수정이 불가합니다."
        confirmLabel="등록"
        cancelLabel="취소"
        onConfirm={handleComplete}
        confirmLoading={completing}
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 rounded-xl border-2 border-border bg-muted/40 p-4 text-base">
          {[
            ['작업지시', selectedOrder.id],
            ['LOT 번호', lotNo || '—'],
            ['양품수량', `${goodQty.toLocaleString()} EA`],
            ['불량수량', `${defectQty.toLocaleString()} EA`],
            ['작업시간', fmtTime(secs)],
          ].map(([k, v]) => (
            <>
              <div key={k + 'k'} className="text-muted-foreground">{k}</div>
              <div key={k + 'v'} className="font-semibold font-mono">{v}</div>
            </>
          ))}
        </div>
      </PopDialog>

      <PopDialog
        open={dlgReset}
        onClose={() => setDlgReset(false)}
        title="초기화 확인"
        description="입력한 실적 데이터가 모두 초기화됩니다."
        confirmLabel="초기화"
        cancelLabel="취소"
        onConfirm={handleReset}
        confirmVariant="destructive"
      />
    </div>
  )
}

// ─── Work tab ─────────────────────────────────────────────────────────────────

interface WorkTabProps {
  order: WorkOrder
  workStatus: WorkStatus
  secs: number
  planQty: number
  goodQty: number
  defectQty: number
  progressPct: number
  progressVariant: 'default' | 'success' | 'warning' | 'destructive'
  lotNo: string
  defectTypes: string[]
  kpGood: boolean
  kpDefect: boolean
  setLotNo: (v: string) => void
  setGoodQty: (v: number) => void
  setDefectQty: (v: number) => void
  setDefectTypes: (v: string[]) => void
  setKpGood: (v: boolean) => void
  setKpDefect: (v: boolean) => void
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onCompleteClick: () => void
  onResetClick: () => void
}

const WorkTab = ({
  order,
  workStatus,
  planQty,
  goodQty,
  defectQty,
  progressPct,
  progressVariant,
  lotNo,
  defectTypes,
  kpGood,
  kpDefect,
  setLotNo,
  setGoodQty,
  setDefectQty,
  setDefectTypes,
  setKpGood,
  setKpDefect,
  onStart,
  onPause,
  onResume,
  onCompleteClick,
  onResetClick,
}: WorkTabProps) => {
  const isActive = workStatus === 'running' || workStatus === 'paused'

  return (
    <div className="flex flex-col gap-4 p-4">
      <PopCard>
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">진척도</span>
            <span
              className={cn(
                'font-mono text-4xl font-bold tabular-nums',
                progressPct >= 100 ? 'text-green-600' : progressPct >= 70 ? 'text-primary' : 'text-yellow-600',
              )}
            >
              {progressPct}%
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <PopProgress
              value={goodQty}
              max={planQty}
              variant={progressVariant}
              label={`${goodQty.toLocaleString()} / ${planQty.toLocaleString()} EA`}
              showCount
            />
            <div className="flex gap-6 text-sm">
              <span className="text-muted-foreground">
                불량 <span className="font-semibold text-destructive">{defectQty.toLocaleString()} EA</span>
              </span>
              <span className="text-muted-foreground">
                잔여 <span className="font-semibold">{Math.max(0, planQty - goodQty).toLocaleString()} EA</span>
              </span>
              <span className="text-muted-foreground">
                표준시간 <span className="font-semibold">{fmtTime(order.stdSecs)}</span>
              </span>
            </div>
          </div>
        </div>
      </PopCard>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4">
          <PopCard title="LOT 스캔">
            <PopScanner value={lotNo} onChange={setLotNo} placeholder="바코드 스캔 또는 직접 입력" disabled={!isActive} />
          </PopCard>

          <PopCard title="수량 입력" description="수량 카드를 탭하면 키패드가 열립니다.">
            <div className="grid grid-cols-2 gap-3">
              <QtyCard label="양품수량" value={goodQty} color="success" disabled={!isActive} onTap={() => setKpGood(true)} />
              <QtyCard label="불량수량" value={defectQty} color="destructive" disabled={!isActive} onTap={() => setKpDefect(true)} />
            </div>
            {defectQty > 0 && isActive && (
              <div className="mt-3">
                <PopMultiSelect options={DEFECT_OPTIONS} value={defectTypes} onChange={setDefectTypes} label="불량유형" placeholder="불량유형을 선택하세요" />
              </div>
            )}
          </PopCard>
        </div>

        <div className="flex flex-col gap-3">
          {workStatus === 'idle' && (
            <PopButton variant="success" prefixIcon={Play} fullWidth className="h-24 text-xl" onClick={onStart}>작업시작</PopButton>
          )}
          {workStatus === 'running' && (
            <PopButton variant="outline" prefixIcon={Pause} fullWidth className="h-24 text-xl" onClick={onPause}>일시정지</PopButton>
          )}
          {workStatus === 'paused' && (
            <PopButton variant="secondary" prefixIcon={Play} fullWidth className="h-24 text-xl" onClick={onResume}>재개</PopButton>
          )}
          {isActive && (
            <PopButton variant="default" prefixIcon={CheckCircle2} fullWidth className="h-24 text-xl" onClick={onCompleteClick}>실적등록</PopButton>
          )}
          {workStatus === 'done' && (
            <>
              <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-green-500 bg-green-50 py-6 dark:bg-green-950/30">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <span className="font-semibold text-green-700 dark:text-green-400">완료</span>
              </div>
              <PopButton variant="outline" prefixIcon={RotateCcw} fullWidth onClick={onResetClick}>초기화</PopButton>
            </>
          )}
          {isActive && (
            <PopButton variant="destructive" prefixIcon={AlertTriangle} fullWidth onClick={onResetClick}>취소/초기화</PopButton>
          )}
        </div>
      </div>

      <PopKeypadDialog
        open={kpGood}
        onClose={() => setKpGood(false)}
        onConfirm={(v) => setGoodQty(Number(v) || 0)}
        title="양품수량 입력"
        unit="EA"
        initialValue={String(goodQty || '')}
        maxLength={6}
      />
      <PopKeypadDialog
        open={kpDefect}
        onClose={() => setKpDefect(false)}
        onConfirm={(v) => setDefectQty(Number(v) || 0)}
        title="불량수량 입력"
        unit="EA"
        initialValue={String(defectQty || '')}
        maxLength={6}
      />
    </div>
  )
}

// ─── Journal tab ───────────────────────────────────────────────────────────────

interface JournalTabProps {
  workStatus: WorkStatus
  worker: string
  shift: string
  equipment: string
  workDate: string
  memo: string
  defectTypes: string[]
  tkWorker: boolean
  tkMemo: boolean
  setShift: (v: string) => void
  setEquipment: (v: string) => void
  setWorkDate: (v: string) => void
  setDefectTypes: (v: string[]) => void
  setTkWorker: (v: boolean) => void
  setTkMemo: (v: boolean) => void
  onWorkerConfirm: (v: string) => void
  onMemoConfirm: (v: string) => void
  onSave: () => void
}

const JournalTab = ({
  worker,
  shift,
  equipment,
  workDate,
  memo,
  defectTypes,
  tkWorker,
  tkMemo,
  setShift,
  setEquipment,
  setWorkDate,
  setDefectTypes,
  setTkWorker,
  setTkMemo,
  onWorkerConfirm,
  onMemoConfirm,
  onSave,
}: JournalTabProps) => (
  <div className="flex flex-col gap-4 p-4">
    <PopCard title="기본 정보">
      <div className="grid grid-cols-2 gap-4">
        <TapField label="작업자" value={worker} placeholder="작업자 이름" onTap={() => setTkWorker(true)} />
        <PopSelect options={SHIFT_OPTIONS} value={shift} onChange={setShift} label="교대" />
        <PopSelect options={EQ_OPTIONS} value={equipment} onChange={setEquipment} label="설비" />
        <PopDatePicker value={workDate} onChange={setWorkDate} label="작업일" />
      </div>
    </PopCard>

    <PopCard title="품질 정보">
      <div className="flex flex-col gap-4">
        <PopMultiSelect options={DEFECT_OPTIONS} value={defectTypes} onChange={setDefectTypes} label="불량유형" placeholder="발생한 불량유형을 선택하세요" />
        <TapField label="특이사항 / 비고" value={memo} placeholder="특이사항을 입력하세요 (탭하면 키패드 오픈)" onTap={() => setTkMemo(true)} />
      </div>
    </PopCard>

    <PopButton variant="default" fullWidth className="h-14 text-lg" onClick={onSave}>일지 저장</PopButton>

    <PopTextKeypadDialog
      open={tkWorker}
      onClose={() => setTkWorker(false)}
      onConfirm={onWorkerConfirm}
      title="작업자 입력"
      initialValue={worker}
      maxLength={20}
    />
    <PopTextKeypadDialog
      open={tkMemo}
      onClose={() => setTkMemo(false)}
      onConfirm={onMemoConfirm}
      title="특이사항 입력"
      initialValue={memo}
      maxLength={100}
    />
  </div>
)
