import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatCardProps {
  title: string
  value: string | number | null | undefined
}

export function DashboardStatCard({ title, value }: DashboardStatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{title}</p>

        <h2 className="mt-3 text-4xl font-semibold tracking-tight">{value}</h2>
      </CardContent>
    </Card>
  )
}
