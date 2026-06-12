import { Geist, JetBrains_Mono, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TanstackProvider } from "@/components/providers/tanstack-provider"
import NavbarApp from "@/components/layouts/navbar-app"
import { Toaster } from "sonner"
import BreadcrumbApp from "@/components/layouts/breadcrumb-app"

const robotoHeading = Roboto({ subsets: ["latin"], variable: "--font-heading" })

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-mono",
        jetbrainsMono.variable,
        robotoHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TanstackProvider>
            <NavbarApp />
            <Toaster position="top-center" />
            <div className="container mx-auto mt-4">
              <div className="flex flex-col gap-4 p-6">
                <BreadcrumbApp />
                {children}
              </div>
            </div>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
