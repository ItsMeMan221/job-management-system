"use client"

import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type RateType = "MINUTE" | "FLAT"

interface PersonPayment {
  name: string
  rate?: number | null
  rateType?: RateType | null
}

interface PaymentPreviewProps {
  duration: number

  reporter: {
    current: PersonPayment | null
    pending: PersonPayment | null
  }

  editor: {
    current: PersonPayment | null
    pending: PersonPayment | null
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

function calculatePayment(
  rate?: number | null,
  rateType?: RateType | null,
  duration = 0
) {
  if (!rate) return 0

  return rateType === "MINUTE" ? rate * duration : rate
}

interface PaymentRowProps {
  title: string
  duration: number
  current: PersonPayment | null
  pending: PersonPayment | null
}

function PaymentRow({ title, duration, current, pending }: PaymentRowProps) {
  const currentTotal = calculatePayment(
    current?.rate,
    current?.rateType,
    duration
  )

  const pendingTotal = calculatePayment(
    pending?.rate,
    pending?.rateType,
    duration
  )

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="font-medium">{title}</h3>

      {!current && !pending && (
        <p className="text-sm text-muted-foreground">Not assigned</p>
      )}

      {current && (
        <div
          className={`space-y-1 ${
            pending ? "text-muted-foreground line-through" : ""
          }`}
        >
          <p className="font-medium">{current.name}</p>

          <p className="text-sm">
            {current.rateType === "MINUTE"
              ? `${formatCurrency(current.rate ?? 0)} × ${duration} min`
              : `${formatCurrency(current.rate ?? 0)} (Flat)`}
          </p>

          <p className="font-semibold">{formatCurrency(currentTotal)}</p>
        </div>
      )}

      {pending && (
        <div className="space-y-1 text-green-600">
          {current && <ArrowRight className="h-4 w-4" />}

          <p className="font-medium">{pending.name}</p>

          <p className="text-sm">
            {pending.rateType === "MINUTE"
              ? `${formatCurrency(pending.rate ?? 0)} × ${duration} min`
              : `${formatCurrency(pending.rate ?? 0)} (Flat)`}
          </p>

          <p className="font-semibold">{formatCurrency(pendingTotal)}</p>
        </div>
      )}
    </div>
  )
}

export default function PaymentPreview({
  duration,
  reporter,
  editor,
}: PaymentPreviewProps) {
  const activeReporter = reporter.pending ?? reporter.current

  const activeEditor = editor.pending ?? editor.current

  const reporterTotal = calculatePayment(
    activeReporter?.rate,
    activeReporter?.rateType,
    duration
  )

  const editorTotal = calculatePayment(
    activeEditor?.rate,
    activeEditor?.rateType,
    duration
  )

  const grandTotal = reporterTotal + editorTotal

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <h2 className="text-xl font-medium tracking-wider">Payment Preview</h2>
      </CardHeader>

      <CardContent className="space-y-4">
        <PaymentRow
          title="Reporter Payment"
          duration={duration}
          current={reporter.current}
          pending={reporter.pending}
        />

        <PaymentRow
          title="Editor Payment"
          duration={duration}
          current={editor.current}
          pending={editor.pending}
        />

        <div className="flex items-center justify-between border-t pt-4">
          <span className="font-medium">Total Payout</span>

          <span className="text-xl font-bold">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
