import Link from "next/link"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent } from "@/components/ui/empty"

interface NotFoundProps {
  title?: string
  description?: string
  backHref?: string
  backLabel?: string
}

export default function NotFound({
  title = "Not Found",
  description = "The resource you are looking for does not exist or has been removed.",
  backHref = "/",
  backLabel = "Go Back",
}: NotFoundProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Empty>
        <EmptyContent className="flex flex-col items-center text-center">
          <SearchX className="mb-4 size-12 text-muted-foreground" />

          <h2 className="text-xl font-semibold">{title}</h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {description}
          </p>

          <Button asChild className="mt-6">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
