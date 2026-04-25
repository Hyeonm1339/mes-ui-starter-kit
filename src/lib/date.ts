import { format, isValid } from 'date-fns'

/**
 * 날짜 값을 문자열로 변환.
 * - Date, 숫자(timestamp), 파싱 가능한 문자열 모두 허용
 * - 파싱 실패 또는 유효하지 않은 날짜면 원본 값을 문자열로 반환
 *
 * @param value  변환할 값 (Date | string | number | null | undefined)
 * @param fmt    date-fns 포맷 문자열 (기본값: 'yyyy-MM-dd')
 *
 * @example
 * formatDate('2026-04-25T09:30:00')                  // '2026-04-25'
 * formatDate('2026-04-25', 'yyyy-MM-dd HH:mm:ss')    // '2026-04-25 00:00:00'
 * formatDate(new Date(), 'yyyyMMdd')                 // '20260425'
 * formatDate('invalid')                              // 'invalid'  (원본 반환)
 * formatDate(null)                                   // ''
 */
export const formatDate = (
  value: Date | string | number | null | undefined,
  fmt = 'yyyy-MM-dd',
): string => {
  if (value === null || value === undefined || value === '') return ''
  const date = value instanceof Date ? value : new Date(value)
  if (!isValid(date)) return String(value)
  return format(date, fmt)
}
