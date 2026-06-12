"use client"

import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"

import { getJobLogs, getJobs, updateJob } from "@/server/jobs"
import { getPeople } from "@/server/people"

import { UpdateJobInput, updateJobScheme } from "@/zod/job"

import { FieldGroup } from "../ui/field"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"

import ComboboxField from "../inputs/combobox-field"
import { AssignmentPreview } from "../layouts/assignment-preview"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Spinner } from "../ui/spinner"
import PaymentPreview from "../layouts/payment-preview"
import UpdateStatusForm from "./update-status-form"

interface UpdateJobFormProps {
  reporterData?: Awaited<ReturnType<typeof getPeople>>["data"]
  editorData?: Awaited<ReturnType<typeof getPeople>>["data"]
  jobLogData?: Awaited<ReturnType<typeof getJobLogs>>["data"]
  data?: NonNullable<Awaited<ReturnType<typeof getJobs>>["data"]>[number]
}

export function UpdateJobForm({
  data,
  reporterData,
  editorData,
  jobLogData,
}: UpdateJobFormProps) {
  const router = useRouter()
  const [reporterId, setReporterId] = useState<string | null>(
    data?.reporterId || null
  )

  const [editorId, setEditorId] = useState<string | null>(
    data?.editorId || null
  )

  const pendingReporter = reporterData?.find((r) => r.id === reporterId) ?? null

  const pendingEditor = editorData?.find((e) => e.id === editorId) ?? null

  const reporterChanged =
    !!data?.reporterId && !!reporterId && reporterId !== data.reporterId

  const editorChanged =
    !!data?.editorId && !!editorId && editorId !== data.editorId

  const form = useForm<UpdateJobInput>({
    resolver: zodResolver(updateJobScheme),
    defaultValues: {
      editorId: data?.editorId || null,
      reporterId: data?.reporterId || null,
      editorRateType: data?.editorRateType || null,
      editorRate: data?.editorRate || null,
      reporterRateType: data?.reporterRateType || null,
      reporterRate: data?.reporterRate || null,
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (dataUpdate: UpdateJobInput) => {
      return await updateJob(data?.id as string, dataUpdate)
    },
    onSuccess: (data) => {
      toast.success("Job updated successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to update job")
    },
  })

  const assignReporter = async () => {
    const data: UpdateJobInput = {
      reporterId: form.getValues("reporterId"),
      reporterRate: pendingReporter?.rate || undefined,
      reporterRateType: pendingReporter?.rateType || undefined,
    }
    await mutateAsync(data)
  }

  const assignEditor = async () => {
    const data: UpdateJobInput = {
      editorId: form.getValues("editorId"),
      editorRate: pendingEditor?.rate || undefined,
      editorRateType: pendingEditor?.rateType || undefined,
    }
    await mutateAsync(data)
  }

  const reporterPendingPayment =
    reporterChanged && pendingReporter
      ? {
          name: pendingReporter.name,
          rate: pendingReporter.rate,
          rateType: pendingReporter.rateType,
        }
      : null

  const editorPendingPayment =
    editorChanged && pendingEditor
      ? {
          name: pendingEditor.name,
          rate: pendingEditor.rate,
          rateType: pendingEditor.rateType,
        }
      : null

  return (
    <>
      <FormProvider {...form}>
        <form>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* REPORTER */}
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-medium tracking-wider">
                    Reporter
                  </h2>
                  <h3 className="text-sm text-muted-foreground">
                    Only assign a reporter when the job is in NEW status
                  </h3>
                </CardHeader>

                <CardContent>
                  <AssignmentPreview
                    currentName={data?.reporter}
                    currentCity={data?.reporterCity}
                    currentRate={data?.reporterRate}
                    currentRateType={data?.reporterRateType}
                    pendingName={pendingReporter?.name}
                    pendingCity={pendingReporter?.city}
                    pendingRate={pendingReporter?.rate}
                    pendingRateType={pendingReporter?.rateType}
                    changed={reporterChanged}
                    emptyLabel="No reporter assigned yet"
                  />

                  <div className="flex items-center gap-2">
                    <ComboboxField
                      name="reporterId"
                      label="Reporter"
                      placeholder="Select reporter"
                      disabled={data?.status !== "NEW"}
                      onValueChange={(value) => {
                        if (value) {
                          setReporterId(value as string)
                        } else {
                          setReporterId(null)
                        }
                      }}
                      options={
                        reporterData?.map((reporter) => ({
                          value: reporter.id,
                          label: `${reporter.name} - ${reporter.city ?? "N/A"}`,
                        })) ?? []
                      }
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="mt-8"
                      onClick={() => assignReporter()}
                      disabled={
                        data?.status !== "NEW" ||
                        !reporterId ||
                        reporterId === data?.reporterId
                      }
                    >
                      {isPending && <Spinner />}
                      <Check className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* EDITOR */}
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-medium tracking-wider">
                    Editor
                  </h2>
                  <h3 className="text-sm text-muted-foreground">
                    Only assign an editor when the job is in TRANSCRIBED status
                  </h3>
                </CardHeader>

                <CardContent>
                  <AssignmentPreview
                    currentName={data?.editor}
                    currentCity={data?.editorCity}
                    currentRate={data?.editorRate}
                    currentRateType={data?.editorRateType}
                    pendingName={pendingEditor?.name}
                    pendingCity={pendingEditor?.city}
                    pendingRate={pendingEditor?.rate}
                    pendingRateType={pendingEditor?.rateType}
                    changed={editorChanged}
                    emptyLabel="No editor assigned yet"
                  />

                  <div className="flex items-center gap-2">
                    <ComboboxField
                      name="editorId"
                      label="Editor"
                      placeholder="Select editor"
                      disabled={data?.status !== "TRANSCRIBED"}
                      onValueChange={(value) => {
                        if (value) {
                          setEditorId(value as string)
                        } else {
                          setEditorId(null)
                        }
                      }}
                      options={
                        editorData?.map((editor) => ({
                          value: editor.id,
                          label: `${editor.name} - ${editor.city ?? "N/A"}`,
                        })) ?? []
                      }
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-8"
                      disabled={
                        data?.status !== "TRANSCRIBED" ||
                        !editorId ||
                        editorId === data?.editorId
                      }
                      onClick={() => assignEditor()}
                    >
                      {isPending && <Spinner />}
                      <Check className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FieldGroup>
        </form>
      </FormProvider>

      <section className="my-8">
        <UpdateStatusForm data={data} jobLogData={jobLogData} />
      </section>
      <section className="my-8">
        <PaymentPreview
          duration={data?.duration ?? 0}
          reporter={{
            current: data?.reporter
              ? {
                  name: data.reporter,
                  rate: data.reporterRate,
                  rateType: data.reporterRateType,
                }
              : null,
            pending: reporterPendingPayment,
          }}
          editor={{
            current: data?.editor
              ? {
                  name: data.editor,
                  rate: data.editorRate,
                  rateType: data.editorRateType,
                }
              : null,
            pending: editorPendingPayment,
          }}
        />
      </section>
    </>
  )
}
