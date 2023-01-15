import './globals.css'
import Footer from '../ui-components/footer'
import Header from '../ui-components/header'

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body id="body">
        <Header />
        <div id="page">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
