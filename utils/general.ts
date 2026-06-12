export default function formatNumber(
  value: number | null,
  decimal: boolean = false,
  precision: number = 2
): string {
  if (value === null) return ""
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimal ? precision : 0,
    maximumFractionDigits: decimal ? precision : 0,
  }
  return new Intl.NumberFormat("en-US", options).format(value)
}
