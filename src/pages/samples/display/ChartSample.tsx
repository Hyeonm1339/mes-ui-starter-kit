import {
  AppSection,
  AppGuide,
  AppCodePreview,
  AppBarChart,
  AppLineChart,
  AppAreaChart,
  AppPieChart,
  AppComposedChart,
  AppRadialChart,
} from '@hyeonm1339/mes-ui-kit'
import source from './ChartSample.tsx?raw'

const monthlyData = [
  { month: '1월', production: 1200, defect: 32, rate: 2.7 },
  { month: '2월', production: 1350, defect: 28, rate: 2.1 },
  { month: '3월', production: 1180, defect: 41, rate: 3.5 },
  { month: '4월', production: 1420, defect: 22, rate: 1.5 },
  { month: '5월', production: 1560, defect: 35, rate: 2.2 },
  { month: '6월', production: 1490, defect: 19, rate: 1.3 },
]

const machineData = [
  { machine: 'M-001', uptime: 94, output: 420 },
  { machine: 'M-002', uptime: 87, output: 390 },
  { machine: 'M-003', uptime: 76, output: 340 },
  { machine: 'M-004', uptime: 98, output: 460 },
  { machine: 'M-005', uptime: 82, output: 370 },
]

const defectTypeData = [
  { name: '치수 불량', value: 38, color: 'var(--chart-1)' },
  { name: '외관 불량', value: 27, color: 'var(--chart-2)' },
  { name: '기능 불량', value: 18, color: 'var(--chart-3)' },
  { name: '포장 불량', value: 11, color: 'var(--chart-4)' },
  { name: '기타', value: 6, color: 'var(--chart-5)' },
]

const achievementData = [
  { label: '생산 목표', value: 87 },
  { label: '품질 목표', value: 94 },
  { label: '납기 준수율', value: 78 },
  { label: '가동률', value: 91 },
]

export const ChartSample = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Bar Chart */}
      <AppSection title="막대 차트 (AppBarChart)">
        <AppCodePreview source={source} marker="barChart">
          {/* @preview-start:barChart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AppBarChart
              title="월별 생산량"
              description="수직 막대 차트"
              data={monthlyData}
              series={[{ key: 'production', label: '생산량' }]}
              xKey="month"
              downloadable
              downloadFileName="월별-생산량"
            />
            <AppBarChart
              title="설비별 생산량 (수평)"
              description="수평 막대 차트"
              data={machineData}
              series={[{ key: 'output', label: '생산량' }]}
              xKey="machine"
              layout="horizontal"
              downloadable
              downloadFileName="설비별-생산량"
            />
            <AppBarChart
              title="월별 생산/불량 비교"
              description="그룹 막대 차트"
              data={monthlyData}
              series={[
                { key: 'production', label: '생산량' },
                { key: 'defect', label: '불량 수' },
              ]}
              xKey="month"
              downloadable
            />
            <AppBarChart
              title="월별 생산 누적"
              description="스택 막대 차트"
              data={monthlyData}
              series={[
                { key: 'production', label: '생산량' },
                { key: 'defect', label: '불량 수' },
              ]}
              xKey="month"
              stacked
              downloadable
            />
          </div>
          {/* @preview-end:barChart */}
        </AppCodePreview>
      </AppSection>

      {/* Line Chart */}
      <AppSection title="라인 차트 (AppLineChart)">
        <AppCodePreview source={source} marker="lineChart">
          {/* @preview-start:lineChart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AppLineChart
              title="불량률 추이"
              description="월별 불량률 변화"
              data={monthlyData}
              series={[{ key: 'rate', label: '불량률 (%)' }]}
              xKey="month"
              downloadable
              downloadFileName="불량률-추이"
            />
            <AppLineChart
              title="설비 가동률 비교"
              description="복수 라인 차트"
              data={machineData}
              series={[
                { key: 'uptime', label: '가동률 (%)', dot: true },
                { key: 'output', label: '생산량', dot: true },
              ]}
              xKey="machine"
              downloadable
            />
          </div>
          {/* @preview-end:lineChart */}
        </AppCodePreview>
      </AppSection>

      {/* Area Chart */}
      <AppSection title="영역 차트 (AppAreaChart)">
        <AppCodePreview source={source} marker="areaChart">
          {/* @preview-start:areaChart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AppAreaChart
              title="월별 생산량 추이"
              description="그라데이션 영역 차트"
              data={monthlyData}
              series={[{ key: 'production', label: '생산량' }]}
              xKey="month"
              downloadable
              downloadFileName="생산량-추이"
            />
            <AppAreaChart
              title="생산/불량 누적 비교"
              description="스택 영역 차트"
              data={monthlyData}
              series={[
                { key: 'production', label: '생산량' },
                { key: 'defect', label: '불량 수' },
              ]}
              xKey="month"
              stacked
              downloadable
            />
          </div>
          {/* @preview-end:areaChart */}
        </AppCodePreview>
      </AppSection>

      {/* Pie Chart */}
      <AppSection title="파이 차트 (AppPieChart)">
        <AppCodePreview source={source} marker="pieChart">
          {/* @preview-start:pieChart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AppPieChart
              title="불량 유형별 비중"
              description="파이 차트"
              data={defectTypeData}
              showLabel
              downloadable
              downloadFileName="불량-유형"
            />
            <AppPieChart
              title="불량 유형별 비중 (도넛)"
              description="도넛 차트"
              data={defectTypeData}
              donut
              showLabel
              downloadable
              downloadFileName="불량-유형-도넛"
            />
          </div>
          {/* @preview-end:pieChart */}
        </AppCodePreview>
      </AppSection>

      {/* Composed Chart */}
      <AppSection title="복합 차트 (AppComposedChart)">
        <AppCodePreview source={source} marker="composedChart">
          {/* @preview-start:composedChart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AppComposedChart
              title="생산량 + 불량률"
              description="막대 + 라인 복합"
              data={monthlyData}
              series={[
                { key: 'production', label: '생산량', type: 'bar' },
                { key: 'rate', label: '불량률 (%)', type: 'line', yAxisId: 'right' },
              ]}
              xKey="month"
              dualAxis
              downloadable
              downloadFileName="생산량-불량률"
            />
            <AppComposedChart
              title="생산량 + 불량 수"
              description="막대 + 영역 복합"
              data={monthlyData}
              series={[
                { key: 'production', label: '생산량', type: 'bar' },
                { key: 'defect', label: '불량 수', type: 'area' },
              ]}
              xKey="month"
              downloadable
            />
          </div>
          {/* @preview-end:composedChart */}
        </AppCodePreview>
      </AppSection>

      {/* Radial Chart */}
      <AppSection title="방사형 차트 (AppRadialChart)">
        <AppCodePreview source={source} marker="radialChart">
          {/* @preview-start:radialChart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AppRadialChart
              title="목표 달성률"
              description="항목별 달성률 비교"
              data={achievementData}
              downloadable
              downloadFileName="달성률"
            />
          </div>
          {/* @preview-end:radialChart */}
        </AppCodePreview>
      </AppSection>

      {/* Guide */}
      <AppGuide>
        <AppGuide.Subsection title="공통 Props (AppBarChart / AppLineChart / AppAreaChart / AppComposedChart)">
          {'data: Record<string, unknown>[] — 차트 데이터 배열\n'}
          {'series: { key, label, color? }[] — 시리즈 설정. color 미지정 시 --chart-N 순서 적용\n'}
          {'xKey: string — X축으로 사용할 데이터 키\n'}
          {'height: number (기본 300) — 차트 높이(px)\n'}
          {'downloadable: boolean — PNG 다운로드 버튼 표시\n'}
          {'downloadFileName: string — 다운로드 파일명 (확장자 제외)'}
        </AppGuide.Subsection>

        <AppGuide.Subsection title="AppBarChart 전용">
          {'layout: "vertical"(기본) | "horizontal" — 세로형 또는 가로형\n'}
          {'stacked: boolean — 누적 막대 사용 여부'}
        </AppGuide.Subsection>

        <AppGuide.Subsection title="AppAreaChart 전용">
          {'stacked: boolean — 누적 영역 사용 여부'}
        </AppGuide.Subsection>

        <AppGuide.Subsection title="AppComposedChart 전용">
          {'series[].type: "bar" | "line" | "area" — 시리즈별 차트 타입\n'}
          {'series[].yAxisId: "left" | "right" — dualAxis 사용 시 Y축 지정\n'}
          {'dualAxis: boolean — 이중 Y축 사용 여부'}
        </AppGuide.Subsection>

        <AppGuide.Subsection title="AppPieChart">
          {'data: { name, value, color? }[] — 파이 데이터\n'}
          {'donut: boolean — 도넛 차트 여부\n'}
          {'showLabel: boolean — 슬라이스 내 퍼센트 표시'}
        </AppGuide.Subsection>

        <AppGuide.Subsection title="AppRadialChart">
          {'data: { label, value, fill? }[] — 방사형 데이터\n'}
          {'value는 0~100 범위의 달성률/진척도를 표시하는 용도로 적합합니다.'}
        </AppGuide.Subsection>

        <AppGuide.Subsection title="사용 예시">
          <code className="block rounded bg-muted px-2 py-1.5 font-mono text-[11px] whitespace-pre">{`// 이중 Y축 복합 차트
<AppComposedChart
  data={data}
  series={[
    { key: 'production', label: '생산량', type: 'bar', yAxisId: 'left' },
    { key: 'rate', label: '불량률', type: 'line', yAxisId: 'right' },
  ]}
  xKey="month"
  dualAxis
  downloadable
/>`}</code>
        </AppGuide.Subsection>
      </AppGuide>
    </div>
  )
}
