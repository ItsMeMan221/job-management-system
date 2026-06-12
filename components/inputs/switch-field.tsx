/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"
import { Switch } from "../ui/switch"
import type { InputHTMLAttributes } from "react"

interface SwitchProps<TShape> extends Omit<
  InputHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  name: keyof TShape & string
  label?: string
  className?: string
  description?: string
  orientation?: "vertical" | "horizontal"
  onValueChange?: (checked: boolean) => void
}

export default function SwitchField<TShape>({
  name,
  label,
  className,
  description,
  orientation = "vertical",
  onValueChange,
  ...props
}: SwitchProps<TShape>) {
  const form = useFormContext()

  const handleCheckedChange = (checked: boolean) => {
    form.setValue(name, checked as any)
    onValueChange?.(checked)
  }

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation={orientation}>
          <FieldLabel htmlFor={name}>{label || "\u00A0"}</FieldLabel>
          <Switch
            id={name}
            checked={field.value ?? false}
            onCheckedChange={handleCheckedChange}
            aria-invalid={fieldState.invalid}
            {...(props as any)}
          />
          <FieldDescription>{description}</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
