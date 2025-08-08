import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import ReduxProvider from '@/providers/react-redux-provider'
import { ToastContainer } from 'react-toastify'
import PersistorProvider from '@/providers/persistor-provider'

export const metadata: Metadata = {
  title: 'Tasks App',
  description: 'Task management app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ToastContainer newestOnTop={true} pauseOnFocusLoss={true} />
        <ReduxProvider>
          <PersistorProvider>
            {children}
          </PersistorProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
