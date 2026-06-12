"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const TanstackProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [quertyClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={quertyClient}>{children}</QueryClientProvider>
  )
}
