import { ReactNode } from 'react'
import { Navigation } from './Navigation'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
}