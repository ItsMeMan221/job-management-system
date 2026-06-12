import { ArrowRight } from "lucide-react"

interface AssignmentPreviewProps {
  currentName?: string | null
  currentCity?: string | null
  currentRate?: number | null
  currentRateType?: string | null

  pendingName?: string | null
  pendingCity?: string | null
  pendingRate?: number | null
  pendingRateType?: string | null

  changed: boolean
  emptyLabel: string
}

export function AssignmentPreview({
  currentName,
  currentCity,
  currentRate,
  currentRateType,
  pendingName,
  pendingCity,
  pendingRate,
  pendingRateType,
  changed,
  emptyLabel,
}: AssignmentPreviewProps) {
  const showPending = !!pendingName && (!currentName || changed)

  return (
    <div className="mb-4 rounded-lg border p-4">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Assignment Preview
      </p>

      {!currentName && !showPending && (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}

      {(currentName || showPending) && (
        <div className="space-y-2">
          {/* Name */}
          <div className="flex flex-wrap items-center gap-2">
            {currentName && (
              <span
                className={
                  changed
                    ? "font-medium text-muted-foreground line-through"
                    : "font-medium"
                }
              >
                {currentName}
              </span>
            )}

            {showPending && (
              <>
                {currentName && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}

                <span className="font-medium text-primary">{pendingName}</span>
              </>
            )}
          </div>

          {/* Rate */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {currentRate !== null && currentRate !== undefined && (
              <span
                className={changed ? "text-muted-foreground line-through" : ""}
              >
                Rp {currentRate.toLocaleString()} / {currentRateType}
              </span>
            )}

            {showPending && (
              <>
                {currentRate && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}

                <span className="text-primary">
                  Rp {pendingRate?.toLocaleString()} / {pendingRateType}
                </span>
              </>
            )}
          </div>

          {/* City */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {currentCity && (
              <span
                className={changed ? "text-muted-foreground line-through" : ""}
              >
                {currentCity}
              </span>
            )}

            {showPending && (
              <>
                {currentCity && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}

                <span className="text-primary">{pendingCity}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
