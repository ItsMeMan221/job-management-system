import { Controller, useFormContext } from "react-hook-form"
import { useCallback, useState } from "react"
import { Input } from "../ui/input"
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"
import type { InputHTMLAttributes } from "react"

interface NumberInputProps<TShape> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "step" | "min" | "max"
> {
  name: (keyof TShape & string) | string
  label?: string
  className?: string
  description?: string
  orientation?: "vertical" | "horizontal"
  placeholder?: string
  min?: number
  max?: number
  step?: number
  decimal?: boolean
  precision?: number
  prefix?: string
  suffix?: string
  thousandSeparator?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatInteger = (intStr: string, thousandSeparator: boolean): string => {
  if (!intStr || intStr === "-") return intStr
  if (!thousandSeparator) return intStr
  const isNegative = intStr.startsWith("-")
  const digits = isNegative ? intStr.slice(1) : intStr
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return isNegative ? "-" + formatted : formatted
}

const formatForDisplay = (
  raw: string,
  decimal: boolean,
  precision: number,
  thousandSeparator: boolean
): string => {
  if (raw === "" || raw === "-") return raw
  const endsWithDot = raw.endsWith(".")
  const [intPart, decPart] = raw.split(".")
  const formattedInt = formatInteger(intPart, thousandSeparator)
  if (!decimal) return formattedInt
  if (endsWithDot) return formattedInt + "."

  if (decPart !== undefined)
    return formattedInt + "." + decPart.slice(0, precision)
  return formattedInt
}

const stripCommas = (value: string): string => value.replace(/,/g, "")

const stripAffix = (value: string, prefix: string, suffix: string): string => {
  let result = value
  if (prefix && result.startsWith(prefix)) result = result.slice(prefix.length)
  if (suffix && result.endsWith(suffix))
    result = result.slice(0, -suffix.length)
  return result
}

// ─── Key fix: always emit number | null, never string ─────────────────────────

const toNumberOrNull = (raw: string): number | null => {
  if (raw === "" || raw === "-") return null
  const n = parseFloat(raw)
  return isNaN(n) ? null : n
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NumberField<TShape>({
  name,
  label,
  className,
  description,
  orientation = "vertical",
  placeholder,
  min,
  max,
  decimal = false,
  precision = 2,
  prefix = "",
  suffix = "",
  thousandSeparator = true,
  ...props
}: NumberInputProps<TShape>) {
  const form = useFormContext()
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState("")

  const valueToDisplay = useCallback(
    (fieldValue: number | string | null | undefined): string => {
      if (fieldValue === null || fieldValue === undefined || fieldValue === "")
        return ""
      const raw = String(fieldValue)
      return formatForDisplay(raw, decimal, precision, thousandSeparator)
    },
    [decimal, precision, thousandSeparator]
  )
  const leftPadding =
    prefix && !isFocused
      ? `${Math.max(prefix.length * 8 + 16, 32)}px`
      : undefined

  const rightPadding =
    suffix && !isFocused
      ? `${Math.max(suffix.length * 8 + 16, 32)}px`
      : undefined

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const renderedValue = isFocused
          ? displayValue
          : valueToDisplay(field.value)

        return (
          <Field
            data-invalid={fieldState.invalid}
            className="my-2 flex flex-wrap items-center gap-4 md:flex-nowrap"
            orientation={orientation}
          >
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <div className="flex-1">
              <div className="relative">
                {prefix && !isFocused && (
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm whitespace-nowrap text-muted-foreground">
                    {prefix}
                  </span>
                )}

                <Input
                  id={name}
                  type="text"
                  inputMode={decimal ? "decimal" : "numeric"}
                  placeholder={placeholder}
                  className={[
                    !isFocused && prefix ? "pl-8" : "",
                    !isFocused && suffix ? "pr-8" : "",
                    className,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  value={renderedValue}
                  onFocus={() => {
                    setDisplayValue(valueToDisplay(field.value))
                    setIsFocused(true)
                  }}
                  onChange={(e) => {
                    const raw = stripAffix(
                      stripCommas(e.target.value),
                      prefix,
                      suffix
                    )

                    // Build validated numeric string
                    let numeric = ""
                    for (let i = 0; i < raw.length; i++) {
                      const ch = raw[i]
                      if (/\d/.test(ch)) {
                        numeric += ch
                      } else if (ch === "-" && i === 0 && numeric === "") {
                        numeric += ch
                      } else if (
                        ch === "." &&
                        decimal &&
                        !numeric.includes(".")
                      ) {
                        numeric += ch
                      }
                    }

                    // Enforce decimal precision
                    if (decimal && numeric.includes(".")) {
                      const [intPart, decPart] = numeric.split(".")
                      numeric = intPart + "." + decPart.slice(0, precision)
                    }

                    const formatted = formatForDisplay(
                      numeric,
                      decimal,
                      precision,
                      thousandSeparator
                    )
                    setDisplayValue(formatted)

                    // ✅ FIX: always emit number | null, never string
                    // During typing we emit number so Zod never sees a string.
                    // Incomplete inputs like "-" or "" emit null.
                    field.onChange(toNumberOrNull(numeric))
                  }}
                  onBlur={() => {
                    setIsFocused(false)

                    let raw = stripAffix(
                      stripCommas(String(field.value ?? "")),
                      prefix,
                      suffix
                    )

                    // Drop trailing decimal point
                    if (raw.endsWith(".")) raw = raw.slice(0, -1)

                    if (raw === "" || raw === "-" || raw === "null") {
                      // ✅ FIX: emit null instead of '' so Zod gets number | null
                      field.onChange(null)
                    } else {
                      const numValue = parseFloat(raw)
                      if (!isNaN(numValue)) {
                        const clamped =
                          min !== undefined && numValue < min
                            ? min
                            : max !== undefined && numValue > max
                              ? max
                              : numValue
                        // ✅ Always a real number on blur
                        field.onChange(clamped)
                      } else {
                        field.onChange(null)
                      }
                    }

                    field.onBlur()
                  }}
                  style={{
                    paddingLeft: leftPadding,
                    paddingRight: rightPadding,
                  }}
                  {...props}
                />
                {suffix && !isFocused && (
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm whitespace-nowrap text-muted-foreground">
                    {suffix}
                  </span>
                )}
              </div>

              <FieldDescription>{description}</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )
      }}
    />
  )
}
