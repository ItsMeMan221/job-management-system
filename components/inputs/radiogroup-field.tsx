import { Controller, useFormContext } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"

interface RadioGroupProps<TShape> {
  name: (keyof TShape & string) | string
  label?: string
  description?: string
  orientation?: "vertical" | "horizontal"
  options: Array<{
    value: string
    label: string
  }>
  layout?: "vertical" | "horizontal"
}

export default function RadioGroupField<TShape>({
  name,
  label,
  description,
  orientation = "vertical",
  options,
  layout = "vertical",
}: RadioGroupProps<TShape>) {
  const form = useFormContext()

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className="my-4 flex flex-wrap items-start gap-4 md:flex-nowrap"
          orientation={orientation}
        >
          <FieldLabel>{label}</FieldLabel>
          <div className="flex-1">
            <RadioGroup
              value={field.value || ""}
              onValueChange={field.onChange}
              className={
                layout === "vertical"
                  ? "flex flex-col gap-3"
                  : "flex flex-wrap gap-x-6 gap-y-3"
              }
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label
                    htmlFor={option.value}
                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
            <FieldDescription>{description}</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        </Field>
      )}
    />
  )
}
