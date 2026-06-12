import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import type { InputHTMLAttributes } from "react"

interface InputProps<TShape> extends InputHTMLAttributes<HTMLInputElement> {
  name: (keyof TShape & string) | string
  label?: string
  className?: string
  description?: string
  orientation?: "vertical" | "horizontal"
}

export default function TextField<TShape>({
  name,
  label,
  className,
  description,
  orientation = "vertical",
  ...props
}: InputProps<TShape>) {
  const form = useFormContext()

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className="my-2 flex flex-wrap items-center gap-4 md:flex-nowrap"
          orientation={orientation}
          hidden={props.hidden}
        >
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            {...props}
            id={name}
            aria-invalid={fieldState.invalid}
          />
          <FieldDescription>{description}</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
