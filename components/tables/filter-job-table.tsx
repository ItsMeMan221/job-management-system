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
import { FilterJobInput, filterJobScheme } from "@/zod/job"

export default function FilterJobTable() {
  const router = useRouter()
  const params = useSearchParams()

  const locationOptions = [
    { value: "REMOTE", label: "Remote" },
    { value: "ONSITE", label: "On-site" },
  ]

  const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "TRANSCRIBED", label: "Transcribed" },
    { value: "REVIEWED", label: "Reviewed" },
    { value: "COMPLETED", label: "Completed" },
  ]

  const form = useForm<FilterJobInput>({
    resolver: zodResolver(filterJobScheme),
    defaultValues: {
      name: params.get("name") ?? undefined,
      city: params.get("city") ?? undefined,
      location: params.get("location") ?? undefined,
      status: params.get("status") ?? undefined,
    },
  })

  const onSubmit = (data: FilterJobInput) => {
    const query = new URLSearchParams()
    if (data.name) query.set("name", data.name)
    if (data.city) query.set("city", data.city)
    if (data.location) query.set("location", data.location)
    if (data.status) query.set("status", data.status)

    router.push(`/jobs/?${query.toString()}`)
  }

  const onReset = () => {
    form.reset({
      name: "",
      city: "",
      location: undefined,
      status: undefined,
    })
    router.push("/jobs")
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
                <TextField name="name" label="Name" placeholder="Enter name" />
                <RadioGroupField
                  name="location"
                  label="Location"
                  options={locationOptions}
                  layout="horizontal"
                />
                <TextField name="city" label="City" placeholder="Enter city" />

                <RadioGroupField
                  name="status"
                  label="Status"
                  options={statusOptions}
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
