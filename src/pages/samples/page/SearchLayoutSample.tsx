import { useState } from 'react'
import { format } from 'date-fns'
import { Search, RotateCcw, Download } from 'lucide-react'
import {
  AppPageLayout,
  AppForm,
  AppSection,
  AppInput,
  AppSelect,
  AppDatePicker,
  AppButton,
  AppDataGrid,
} from '@hyeonm1339/mes-ui-kit'
import type { EditableColumn } from '@hyeonm1339/mes-ui-kit'

// ─── 조회 조건 옵션 ───────────────────────────────────────────────
const processOptions = [
  { label: '전체', value: '' },
  { label: '프레스', value: 'press' },
  { label: '선반', value: 'lathe' },
  { label: '조립', value: 'assembly' },
  { label: '도장', value: 'paint' },
  { label: '열처리', value: 'heat' },
]

const statusOptions = [
  { label: '전체', value: '' },
  { label: '대기', value: 'pending' },
  { label: '진행중', value: 'in_progress' },
  { label: '완료', value: 'done' },
  { label: '취소', value: 'canceled' },
]

// ─── 더미 데이터 ──────────────────────────────────────────────────
type WorkOrder = {
  woNo: string
  itemCode: string
  itemName: string
  process: string
  planQty: number
  doneQty: number
  unit: string
  status: string
  startDate: string
  endDate: string
}

const ALL_DATA: WorkOrder[] = [
  { woNo: 'WO-2024-001', itemCode: 'ITM-001', itemName: '브래킷 A형', process: 'press', planQty: 500, doneQty: 500, unit: 'EA', status: 'done', startDate: '2024-03-01', endDate: '2024-03-05' },
  { woNo: 'WO-2024-002', itemCode: 'ITM-002', itemName: '기어 B형', process: 'lathe', planQty: 300, doneQty: 180, unit: 'EA', status: 'in_progress', startDate: '2024-03-03', endDate: '2024-03-08' },
  { woNo: 'WO-2024-003', itemCode: 'ITM-003', itemName: '샤프트 C형', process: 'assembly', planQty: 150, doneQty: 0, unit: 'EA', status: 'pending', startDate: '2024-03-06', endDate: '2024-03-10' },
  { woNo: 'WO-2024-004', itemCode: 'ITM-004', itemName: '플랜지 D형', process: 'paint', planQty: 200, doneQty: 200, unit: 'EA', status: 'done', startDate: '2024-03-02', endDate: '2024-03-04' },
  { woNo: 'WO-2024-005', itemCode: 'ITM-005', itemName: '너트 E형', process: 'heat', planQty: 400, doneQty: 0, unit: 'EA', status: 'canceled', startDate: '2024-03-05', endDate: '2024-03-07' },
  { woNo: 'WO-2024-006', itemCode: 'ITM-006', itemName: '볼트 F형', process: 'press', planQty: 600, doneQty: 420, unit: 'EA', status: 'in_progress', startDate: '2024-03-07', endDate: '2024-03-12' },
  { woNo: 'WO-2024-007', itemCode: 'ITM-007', itemName: '스프링 G형', process: 'heat', planQty: 250, doneQty: 250, unit: 'EA', status: 'done', startDate: '2024-03-01', endDate: '2024-03-03' },
  { woNo: 'WO-2024-008', itemCode: 'ITM-008', itemName: '와셔 H형', process: 'assembly', planQty: 800, doneQty: 320, unit: 'EA', status: 'in_progress', startDate: '2024-03-08', endDate: '2024-03-15' },
  { woNo: 'WO-2024-009', itemCode: 'ITM-009', itemName: '핀 I형', process: 'lathe', planQty: 450, doneQty: 0, unit: 'EA', status: 'pending', startDate: '2024-03-10', endDate: '2024-03-14' },
  { woNo: 'WO-2024-010', itemCode: 'ITM-010', itemName: '링 J형', process: 'paint', planQty: 350, doneQty: 350, unit: 'EA', status: 'done', startDate: '2024-03-04', endDate: '2024-03-06' },
]

const statusLabelMap: Record<string, string> = {
  pending: '대기',
  in_progress: '진행중',
  done: '완료',
  canceled: '취소',
}

const statusColorMap: Record<string, string> = {
  pending: 'text-muted-foreground',
  in_progress: 'font-medium text-blue-600 dark:text-blue-400',
  done: 'font-medium text-green-600 dark:text-green-400',
  canceled: 'text-destructive line-through',
}

// ─── 컬럼 정의 ────────────────────────────────────────────────────
const columns: EditableColumn<WorkOrder>[] = [
  { accessorKey: 'woNo', header: '작업지시번호', width: 140, readOnly: true, sticky: true },
  { accessorKey: 'itemCode', header: '품목코드', width: 110, readOnly: true },
  { accessorKey: 'itemName', header: '품목명', width: 150, readOnly: true },
  { accessorKey: 'process', header: '공정', width: 90, readOnly: true },
  { accessorKey: 'planQty', header: '계획수량', width: 90, type: 'number', align: 'right', readOnly: true },
  { accessorKey: 'doneQty', header: '실적수량', width: 90, type: 'number', align: 'right', readOnly: true },
  { accessorKey: 'unit', header: '단위', width: 60, align: 'center', readOnly: true },
  {
    accessorKey: 'status',
    header: '상태',
    width: 80,
    align: 'center',
    readOnly: true,
    render: (value: unknown) => (
      <span className={statusColorMap[value as string] ?? ''}>
        {statusLabelMap[value as string] ?? String(value)}
      </span>
    ),
  },
  { accessorKey: 'startDate', header: '시작일', width: 100, align: 'center', readOnly: true },
  { accessorKey: 'endDate', header: '종료일', width: 100, align: 'center', readOnly: true },
]

// ─── 조회 조건 타입 ───────────────────────────────────────────────
type Cond = {
  woNo: string
  itemName: string
  process: string
  status: string
  startDate: Date | undefined
  endDate: Date | undefined
}

const INIT_COND: Cond = {
  woNo: '',
  itemName: '',
  process: '',
  status: '',
  startDate: undefined,
  endDate: undefined,
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────
export const SearchLayoutSample = () => {
  const [cond, setCond] = useState<Cond>(INIT_COND)
  const [data, setData] = useState<WorkOrder[]>(ALL_DATA)

  const handleSearch = () => {
    const fromStr = cond.startDate ? format(cond.startDate, 'yyyy-MM-dd') : ''
    const toStr = cond.endDate ? format(cond.endDate, 'yyyy-MM-dd') : ''

    const result = ALL_DATA.filter((row) => {
      if (cond.woNo && !row.woNo.toLowerCase().includes(cond.woNo.toLowerCase())) return false
      if (cond.itemName && !row.itemName.includes(cond.itemName)) return false
      if (cond.process && row.process !== cond.process) return false
      if (cond.status && row.status !== cond.status) return false
      if (fromStr && row.startDate < fromStr) return false
      if (toStr && row.endDate > toStr) return false
      return true
    })
    setData(result)
  }

  const handleReset = () => {
    setCond(INIT_COND)
    setData(ALL_DATA)
  }

  return (
    <AppPageLayout>
      <AppForm labelAlign="top" onSubmit={handleSearch}>
        <AppSection
          title="조회 조건"
          cols={4}
          actions={
            <div className="flex gap-2">
              <AppButton variant="outline" size="sm" type="button" onClick={handleReset} prefixIcon={RotateCcw}>
                초기화
              </AppButton>
              <AppButton size="sm" type="submit" prefixIcon={Search}>
                조회
              </AppButton>
            </div>
          }
        >
          <AppInput
            label="작업지시번호"
            placeholder="작업지시번호"
            value={cond.woNo}
            onChange={(e) => setCond((p) => ({ ...p, woNo: e.target.value }))}
          />
          <AppInput
            label="품목명"
            placeholder="품목명"
            value={cond.itemName}
            onChange={(e) => setCond((p) => ({ ...p, itemName: e.target.value }))}
          />
          <AppSelect
            label="공정"
            options={processOptions}
            value={cond.process}
            onChange={(v) => setCond((p) => ({ ...p, process: v }))}
          />
          <AppSelect
            label="상태"
            options={statusOptions}
            value={cond.status}
            onChange={(v) => setCond((p) => ({ ...p, status: v }))}
          />
          <AppDatePicker
            mode="single"
            label="시작일(From)"
            value={cond.startDate}
            onChange={(d) => setCond((p) => ({ ...p, startDate: d }))}
          />
          <AppDatePicker
            mode="single"
            label="시작일(To)"
            value={cond.endDate}
            onChange={(d) => setCond((p) => ({ ...p, endDate: d }))}
          />
        </AppSection>
      </AppForm>

      <AppSection
        title={`조회 결과 (${data.length}건)`}
        actions={
          <AppButton variant="outline" size="sm" prefixIcon={Download}>
            엑셀 다운로드
          </AppButton>
        }
      >
        <AppDataGrid columns={columns} data={data} height={420} />
      </AppSection>
    </AppPageLayout>
  )
}
