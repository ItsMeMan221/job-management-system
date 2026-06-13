"use client"

import { FormProvider, useForm } from "react-hook-form"
import { FieldGroup } from "../ui/field"
import { Card, CardContent } from "../ui/card"
import TextField from "../inputs/text-field"
import { Button } from "../ui/button"
import RadioGroupField from "../inputs/radiogroup-field"
import { Check, X } from "lucide-react"
import { FilterPeopleInput, filterPeopleSchema } from "@/zod/people"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"

export default function FilterPeopleTable() {
  const router = useRouter()
  const params = useSearchParams()

  const typeOptions = [
    { value: "REPORTER", label: "Reporter" },
    { value: "EDITOR", label: "Editor" },
  ]

  const form = useForm<FilterPeopleInput>({
    resolver: zodResolver(filterPeopleSchema),
    defaultValues: {
      name: params.get("name") ?? undefined,
      city: params.get("city") ?? undefined,
      type: params.get("type") ?? undefined,
    },
  })

  const onSubmit = (data: FilterPeopleInput) => {
    const query = new URLSearchParams()
    if (data.name) query.set("name", data.name)
    if (data.city) query.set("city", data.city)
    if (data.type) query.set("type", data.type)

    router.push(`/people/?${query.toString()}`)
  }

  const onReset = () => {
    form.reset({
      name: "",
      city: "",
      type: undefined,
    })
    router.push("/people")
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
                <TextField name="name" label="Name" placeholder="Enter name" />
                <TextField name="city" label="City" placeholder="Enter city" />

                <RadioGroupField
                  name="type"
                  label="Role"
                  options={typeOptions}
                  layout="horizontal"
                />
              </div>
              <Button
                className="mx-2"
                onClick={() => onReset()}
                variant="destructive"
                type="button"
              >
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Apply Filter
              </Button>
            </CardContent>
          </Card>
        </FieldGroup>
      </form>
    </FormProvider>
  )
}
