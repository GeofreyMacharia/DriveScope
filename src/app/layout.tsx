import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "DriveScope",
  description: "Find the car that goes furthest for your money.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
