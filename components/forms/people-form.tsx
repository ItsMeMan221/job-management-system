"use client"

import peopleSchema, { PeopleInput } from "@/zod/people"
import { FormProvider, useForm } from "react-hook-form"
import { FieldGroup } from "../ui/field"
import { zodResolver } from "@hookform/resolvers/zod"
import TextField from "../inputs/text-field"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { getCities } from "@/server/city"
import ComboboxField from "../inputs/combobox-field"
import RadioGroupField from "../inputs/radiogroup-field"
import NumberField from "../inputs/number-field"
import SwitchField from "../inputs/switch-field"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { addPeople, updatePeople } from "@/server/people"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { People } from "@/db/scheme"
import { Spinner } from "../ui/spinner"

interface PeopleFormProps {
  cities?: Awaited<ReturnType<typeof getCities>>["data"]
  isEdit?: boolean
  initialData?: Partial<People>
}

export default function PeopleForm({
  cities,
  isEdit,
  initialData,
}: PeopleFormProps) {
  const router = useRouter()
  const rateTypeOptions = [
    { value: "MINUTE", label: "MINUTE" },
    { value: "FLAT", label: "FLAT" },
  ]
  const typeOptions = [
    { value: "REPORTER", label: "Reporter" },
    { value: "EDITOR", label: "Editor" },
  ]
  const form = useForm<PeopleInput>({
    resolver: zodResolver(peopleSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      cityId: initialData?.cityId ?? "",
      rateType: initialData?.rateType ?? "MINUTE",
      rate: initialData?.rate ?? 0,
      type: initialData?.type ?? "REPORTER",
      available: initialData?.available ?? true,
    },
  })
  const rateType = form.watch("rateType")

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: PeopleInput) => {
      if (!isEdit) {
        return await addPeople(data)
      } else {
        return await updatePeople(initialData?.id || "", data)
      }
    },
    onSuccess: (data) => {
      if (!isEdit) {
        toast.success(data?.message || "People added successfully")
        router.push("/people")
      } else {
        toast.success(data?.message || "People updated successfully")
        router.push("/people")
      }
    },
    onError: (err) => {
      if (!isEdit) {
        toast.error("Failed to add people")
      } else {
        toast.error("Failed to update people")
      }
    },
  })

  const onSubmit = async (data: PeopleInput) => {
    await mutateAsync(data)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">People Details</h2>
            </CardHeader>
            <CardContent>
              <TextField name="name" label="Name" placeholder="Enter name" />
              <ComboboxField
                name="cityId"
                label="City"
                placeholder="Select a city"
                options={cities || []}
              />
              <RadioGroupField
                name="rateType"
                label="Rate Type"
                options={rateTypeOptions}
                layout="horizontal"
              />
              <NumberField
                name="rate"
                label="Rate"
                placeholder="Enter rate"
                prefix="Rp."
                suffix={
                  rateTypeOptions.find((option) => option.value === rateType)
                    ?.label
                }
              />
              <RadioGroupField
                name="type"
                label="Type"
                options={typeOptions}
                layout="horizontal"
              />
              <SwitchField name="available" label="Available" />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner />}
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Update People" : "Add People"}
              </Button>
            </CardFooter>
          </Card>
        </FieldGroup>
      </form>
    </FormProvider>
  )
}
