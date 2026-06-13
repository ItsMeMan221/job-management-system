import { Controller, useFormContext } from "react-hook-form"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

export interface ComboboxOption {
  [key: string]: unknown
  value: unknown
  label: string
}

interface BaseComboboxFieldProps<TShape> {
  name: (keyof TShape & string) | string
  label?: string
  description?: string
  placeholder?: string
  className?: string
  orientation?: "vertical" | "horizontal"
  options: ComboboxOption[]
  valueKey?: string
  labelKey?: string
  disabled?: boolean
  showClear?: boolean
  emptyText?: string
  hidden?: boolean
  onValueChange?: (value: unknown) => void
}

type SingleComboboxFieldProps<TShape> = BaseComboboxFieldProps<TShape> & {
  multiple?: false | undefined
}

type MultipleComboboxFieldProps<TShape> = BaseComboboxFieldProps<TShape> & {
  multiple: true
}

type ComboboxFieldProps<TShape> =
  | SingleComboboxFieldProps<TShape>
  | MultipleComboboxFieldProps<TShape>

const getLabel = (option: ComboboxOption, labelKey: string): string =>
  String(option[labelKey] ?? "")

const getValue = (option: ComboboxOption, valueKey: string): unknown =>
  option[valueKey]

const findOptionByValue = (
  options: ComboboxOption[],
  value: unknown,
  valueKey: string
): ComboboxOption | undefined =>
  options.find((opt) => String(getValue(opt, valueKey)) === String(value))

export default function ComboboxField<TShape>({
  name,
  label,
  description,
  placeholder = "Select an option...",
  className,
  orientation = "vertical",
  options,
  valueKey = "value",
  labelKey = "label",
  disabled = false,
  showClear = true,
  emptyText = "No options found.",
  multiple,
  onValueChange,
  hidden = false,
}: ComboboxFieldProps<TShape>) {
  const form = useFormContext()

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        // -----------------------------------------------------------------------
        // Multiple mode
        // -----------------------------------------------------------------------
        if (multiple) {
          const selectedValues: unknown[] = Array.isArray(field.value)
            ? field.value.map((v: ComboboxOption | null) =>
                typeof v === "object" && v !== null ? getValue(v, valueKey) : v
              )
            : []

          const selectedOptions = selectedValues
            .map((v) => findOptionByValue(options, v, valueKey))
            .filter((o): o is ComboboxOption => o !== undefined)

          const handleChange = (newOptions: ComboboxOption[]) => {
            const values = newOptions.map((o) => getValue(o, valueKey))
            field.onChange(values)
            onValueChange?.(values)
          }

          return (
            <Field
              data-invalid={fieldState.invalid}
              orientation={orientation}
              hidden={hidden}
              className="my-2 flex flex-wrap items-start gap-4 md:flex-nowrap"
            >
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <div className="flex-1">
                <Combobox
                  items={options}
                  multiple
                  value={selectedOptions}
                  onValueChange={handleChange}
                  itemToStringValue={(opt) => getLabel(opt, labelKey)}
                  disabled={disabled}
                  aria-invalid={fieldState.invalid}
                >
                  <ComboboxChips
                    className={className}
                    aria-invalid={fieldState.invalid}
                  >
                    {selectedOptions.map((opt) => (
                      <ComboboxChip
                        key={String(getValue(opt, valueKey))}
                        showRemove
                      >
                        {getLabel(opt, labelKey)}
                      </ComboboxChip>
                    ))}
                    <ComboboxChipsInput
                      id={name}
                      placeholder={
                        selectedOptions.length === 0
                          ? placeholder
                          : "Add more..."
                      }
                      onBlur={field.onBlur}
                    />
                  </ComboboxChips>

                  <ComboboxContent>
                    <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                    <ComboboxList>
                      {(opt) => (
                        <ComboboxItem
                          key={String(getValue(opt, valueKey))}
                          value={opt}
                        >
                          {getLabel(opt, labelKey)}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                <FieldDescription className="mt-2">
                  {description}
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )
        }

        // -----------------------------------------------------------------------
        // Single mode
        // -----------------------------------------------------------------------

        const rawValue =
          field.value !== null &&
          field.value !== undefined &&
          field.value !== ""
            ? typeof field.value === "object"
              ? getValue(field.value, valueKey)
              : field.value
            : undefined

        const selectedOption =
          rawValue !== undefined
            ? findOptionByValue(options, rawValue, valueKey)
            : undefined

        const handleChange = (newOption: ComboboxOption | null) => {
          if (!newOption) {
            field.onChange(null)
            onValueChange?.(null)
            return
          }

          field.onChange(getValue(newOption, valueKey))
          onValueChange?.(getValue(newOption, valueKey))
        }

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={orientation}
            hidden={hidden}
            className="my-2 flex flex-wrap items-center gap-4 md:flex-nowrap"
          >
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <div className="flex-1">
              <Combobox
                items={options}
                value={selectedOption ?? null}
                onValueChange={handleChange}
                itemToStringValue={(opt) => getLabel(opt, labelKey)}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
              >
                <ComboboxInput
                  id={name}
                  placeholder={placeholder}
                  className={className}
                  onBlur={field.onBlur}
                  disabled={disabled}
                  aria-invalid={fieldState.invalid}
                  showClear={showClear && selectedOption !== undefined}
                />
                <ComboboxContent>
                  <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                  <ComboboxList>
                    {(opt) => (
                      <ComboboxItem
                        key={String(getValue(opt, valueKey))}
                        value={opt}
                      >
                        {getLabel(opt, labelKey)}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <FieldDescription className="mt-2">
                {description}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )
      }}
    />
  )
}
