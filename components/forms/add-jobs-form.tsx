"use client"

import { FormProvider, useForm } from "react-hook-form"
import { FieldGroup } from "../ui/field"
import { zodResolver } from "@hookform/resolvers/zod"
import TextField from "../inputs/text-field"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { getCities } from "@/server/city"
import ComboboxField from "../inputs/combobox-field"
import RadioGroupField from "../inputs/radiogroup-field"
import NumberField from "../inputs/number-field"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Spinner } from "../ui/spinner"
import { AddJobInput, addJobScheme } from "@/zod/job"
import { addJob } from "@/server/jobs"

interface AddJobProps {
  cities?: Awaited<ReturnType<typeof getCities>>["data"]
}

export default function AddJobForm({ cities }: AddJobProps) {
  const router = useRouter()
  const locationOptions = [
    { value: "REMOTE", label: "Remote" },
    { value: "ONSITE", label: "Onsite" },
  ]

  const form = useForm<AddJobInput>({
    resolver: zodResolver(addJobScheme),
    defaultValues: {
      name: "",
      location: "ONSITE",
      cityId: null,
      duration: 0,
    },
  })

  const location = form.watch("location")

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: AddJobInput) => {
      return await addJob(data)
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Job added successfully")
      router.push(`/jobs/${data?.data?.[0]?.id}`)
    },
    onError: (err) => {
      toast.error("Failed to add job")
    },
  })

  const onSubmit = async (data: AddJobInput) => {
    await mutateAsync(data)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Job Details</h2>
            </CardHeader>
            <CardContent>
              <TextField name="name" label="Name" placeholder="Enter name" />
              <RadioGroupField
                name="location"
                label="Location"
                options={locationOptions}
                layout="horizontal"
              />
              <ComboboxField
                name="cityId"
                label={`City ${location === "ONSITE" ? "*" : ""}`}
                placeholder="Select a city"
                options={cities || []}
              />
              <NumberField
                name="duration"
                label="Duration"
                placeholder="Enter duration"
                suffix="minutes"
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner />}
                <Save className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </CardFooter>
          </Card>
        </FieldGroup>
      </form>
    </FormProvider>
  )
}
