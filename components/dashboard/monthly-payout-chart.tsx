"use client"

import { getMonthlyPayoutChart } from "@/server/dashboard"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface MonthlyPayoutChartProps {
  data?: Awaited<ReturnType<typeof getMonthlyPayoutChart>>
}

export default function MonthlyPayoutChart({ data }: MonthlyPayoutChartProps) {
  const chartConfig = {
    payout: {
      label: "Payout",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <AreaChart
        accessibilityLayer
        data={data?.data ?? []}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <defs>
          <linearGradient id="fillPayout" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-payout)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-payout)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Intl.NumberFormat("id-ID", {
              notation: "compact",
            }).format(Number(value))
          }
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) =>
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(Number(value))
              }
            />
          }
        />

        <Area
          dataKey="payout"
          type="monotone"
          fill="url(#fillPayout)"
          stroke="var(--color-payout)"
          strokeWidth={3}
        />
      </AreaChart>
    </ChartContainer>
  )
}
