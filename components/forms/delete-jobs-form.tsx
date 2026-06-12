"use client"

import { deleteJob, getJobs } from "@/server/jobs"
import { Button } from "../ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"

interface DeleteJobsFormProps {
  data?: NonNullable<Awaited<ReturnType<typeof getJobs>>["data"]>[number]
}
export default function DeleteJobsForm({ data }: DeleteJobsFormProps) {
  const router = useRouter()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return await deleteJob(data?.id as string)
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Job deleted successfully")
      router.push("/jobs")
    },
    onError: (err) => {
      toast.error("Failed to delete job")
    },
  })
  const onDelete = async () => {
    await mutateAsync()
  }
  if (isPending) {
    return <Loading />
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Job</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the job{" "}
            {data?.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            className="ml-2"
            onClick={onDelete}
            disabled={isPending}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
